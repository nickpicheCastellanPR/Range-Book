import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { AppData, Club } from "../types";
import { generateId } from "../lib/math";
import { CLUB_PRESETS } from "../lib/clubPresets";
import { groupClubs } from "../lib/clubGrouping";
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

  const groupedActive = useMemo(() => groupClubs(active), [active]);

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

  function deleteClub(club: Club) {
    const sessionCount = data.sessions.filter((s) => s.clubId === club.id).length;
    const warning =
      sessionCount > 0
        ? `Delete ${club.name} and its ${sessionCount} logged session${sessionCount === 1 ? "" : "s"}? This can't be undone.`
        : `Delete ${club.name}? This can't be undone.`;
    if (!window.confirm(warning)) return;
    onUpdate({
      ...data,
      clubs: data.clubs.filter((c) => c.id !== club.id),
      sessions: data.sessions.filter((s) => s.clubId !== club.id),
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

      {groupedActive.map(({ group, clubs: groupClubs }) => (
        <details key={group} className="club-group" open>
          <summary className="club-group-summary">
            <span className="chevron">▶</span>
            {group}
            <span className="text-faint" style={{ marginLeft: "auto" }}>
              {groupClubs.length}
            </span>
          </summary>
          <div className="stack" style={{ marginTop: 8 }}>
            {groupClubs.map((club) => (
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
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => toggleActive(club)}>
                    Retire
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => deleteClub(club)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
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
                <button className="btn btn-danger" onClick={() => deleteClub(club)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
