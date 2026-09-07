import { SWING_LENGTHS, type SwingLength } from "../types";

export function SwingLengthPicker({
  value,
  onChange,
}: {
  value: SwingLength;
  onChange: (v: SwingLength) => void;
}) {
  return (
    <div className="pill-group">
      {SWING_LENGTHS.map((sl) => (
        <button
          key={sl.key}
          className={`pill${value === sl.key ? " active" : ""}`}
          onClick={() => onChange(sl.key)}
        >
          {sl.label} · {sl.clock}
        </button>
      ))}
    </div>
  );
}
