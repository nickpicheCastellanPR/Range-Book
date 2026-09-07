import { useRef, useState } from "react";
import { LIES, type AppData } from "../types";
import { exportData, parseImportedFile } from "../lib/storage";

export function SettingsScreen({
  data,
  onUpdate,
  onReplaceAll,
}: {
  data: AppData;
  onUpdate: (next: AppData) => void;
  onReplaceAll: (next: AppData) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmImport, setConfirmImport] = useState<AppData | null>(null);

  function updateSettings(patch: Partial<AppData["settings"]>) {
    onUpdate({ ...data, settings: { ...data.settings, ...patch } });
  }

  function updateLieAdjustment(lie: string, pct: number) {
    updateSettings({
      lieAdjustments: { ...data.settings.lieAdjustments, [lie]: pct } as AppData["settings"]["lieAdjustments"],
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImportedFile(text);
      setConfirmImport(parsed);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Temperature heuristic</div>
        <div className="stack">
          <div className="field">
            <label>Baseline temp (°F)</label>
            <input
              type="number"
              value={data.settings.tempBaselineF}
              onChange={(e) => updateSettings({ tempBaselineF: Number(e.target.value) })}
            />
          </div>
          <div className="field">
            <label>Yards adjustment per 10°F from baseline</label>
            <input
              type="number"
              step="0.5"
              value={data.settings.yardsPer10DegreesF}
              onChange={(e) => updateSettings({ yardsPer10DegreesF: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Lie adjustment (% carry)</div>
        <div className="stack">
          {LIES.map((l) => (
            <div className="row" key={l.key}>
              <span className="text-dim">{l.label}</span>
              <input
                type="number"
                style={{ width: 80, textAlign: "right" }}
                value={data.settings.lieAdjustments[l.key]}
                onChange={(e) => updateLieAdjustment(l.key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
        <p className="text-faint" style={{ marginTop: 8 }}>
          Negative = shorter carry for that lie (e.g. rough −8%).
        </p>
      </div>

      <div className="card">
        <div className="card-title">Backup</div>
        <div className="stack">
          <button className="btn btn-block" onClick={() => exportData(data)}>
            Export backup (.json)
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => fileInput.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          {importError && <p className="text-faint" style={{ color: "var(--danger)" }}>{importError}</p>}
        </div>
      </div>

      {confirmImport && (
        <div className="card" style={{ borderColor: "var(--warn)" }}>
          <div className="card-title">Confirm import</div>
          <p className="text-dim">
            This will replace all current data with {confirmImport.clubs.length} clubs and{" "}
            {confirmImport.sessions.length} sessions from the backup file. This can't be undone.
          </p>
          <div className="row" style={{ marginTop: 10, gap: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmImport(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                onReplaceAll(confirmImport);
                setConfirmImport(null);
              }}
            >
              Replace data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
