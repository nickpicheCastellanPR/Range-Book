import { useMemo, useState } from "react";
import { LIES, SWING_LENGTHS, type AppData, type Lie } from "../types";
import { getRecommendations } from "../lib/recommend";
import { formatDispersion } from "../lib/dispersionText";
import { CompassRose } from "../components/art/CompassRose";

export function RangefinderScreen({ data }: { data: AppData }) {
  const [distance, setDistance] = useState("");
  const [minCarry, setMinCarry] = useState("");
  const [lie, setLie] = useState<Lie>("fairway");

  const distanceNum = parseFloat(distance);
  const isValidDistance = Number.isFinite(distanceNum) && distanceNum > 0;
  const minCarryNum = minCarry.trim() === "" ? undefined : parseFloat(minCarry);

  const recommendations = useMemo(() => {
    if (!isValidDistance) return [];
    return getRecommendations(data, {
      distance: distanceNum,
      lie,
      minCarry: minCarryNum,
    }).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidDistance, distanceNum, minCarryNum, lie, data]);

  const hazardBlocked =
    isValidDistance &&
    recommendations.length === 0 &&
    minCarryNum !== undefined &&
    minCarryNum > 0;

  const swingLabel = (key: string) =>
    SWING_LENGTHS.find((s) => s.key === key)?.label ?? key;

  const liePct = data.settings.lieAdjustments[lie] ?? 0;
  const pctLabel = (pct: number) => `${pct > 0 ? "+" : ""}${pct}%`;

  return (
    <div className="stack">
      <div className="card">
        <CompassRose size={130} className="compass-watermark" />
        <div className="card-title">Shot</div>
        <div className="stack">
          <div className="field">
            <label>Distance to target (yd)</label>
            <input
              inputMode="decimal"
              placeholder="e.g. 152"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Must carry (yd, optional — bunker, water, rough)</label>
            <input
              inputMode="decimal"
              placeholder="e.g. 140"
              value={minCarry}
              onChange={(e) => setMinCarry(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Lie</label>
            <div className="pill-group">
              {LIES.map((l) => {
                const pct = data.settings.lieAdjustments[l.key] ?? 0;
                return (
                  <button
                    key={l.key}
                    className={`pill${lie === l.key ? " active" : ""}`}
                    onClick={() => setLie(l.key)}
                  >
                    {l.label}
                    {pct !== 0 && ` ${pctLabel(pct)}`}
                  </button>
                );
              })}
            </div>
            {liePct !== 0 && (
              <p className="text-faint" style={{ marginTop: 2 }}>
                Every carry & total below is already reduced {Math.abs(liePct)}% for {LIES.find((l) => l.key === lie)?.label.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>

      {!isValidDistance && (
        <p className="text-faint" style={{ textAlign: "center", marginTop: 8 }}>
          Enter a distance to see club options.
        </p>
      )}

      {isValidDistance && recommendations.length === 0 && (
        <div className="empty-state">
          <CompassRose size={100} className="art" style={{ opacity: 0.5 }} />
          <p>
            {hazardBlocked
              ? `Nothing in your bag carries ${minCarryNum} yd in this lie — you'd need to lay up short of it.`
              : "No bearing yet — log a range session first."}
          </p>
        </div>
      )}

      {recommendations.map((rec, i) => (
        <div className="card rec-card" key={`${rec.clubId}-${rec.swingLength}`}>
          <div className={`rec-rank${i === 0 ? " best" : ""}`}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div className="row">
              <span style={{ fontWeight: 700 }}>{rec.clubName}</span>
              <span className="badge badge-muted">{swingLabel(rec.swingLength)}</span>
            </div>
            <div className="row" style={{ marginTop: 6 }}>
              <span className="text-faint">
                Carry {rec.adjustedCarry} · Total {rec.adjustedTotal} · Roll {rec.adjustedRollout}
              </span>
            </div>
            {liePct !== 0 && (
              <div className="text-faint" style={{ marginTop: 1, opacity: 0.75 }}>
                Fairway: {rec.baseStats.avgCarry} carry · {rec.baseStats.avgTotal} total
              </div>
            )}
            <div className="text-faint" style={{ marginTop: 2 }}>
              {rec.diffFromTarget === 0
                ? "Exact fit"
                : rec.diffFromTarget > 0
                  ? `${rec.diffFromTarget} yd long`
                  : `${Math.abs(rec.diffFromTarget)} yd short`}
              {rec.carryMargin !== undefined && (
                <span className="text-left"> · clears by {rec.carryMargin} yd</span>
              )}
              {rec.baseStats.avgDispersion !== 0 &&
                (() => {
                  const d = formatDispersion(rec.baseStats.avgDispersion, rec.baseStats.avgDispersionSpread);
                  return (
                    <>
                      {" · tends "}
                      <span className={d.className}>{d.text}</span>
                    </>
                  );
                })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
