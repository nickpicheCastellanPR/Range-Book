import { useState } from "react";
import type { ChangeEvent } from "react";
import type { AppData, Club } from "../types";
import { generateId } from "../lib/math";
import { CLUB_PRESETS } from "../lib/clubPresets";
import { TentacleClub } from "../components/art/TentacleClub";

export function BagScreen({
  data,
  onUpdate,
  onOpenClub,
}: {
  data: AppData;
  onUpdate: (next: AppData) => void;
  onOpenClub: (clubId: string) => void;
}) {
  const [newName, setNewName] = useState("");

  const clubs = [...data.clubs].sort((a, b) => a.order - b.order);
  const active = clubs.filter((c) => c.active);
  const retired = clubs.filter((c) => !c.active);

  function addClubNamed(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const club: Club = {
      id: generateId(),
      name: trimmed,
      order: (data.clubs.reduce((max, c) => Math.max(max, c.order), -1) ?? -1) + 1,
      active: true,
      createdAt: new Date().toISOString(),
    };
    onUpdate({ ...data, clubs: [...data.clubs, club] });
  }

  function addClub() {
    addClubNamed(newName);
    setNewName("");
  }

  function addFromPreset(e: ChangeEvent<HTMLSelectElement>) {
    const name = e.target.value;
    if (!name) return;
    addClubNamed(name);
    e.target.value = "";
  }

  function toggleActive(club: Club) {
    onUpdate({
      ...data,
      clubs: data.clubs.map((c) =>
        c.id === club.id ? { ...c, active: !c.active } : c,
      ),
    });
  }

  function move(club: Club, dir: -1 | 1) {
    const sorted = [...active].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === club.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    onUpdate({
      ...data,
      clubs: data.clubs.map((c) => {
        if (c.id === a.id) return { ...c, order: b.order };
        if (c.id === b.id) return { ...c, order: a.order };
        return c;
      }),
    });
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-title">Add a club</div>
        <div className="stack">
          <select defaultValue="" onChange={addFromPreset}>
            <option value="" disabled>
              Quick add from bag list…
            </option>
            {CLUB_PRESETS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="row" style={{ gap: 8 }}>
            <input
              placeholder="Or type a custom name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addClub()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addClub}>
              Add
            </button>
          </div>
        </div>
      </div>

      {active.length === 0 && (
        <div className="empty-state">
          <TentacleClub className="art" />
          <p>The depths are empty. Add your first club above.</p>
        </div>
      )}

      {active.map((club) => (
        <div className="card" key={club.id}>
          <button
            onClick={() => onOpenClub(club.id)}
            style={{
              background: "none",
              border: "none",
              textAlign: "left",
              width: "100%",
              padding: 0,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>{club.name}</div>
            <div className="text-faint">Tap to view distances & trends</div>
          </button>
          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            <button className="btn btn-ghost btn-icon" onClick={() => move(club, -1)} aria-label="Move up">
              ↑
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => move(club, 1)} aria-label="Move down">
              ↓
            </button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => toggleActive(club)}>
              Retire
            </button>
          </div>
        </div>
      ))}

      {retired.length > 0 && (
        <>
          <div className="card-title" style={{ marginTop: 8 }}>
            Retired clubs
          </div>
          {retired.map((club) => (
            <div className="card" key={club.id}>
              <div className="row">
                <button
                  onClick={() => onOpenClub(club.id)}
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    flex: 1,
                    padding: 0,
                    color: "var(--text-dim)",
                  }}
                >
                  {club.name}
                </button>
                <button className="btn btn-ghost" onClick={() => toggleActive(club)}>
                  Restore
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
