import { DEFAULT_SETTINGS, SWING_LENGTHS, type AppData } from "../types";

const STORAGE_KEY = "range-book:data:v1";

function emptyData(): AppData {
  return { version: 1, clubs: [], sessions: [], settings: DEFAULT_SETTINGS };
}

function normalize(parsed: Partial<AppData>): AppData {
  return {
    version: 1,
    clubs: Array.isArray(parsed.clubs) ? parsed.clubs : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return normalize(JSON.parse(raw) as Partial<AppData>);
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `fathom-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvField(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * One row per raw logged swing (not the trimmed average) — for dropping
 * into a spreadsheet. Not re-importable; use exportData()/JSON for backup.
 */
export function exportCsv(data: AppData): void {
  const clubName = new Map(data.clubs.map((c) => [c.id, c.name]));
  const swingLengthLabel = new Map(SWING_LENGTHS.map((s) => [s.key, s.label]));

  const header = ["Club", "Swing Length", "Date", "Swing #", "Carry", "Total", "Dispersion", "Kept in average"];
  const rows = [header.map(csvField).join(",")];

  const sorted = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));
  for (const session of sorted) {
    const kept = new Set(session.keptIndexes);
    session.swings.forEach((swing, i) => {
      rows.push(
        [
          csvField(clubName.get(session.clubId) ?? "Unknown club"),
          csvField(swingLengthLabel.get(session.swingLength) ?? session.swingLength),
          csvField(new Date(session.date).toISOString().slice(0, 10)),
          i + 1,
          swing.carry,
          swing.total,
          swing.dispersion,
          kept.has(i) ? "yes" : "no",
        ].join(","),
      );
    });
  }

  const BOM = "﻿"; // so Excel reads the file as UTF-8
  const blob = new Blob([BOM + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `fathom-swings-${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedFile(text: string): AppData {
  const parsed = JSON.parse(text) as Partial<AppData>;
  if (!parsed || !Array.isArray(parsed.clubs) || !Array.isArray(parsed.sessions)) {
    throw new Error("That file doesn't look like a Fathom backup.");
  }
  return normalize(parsed);
}
