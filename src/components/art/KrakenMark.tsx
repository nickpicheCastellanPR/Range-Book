import { HEADER_MARK } from "../../lib/artAssets";

export function KrakenMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src={HEADER_MARK}
      width={size}
      height={size}
      className={className}
      alt="Fathom"
      style={{ borderRadius: "22%" }}
    />
  );
}
