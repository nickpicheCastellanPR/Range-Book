interface TrendPoint {
  date: string;
  avgCarry: number;
  avgTotal: number;
}

export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) {
    return (
      <p className="text-faint">Log another session to start seeing a trend.</p>
    );
  }

  const width = 300;
  const height = 120;
  const padX = 8;
  const padY = 14;

  const allValues = points.flatMap((p) => [p.avgCarry, p.avgTotal]);
  const min = Math.min(...allValues) - 5;
  const max = Math.max(...allValues) + 5;

  const x = (i: number) =>
    padX + (i / (points.length - 1)) * (width - padX * 2);
  const y = (v: number) =>
    height - padY - ((v - min) / (max - min || 1)) * (height - padY * 2);

  const pathFor = (key: "avgCarry" | "avgTotal") =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`)
      .join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        <path
          d={pathFor("avgTotal")}
          fill="none"
          stroke="var(--text-faint)"
          strokeWidth="2"
        />
        <path
          d={pathFor("avgCarry")}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.avgCarry)} r="2.5" fill="var(--accent)" />
        ))}
      </svg>
      <div className="row" style={{ marginTop: 4 }}>
        <span className="text-faint">
          <span style={{ color: "var(--accent)" }}>●</span> Carry
        </span>
        <span className="text-faint">
          <span style={{ color: "var(--text-faint)" }}>●</span> Total
        </span>
      </div>
    </div>
  );
}
