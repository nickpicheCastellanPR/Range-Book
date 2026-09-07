import type { SwingEntry } from "../types";
import { avg, round1 } from "./math";

export interface TrimResult {
  keptIndexes: number[];
  droppedIndexes: number[];
  avgCarry: number;
  avgTotal: number;
  avgRollout: number;
  avgDispersion: number;
}

/**
 * Drops the 2 shortest and 2 longest swings by carry distance, then
 * averages the remaining 6 for carry/total/dispersion. Mirrors standard
 * TrackMan/Toptracer range-session trimming.
 */
export function trimSwings(swings: SwingEntry[]): TrimResult {
  if (swings.length !== 10) {
    throw new Error("Expected exactly 10 swings");
  }

  const indexed = swings.map((s, i) => ({ ...s, i }));
  const sorted = [...indexed].sort((a, b) => a.carry - b.carry);
  const dropped = new Set([
    sorted[0].i,
    sorted[1].i,
    sorted[sorted.length - 1].i,
    sorted[sorted.length - 2].i,
  ]);

  const kept = indexed.filter((s) => !dropped.has(s.i));
  const avgCarry = round1(avg(kept.map((s) => s.carry)));
  const avgTotal = round1(avg(kept.map((s) => s.total)));

  return {
    keptIndexes: kept.map((s) => s.i).sort((a, b) => a - b),
    droppedIndexes: [...dropped].sort((a, b) => a - b),
    avgCarry,
    avgTotal,
    avgRollout: round1(avgTotal - avgCarry),
    avgDispersion: round1(avg(kept.map((s) => s.dispersion))),
  };
}
