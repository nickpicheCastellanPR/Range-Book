import type { AppData, ClubStats, Lie, SwingLength } from "../types";
import { computeClubStats } from "./stats";
import { round1 } from "./math";

export interface Conditions {
  /** target distance, already elevation/slope-adjusted if the rangefinder provides that */
  distance: number;
  /** current temp in F; omit to skip temp adjustment */
  tempF?: number;
  lie: Lie;
  /** yards that must be carried in the air (bunker, water, rough) — clubs that don't clear it are excluded */
  minCarry?: number;
}

export interface Recommendation {
  clubId: string;
  clubName: string;
  swingLength: SwingLength;
  clubOrder: number;
  baseStats: ClubStats;
  adjustedCarry: number;
  adjustedTotal: number;
  adjustedRollout: number;
  diffFromTarget: number;
  /** adjustedCarry - minCarry, only set when a carry requirement was given */
  carryMargin?: number;
}

/** Adjusts a club's baseline carry/total for temperature and lie. */
export function adjustForConditions(
  stats: ClubStats,
  conditions: Conditions,
  settings: AppData["settings"],
): { carry: number; total: number } {
  let carry = stats.avgCarry;
  let total = stats.avgTotal;

  if (conditions.tempF !== undefined) {
    const deltaF = conditions.tempF - settings.tempBaselineF;
    const tempAdjust = (deltaF / 10) * settings.yardsPer10DegreesF;
    carry += tempAdjust;
    total += tempAdjust;
  }

  const liePct = settings.lieAdjustments[conditions.lie] ?? 0;
  const lieFactor = 1 + liePct / 100;
  carry *= lieFactor;
  total *= lieFactor;

  return { carry: round1(carry), total: round1(total) };
}

export function getRecommendations(
  data: AppData,
  conditions: Conditions,
): Recommendation[] {
  const results: Recommendation[] = [];

  for (const club of data.clubs) {
    if (!club.active) continue;
    for (const swingLengthDef of ["knee", "hip", "shoulder", "full"] as SwingLength[]) {
      const stats = computeClubStats(club, swingLengthDef, data.sessions);
      if (!stats) continue;

      const adjusted = adjustForConditions(stats, conditions, data.settings);
      const hasMinCarry = conditions.minCarry !== undefined && conditions.minCarry > 0;
      if (hasMinCarry && adjusted.carry < (conditions.minCarry as number)) continue;

      results.push({
        clubId: club.id,
        clubName: club.name,
        swingLength: swingLengthDef,
        clubOrder: club.order,
        baseStats: stats,
        adjustedCarry: adjusted.carry,
        adjustedTotal: adjusted.total,
        adjustedRollout: round1(adjusted.total - adjusted.carry),
        diffFromTarget: round1(adjusted.total - conditions.distance),
        carryMargin: hasMinCarry ? round1(adjusted.carry - (conditions.minCarry as number)) : undefined,
      });
    }
  }

  results.sort((a, b) => Math.abs(a.diffFromTarget) - Math.abs(b.diffFromTarget));
  return results;
}
