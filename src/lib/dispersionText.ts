/** Shared "3 yd right (±5 yd)" formatting used across Log/Club Detail/Rangefinder. */
export function formatDispersion(
  avgDispersion: number,
  spread?: number,
): { text: string; className: string } {
  const className = avgDispersion === 0 ? "" : avgDispersion < 0 ? "text-left" : "text-right";
  const direction =
    avgDispersion === 0
      ? "Straight"
      : `${Math.abs(avgDispersion)} yd ${avgDispersion < 0 ? "left" : "right"}`;
  const text = spread !== undefined && spread > 0 ? `${direction} (±${spread} yd)` : direction;
  return { text, className };
}
