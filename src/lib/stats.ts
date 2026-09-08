import type { Club, ClubStats, RangeSession, SwingLength } from "../types";
import { avg, round1, stdev } from "./math";

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
      dispersionSpread: stdev(kept.map((k) => k.dispersion)),
      date: s.date,
    };
  });

  const avgCarry = avg(sessionAverages.map((s) => s.avgCarry));
  const avgTotal = avg(sessionAverages.map((s) => s.avgTotal));
  const avgDispersion = avg(sessionAverages.map((s) => s.avgDispersion));
  const avgDispersionSpread = avg(sessionAverages.map((s) => s.dispersionSpread));
  const lastUpdated = sessionAverages.reduce(
    (latest, s) => (s.date > latest ? s.date : latest),
    sessionAverages[0].date,
  );

  return {
    avgCarry: round1(avgCarry),
    avgTotal: round1(avgTotal),
    avgRollout: round1(avgTotal - avgCarry),
    avgDispersion: round1(avgDispersion),
    avgDispersionSpread: round1(avgDispersionSpread),
    sessionCount: relevant.length,
    lastUpdated,
  };
}

export interface MaxCarry {
  carry: number;
  total: number;
  date: string;
}

/**
 * Longest single carry ever recorded for this club/swing-length, pulled
 * from the raw swings (including ones the trimmed average drops as
 * outliers) — this is deliberately the "if you really catch one" number,
 * not a typical-shot number.
 */
export function getMaxCarry(
  club: Club,
  swingLength: SwingLength,
  sessions: RangeSession[],
): MaxCarry | null {
  const relevant = sessions.filter(
    (s) => s.clubId === club.id && s.swingLength === swingLength,
  );
  if (relevant.length === 0) return null;

  let best: MaxCarry | null = null;
  for (const session of relevant) {
    for (const swing of session.swings) {
      if (!best || swing.carry > best.carry) {
        best = { carry: swing.carry, total: swing.total, date: session.date };
      }
    }
  }
  return best;
}

export interface MaxTotal {
  total: number;
  carry: number;
  rollout: number;
  date: string;
}

/**
 * Longest single total distance (carry + roll) ever recorded — independent
 * of which swing had the longest carry, since a hot bounce can carry the
 * ball further downrange than your best-carry swing ever reached. Also
 * pulled from raw swings, not the trimmed average. This is the number
 * that actually answers "could this club reach a hazard beyond the
 * target?" — carry alone or rollout alone can each understate it.
 */
export function getMaxTotal(
  club: Club,
  swingLength: SwingLength,
  sessions: RangeSession[],
): MaxTotal | null {
  const relevant = sessions.filter(
    (s) => s.clubId === club.id && s.swingLength === swingLength,
  );
  if (relevant.length === 0) return null;

  let best: MaxTotal | null = null;
  for (const session of relevant) {
    for (const swing of session.swings) {
      if (!best || swing.total > best.total) {
        best = {
          total: swing.total,
          carry: swing.carry,
          rollout: round1(swing.total - swing.carry),
          date: session.date,
        };
      }
    }
  }
  return best;
}

export function getSessionTrimmedAverage(session: RangeSession) {
  const kept = session.keptIndexes.map((i) => session.swings[i]);
  return {
    avgCarry: round1(avg(kept.map((k) => k.carry))),
    avgTotal: round1(avg(kept.map((k) => k.total))),
    avgDispersion: round1(avg(kept.map((k) => k.dispersion))),
  };
}
