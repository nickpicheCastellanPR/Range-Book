import { useMemo, useState } from "react";
import type { AppData, RangeSession, SwingLength } from "../types";
import { ClubPicker } from "../components/ClubPicker";
import { SwingLengthPicker } from "../components/SwingLengthPicker";
import { trimSwings } from "../lib/trimming";
import { generateId } from "../lib/math";

interface DraftSwing {
  carry: string;
  total: string;
  dispersion: string;
}

function emptyDraft(): DraftSwing[] {
  return Array.from({ length: 10 }, () => ({ carry: "", total: "", dispersion: "" }));
}

export function LogSessionScreen({
  data,
  onUpdate,
}: {
  data: AppData;
  onUpdate: (next: AppData) => void;
}) {
  const [clubId, setClubId] = useState<string | null>(null);
  const [swingLength, setSwingLength] = useState<SwingLength>("full");
  const [swings, setSwings] = useState<DraftSwing[]>(emptyDraft());
  const [saved, setSaved] = useState(false);

  const parsed = swings.map((s) => ({
    carry: parseFloat(s.carry),
    total: parseFloat(s.total),
    dispersion: parseFloat(s.dispersion || "0"),
  }));

  const allFilled = parsed.every(
    (s) => Number.isFinite(s.carry) && Number.isFinite(s.total),
  );

  const preview = useMemo(() => {
    if (!allFilled) return null;
    try {
      return trimSwings(parsed);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilled, JSON.stringify(swings)]);

  function updateSwing(i: number, field: keyof DraftSwing, value: string) {
    setSaved(false);
    setSwings((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );
  }

  function save() {
    if (!clubId || !preview) return;
    const session: RangeSession = {
      id: generateId(),
      clubId,
      swingLength,
      date: new Date().toISOString(),
      swings: parsed,
      keptIndexes: preview.keptIndexes,
    };
    onUpdate({ ...data, sessions: [...data.sessions, session] });
    setSwings(emptyDraft());
    setSaved(true);
  }

  const club = data.clubs.find((c) => c.id === clubId);

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Club</div>
        <ClubPicker clubs={data.clubs} value={clubId} onChange={setClubId} />
      </div>

      <div className="card">
        <div className="card-title">Swing length</div>
        <SwingLengthPicker value={swingLength} onChange={setSwingLength} />
      </div>

      <div className="card">
        <div className="card-title">
          10 swings · carry / total / dispersion (yd, − left / + right)
        </div>
        <div className="stack" style={{ gap: 0 }}>
          {swings.map((s, i) => {
            const dropped = preview?.droppedIndexes.includes(i);
            return (
              <div className={`swing-row${dropped ? " dropped" : ""}`} key={i}>
                <span className="idx">{i + 1}</span>
                <input
                  inputMode="decimal"
                  placeholder="Carry"
                  value={s.carry}
                  onChange={(e) => updateSwing(i, "carry", e.target.value)}
                />
                <input
                  inputMode="decimal"
                  placeholder="Total"
                  value={s.total}
                  onChange={(e) => updateSwing(i, "total", e.target.value)}
                />
                <input
                  inputMode="decimal"
                  placeholder="±yd"
                  value={s.dispersion}
                  onChange={(e) => updateSwing(i, "dispersion", e.target.value)}
                />
              </div>
            );
          })}
        </div>
        {preview && (
          <p className="text-faint" style={{ marginTop: 8 }}>
            Dimmed rows were dropped (2 shortest, 2 longest by carry).
          </p>
        )}
      </div>

      {preview && (
        <div className="card">
          <div className="card-title">Trimmed average (6 of 10 kept)</div>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="value">{preview.avgCarry}</div>
              <div className="label">Carry</div>
            </div>
            <div className="stat-box">
              <div className="value">{preview.avgTotal}</div>
              <div className="label">Total</div>
            </div>
            <div className="stat-box">
              <div className="value">{preview.avgRollout}</div>
              <div className="label">Rollout</div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span className="text-dim">Avg dispersion</span>
            <span style={{ fontWeight: 700 }}>
              {preview.avgDispersion === 0
                ? "Straight"
                : `${Math.abs(preview.avgDispersion)} yd ${preview.avgDispersion < 0 ? "left" : "right"}`}
            </span>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-block"
        disabled={!clubId || !preview}
        onClick={save}
      >
        {club ? `Save session for ${club.name}` : "Select a club to save"}
      </button>

      {saved && <p className="text-faint" style={{ textAlign: "center" }}>Session saved ✓</p>}
    </div>
  );
}
