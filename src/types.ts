export type SwingLength = "knee" | "hip" | "shoulder" | "full";

export const SWING_LENGTHS: { key: SwingLength; label: string; clock: string }[] = [
  { key: "knee", label: "Knee-high", clock: "7:30" },
  { key: "hip", label: "Hip-high", clock: "9:00" },
  { key: "shoulder", label: "Shoulder-high", clock: "10:30" },
  { key: "full", label: "Full swing", clock: "Full" },
];

export type Lie = "tee" | "fairway" | "first_cut" | "rough" | "sand";

export const LIES: { key: Lie; label: string }[] = [
  { key: "tee", label: "Tee" },
  { key: "fairway", label: "Fairway" },
  { key: "first_cut", label: "First Cut" },
  { key: "rough", label: "Rough" },
  { key: "sand", label: "Sand" },
];

export interface Club {
  id: string;
  name: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface SwingEntry {
  carry: number;
  total: number;
  /** signed yards: negative = left, positive = right */
  dispersion: number;
}

export interface RangeSession {
  id: string;
  clubId: string;
  swingLength: SwingLength;
  date: string;
  /** exactly 10 raw entries as logged */
  swings: SwingEntry[];
  /** indexes into swings[] that survived trimming (6 of 10) */
  keptIndexes: number[];
}

export interface ClubStats {
  avgCarry: number;
  avgTotal: number;
  avgRollout: number;
  avgDispersion: number;
  sessionCount: number;
  lastUpdated: string;
}

export interface Settings {
  lieAdjustments: Record<Lie, number>;
}

export interface AppData {
  version: number;
  clubs: Club[];
  sessions: RangeSession[];
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  lieAdjustments: {
    tee: 0,
    fairway: 0,
    first_cut: -3,
    rough: -8,
    sand: -20,
  },
};
