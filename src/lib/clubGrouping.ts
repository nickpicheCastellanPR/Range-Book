import type { Club } from "../types";
import { CLUB_PRESETS } from "./clubPresets";

export const GROUP_ORDER = ["Woods", "Hybrids", "Irons", "Wedges", "Putter", "Other"];

const PRESET_LOOKUP = new Map<string, { group: string; index: number }>();
CLUB_PRESETS.forEach((g) => {
  g.options.forEach((name, index) => {
    PRESET_LOOKUP.set(name.toLowerCase(), { group: g.group, index });
  });
});

const KEYWORD_GROUPS: [RegExp, string][] = [
  [/\bwood\b|\bdriver\b/i, "Woods"],
  [/\bhybrid\b/i, "Hybrids"],
  [/\biron\b/i, "Irons"],
  [/\bwedge\b/i, "Wedges"],
  [/\bputt/i, "Putter"],
];

/** Classifies a club name into a bag group + a sort position within it. */
export function classifyClub(name: string): { group: string; sortIndex: number } {
  const key = name.trim().toLowerCase();
  const preset = PRESET_LOOKUP.get(key);
  if (preset) return { group: preset.group, sortIndex: preset.index };

  for (const [pattern, group] of KEYWORD_GROUPS) {
    if (pattern.test(name)) {
      const leadingNumber = parseInt(name, 10);
      return { group, sortIndex: Number.isFinite(leadingNumber) ? leadingNumber : 50 };
    }
  }
  return { group: "Other", sortIndex: 0 };
}

export function groupOrderIndex(group: string): number {
  const i = GROUP_ORDER.indexOf(group);
  return i === -1 ? GROUP_ORDER.length : i;
}

export interface ClubGroupBucket {
  group: string;
  clubs: Club[];
}

/** Buckets clubs into Woods/Hybrids/Irons/Wedges/Putter/Other, each sorted by loft/type position. */
export function groupClubs(clubs: Club[]): ClubGroupBucket[] {
  const withMeta = clubs.map((club) => ({ club, ...classifyClub(club.name) }));
  const byGroup = new Map<string, typeof withMeta>();
  for (const item of withMeta) {
    if (!byGroup.has(item.group)) byGroup.set(item.group, []);
    byGroup.get(item.group)!.push(item);
  }
  for (const list of byGroup.values()) {
    list.sort((a, b) => a.sortIndex - b.sortIndex || a.club.order - b.club.order);
  }
  return [...byGroup.entries()]
    .sort((a, b) => groupOrderIndex(a[0]) - groupOrderIndex(b[0]))
    .map(([group, items]) => ({ group, clubs: items.map((i) => i.club) }));
}
