import { useRef, useState } from "react";
import { LIES, type AppData } from "../types";
import { exportCsv, exportData, parseImportedFile } from "../lib/storage";

export function SettingsScreen({
  data,
  onUpdate,
  onReplaceAll,
  onShowAbout,
}: {
  data: AppData;
  onUpdate: (next: AppData) => void;
  onReplaceAll: (next: AppData) => void;
  onShowAbout: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmImport, setConfirmImport] = useState<AppData | null>(null);
  const [copied, setCopied] = useState(false);

  const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(appUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = appUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // clipboard unavailable — the visible input below still lets them select/copy manually
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        <div className="card-title">Share</div>
        <p className="text-dim">
          Send this link to a friend — they'll get their own separate, empty bag on their device.
        </p>
        <input readOnly value={appUrl} style={{ marginTop: 8 }} onFocus={(e) => e.target.select()} />
        <button className="btn btn-block" style={{ marginTop: 8 }} onClick={copyLink}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      <div className="card">
        <div className="card-title">Help</div>
        <button className="btn btn-block" onClick={onShowAbout}>
          About & how to use this app
        </button>
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
        <p className="text-faint" style={{ marginTop: 8 }}>
          The JSON backup is the only file that can be re-imported — keep one before switching phones.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Export to spreadsheet</div>
        <p className="text-dim">
          Every logged swing — club, date, carry, total, dispersion, and whether it was one of the 6 kept in the
          average — as one row each.
        </p>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => exportCsv(data)}>
          Export swings (.csv)
        </button>
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
