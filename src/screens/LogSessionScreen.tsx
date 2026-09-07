import { useMemo, useRef, useState } from "react";
import type { AppData, RangeSession, SwingLength } from "../types";
import { ClubPicker } from "../components/ClubPicker";
import { SwingLengthPicker } from "../components/SwingLengthPicker";
import { trimSwings } from "../lib/trimming";
import { generateId } from "../lib/math";
import { formatDispersion } from "../lib/dispersionText";

type Direction = "left" | "right";

interface DraftSwing {
  carry: string;
  total: string;
  dispersionMag: string;
  dispersionDir: Direction;
}

function emptyDraft(): DraftSwing[] {
  return Array.from({ length: 10 }, () => ({
    carry: "",
    total: "",
    dispersionMag: "",
    dispersionDir: "right" as Direction,
  }));
}

const FIELDS_PER_ROW = 3; // carry, total, dispersionMag — the three focusable inputs

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const parsed = swings.map((s) => {
    const mag = parseFloat(s.dispersionMag || "0");
    return {
      carry: parseFloat(s.carry),
      total: parseFloat(s.total),
      dispersion: s.dispersionDir === "left" ? -mag : mag,
    };
  });

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

  const rowWarnings = parsed.map((s) => {
    if (!Number.isFinite(s.carry) || !Number.isFinite(s.total)) return null;
    if (s.total < s.carry) return "Total is less than carry — double check this row.";
    if (s.carry < 10) return "That carry looks short — check for a missing digit.";
    if (s.carry > 380) return "That carry looks long — check for an extra digit.";
    return null;
  });

  function updateField(i: number, field: "carry" | "total" | "dispersionMag", value: string) {
    setSaved(false);
    setSwings((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function updateDir(i: number, dir: Direction) {
    setSaved(false);
    setSwings((prev) => prev.map((s, idx) => (idx === i ? { ...s, dispersionDir: dir } : s)));
  }

  function focusField(index: number) {
    inputRefs.current[index]?.focus();
  }

  function handleEnter(index: number) {
    const next = index + 1;
    if (next < swings.length * FIELDS_PER_ROW) {
      focusField(next);
    } else {
      inputRefs.current[index]?.blur();
    }
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
    focusField(0);
  }

  const club = data.clubs.find((c) => c.id === clubId);
  const hasActiveClubs = data.clubs.some((c) => c.active);

  return (
    <div className="stack">
      {!hasActiveClubs && (
        <p className="text-faint" style={{ textAlign: "center", marginTop: 8 }}>
          You haven't added any clubs yet — head to the Bag tab first.
        </p>
      )}

      <div className="card">
        <div className="card-title">Club</div>
        <ClubPicker clubs={data.clubs} value={clubId} onChange={setClubId} />
      </div>

      <div className="card">
        <div className="card-title">Swing length</div>
        <SwingLengthPicker value={swingLength} onChange={setSwingLength} />
      </div>

      <div className="card">
        <div className="card-title">10 swings · carry / total / dispersion</div>
        <p className="text-faint" style={{ marginTop: -4, marginBottom: 10 }}>
          We drop your 2 shortest and 2 longest carries and average the remaining 6 — one chunk or one flush
          strike won't skew your number. Tip: hit "next" on the keyboard to move field to field without tapping.
        </p>
        <div className="stack" style={{ gap: 0 }}>
          {swings.map((s, i) => {
            const dropped = preview?.droppedIndexes.includes(i);
            const base = i * FIELDS_PER_ROW;
            const warning = rowWarnings[i];
            return (
              <div key={i}>
                <div className={`swing-row${dropped ? " dropped" : ""}`}>
                  <span className="idx">{i + 1}</span>
                  <input
                    ref={(el) => {
                      inputRefs.current[base] = el;
                    }}
                    inputMode="decimal"
                    enterKeyHint="next"
                    placeholder="Carry"
                    value={s.carry}
                    onChange={(e) => updateField(i, "carry", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleEnter(base))}
                  />
                  <input
                    ref={(el) => {
                      inputRefs.current[base + 1] = el;
                    }}
                    inputMode="decimal"
                    enterKeyHint="next"
                    placeholder="Total"
                    value={s.total}
                    onChange={(e) => updateField(i, "total", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleEnter(base + 1))}
                  />
                  <div className="dispersion-cell">
                    <input
                      ref={(el) => {
                        inputRefs.current[base + 2] = el;
                      }}
                      inputMode="decimal"
                      enterKeyHint={i === swings.length - 1 ? "done" : "next"}
                      placeholder="yd"
                      value={s.dispersionMag}
                      onChange={(e) => updateField(i, "dispersionMag", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleEnter(base + 2))}
                    />
                    <div className="lr-toggle">
                      <button
                        type="button"
                        className={s.dispersionDir === "left" ? "active" : ""}
                        onClick={() => updateDir(i, "left")}
                        aria-label="Missed left"
                      >
                        L
                      </button>
                      <button
                        type="button"
                        className={s.dispersionDir === "right" ? "active" : ""}
                        onClick={() => updateDir(i, "right")}
                        aria-label="Missed right"
                      >
                        R
                      </button>
                    </div>
                  </div>
                </div>
                {warning && (
                  <p className="text-faint" style={{ color: "var(--warn)", marginTop: -2, marginBottom: 4 }}>
                    {warning}
                  </p>
                )}
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
            {(() => {
              const d = formatDispersion(preview.avgDispersion, preview.dispersionSpread);
              return <span className={d.className}>{d.text}</span>;
            })()}
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
