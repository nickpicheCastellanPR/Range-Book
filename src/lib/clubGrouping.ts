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
