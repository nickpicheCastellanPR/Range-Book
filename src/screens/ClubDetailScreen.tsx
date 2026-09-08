import { SWING_LENGTHS, type AppData, type RangeSession, type SwingLength } from "../types";
import { computeClubStats, getMaxCarry, getMaxTotal, getSessionTrimmedAverage } from "../lib/stats";
import { formatDispersion } from "../lib/dispersionText";
import { TrendChart } from "../components/TrendChart";
import { WaveDivider } from "../components/art/WaveDivider";
import { CompassRose } from "../components/art/CompassRose";

export function ClubDetailScreen({
  data,
  clubId,
  onUpdate,
  onBack,
}: {
  data: AppData;
  clubId: string;
  onUpdate: (next: AppData) => void;
  onBack: () => void;
}) {
  const club = data.clubs.find((c) => c.id === clubId);
  if (!club) return null;

  function deleteSession(session: RangeSession) {
    const label = new Date(session.date).toLocaleDateString();
    if (!window.confirm(`Delete the session logged on ${label}? This can't be undone.`)) return;
    onUpdate({ ...data, sessions: data.sessions.filter((s) => s.id !== session.id) });
  }

  return (
    <div className="stack">
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back to bag
      </button>

      <h2 style={{ fontSize: 22 }}>{club.name}</h2>
      <WaveDivider />

      {SWING_LENGTHS.map((sl) => {
        const stats = computeClubStats(club, sl.key as SwingLength, data.sessions);
        const maxCarry = getMaxCarry(club, sl.key as SwingLength, data.sessions);
        const maxTotal = getMaxTotal(club, sl.key as SwingLength, data.sessions);
        const sessions = data.sessions
          .filter((s) => s.clubId === club.id && s.swingLength === sl.key)
          .sort((a, b) => a.date.localeCompare(b.date));

        return (
          <div className="card" key={sl.key}>
            {stats && <CompassRose size={110} className="compass-watermark" />}
            <div className="card-title">
              {sl.label} · {sl.clock}
            </div>

            {!stats ? (
              <p className="text-faint">No sessions logged yet.</p>
            ) : (
              <>
                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="value">{stats.avgCarry}</div>
                    <div className="label">Carry</div>
                  </div>
                  <div className="stat-box">
                    <div className="value">{stats.avgTotal}</div>
                    <div className="label">Total</div>
                  </div>
                  <div className="stat-box">
                    <div className="value">{stats.avgRollout}</div>
                    <div className="label">Rollout</div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <span className="text-dim">Avg dispersion</span>
                  {(() => {
                    const d = formatDispersion(stats.avgDispersion, stats.avgDispersionSpread);
                    return <span className={d.className}>{d.text}</span>;
                  })()}
                </div>
                {maxCarry && (
                  <div className="row" style={{ marginTop: 6 }}>
                    <span className="text-dim">Longest carry</span>
                    <span style={{ fontWeight: 700, color: "var(--warn)" }}>
                      {maxCarry.carry} yd
                    </span>
                  </div>
                )}
                {maxTotal && (
                  <div className="row" style={{ marginTop: 6 }}>
                    <span className="text-dim">Longest total</span>
                    <span style={{ fontWeight: 700, color: "var(--warn)" }}>
                      {maxTotal.total} yd
                      <span className="text-faint" style={{ fontWeight: 400 }}>
                        {" "}
                        ({maxTotal.carry} carry + {maxTotal.rollout} roll)
                      </span>
                    </span>
                  </div>
                )}
                <p className="text-faint" style={{ marginTop: 4 }}>
                  From {stats.sessionCount} session{stats.sessionCount === 1 ? "" : "s"}
                </p>

                <div style={{ marginTop: 14 }}>
                  <TrendChart
                    points={sessions.map((s) => {
                      const avg = getSessionTrimmedAverage(s);
                      return { date: s.date, avgCarry: avg.avgCarry, avgTotal: avg.avgTotal };
                    })}
                  />
                </div>

                <details style={{ marginTop: 12 }}>
                  <summary className="text-dim" style={{ cursor: "pointer" }}>
                    Session history ({sessions.length})
                  </summary>
                  <div className="stack" style={{ marginTop: 8 }}>
                    {[...sessions].reverse().map((s) => {
                      const avg = getSessionTrimmedAverage(s);
                      return (
                        <div className="row" key={s.id}>
                          <span className="text-faint">
                            {new Date(s.date).toLocaleDateString()} — {avg.avgCarry}/{avg.avgTotal} yd
                          </span>
                          <button
                            className="btn btn-danger"
                            style={{ padding: "4px 10px" }}
                            onClick={() => deleteSession(s)}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
