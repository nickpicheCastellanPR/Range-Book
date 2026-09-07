import { DEFAULT_SETTINGS, type AppData } from "../types";

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
  a.download = `range-book-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedFile(text: string): AppData {
  const parsed = JSON.parse(text) as Partial<AppData>;
  if (!parsed || !Array.isArray(parsed.clubs) || !Array.isArray(parsed.sessions)) {
    throw new Error("That file doesn't look like a Range Book backup.");
  }
  return normalize(parsed);
}
