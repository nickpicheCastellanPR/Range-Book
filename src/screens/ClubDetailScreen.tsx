import { SWING_LENGTHS, type AppData, type SwingLength } from "../types";
import { computeClubStats, getSessionTrimmedAverage } from "../lib/stats";
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

  function deleteSession(sessionId: string) {
    onUpdate({ ...data, sessions: data.sessions.filter((s) => s.id !== sessionId) });
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
                  <span className={stats.avgDispersion === 0 ? "" : stats.avgDispersion < 0 ? "text-left" : "text-right"}>
                    {stats.avgDispersion === 0
                      ? "Straight"
                      : `${Math.abs(stats.avgDispersion)} yd ${stats.avgDispersion < 0 ? "left" : "right"}`}
                  </span>
                </div>
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
                            onClick={() => deleteSession(s.id)}
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
