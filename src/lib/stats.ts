import type { Club, ClubStats, RangeSession, SwingLength } from "../types";
import { avg, round1 } from "./math";

export function computeClubStats(
  club: Club,
  swingLength: SwingLength,
  sessions: RangeSession[],
): ClubStats | null {
  const relevant = sessions.filter(
    (s) => s.clubId === club.id && s.swingLength === swingLength,
  );
  if (relevant.length === 0) return null;

  const sessionAverages = relevant.map((s) => {
    const kept = s.keptIndexes.map((i) => s.swings[i]);
    return {
      avgCarry: avg(kept.map((k) => k.carry)),
      avgTotal: avg(kept.map((k) => k.total)),
      avgDispersion: avg(kept.map((k) => k.dispersion)),
      date: s.date,
    };
  });

  const avgCarry = avg(sessionAverages.map((s) => s.avgCarry));
  const avgTotal = avg(sessionAverages.map((s) => s.avgTotal));
  const avgDispersion = avg(sessionAverages.map((s) => s.avgDispersion));
  const lastUpdated = sessionAverages.reduce(
    (latest, s) => (s.date > latest ? s.date : latest),
    sessionAverages[0].date,
  );

  return {
    avgCarry: round1(avgCarry),
    avgTotal: round1(avgTotal),
    avgRollout: round1(avgTotal - avgCarry),
    avgDispersion: round1(avgDispersion),
    sessionCount: relevant.length,
    lastUpdated,
  };
}

export function getSessionTrimmedAverage(session: RangeSession) {
  const kept = session.keptIndexes.map((i) => session.swings[i]);
  return {
    avgCarry: round1(avg(kept.map((k) => k.carry))),
    avgTotal: round1(avg(kept.map((k) => k.total))),
    avgDispersion: round1(avg(kept.map((k) => k.dispersion))),
  };
}
