/**
 * Stylized kraken emblem in the headcover's embroidered-patch style:
 * flat teal fills, thick black outlines, angry orange eyes.
 */
export function KrakenMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Kraken emblem"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* tentacles, drawn behind the head, double-stroked for a thick ink outline */}
        <g fill="none">
          <path d="M66,108 C44,118 24,112 18,90 C13,72 24,56 42,54" stroke="#0a1420" strokeWidth="15" />
          <path d="M66,108 C44,118 24,112 18,90 C13,72 24,56 42,54" stroke="#3fb6a5" strokeWidth="8" />

          <path d="M80,124 C64,148 62,176 82,190 C92,197 103,192 100,180" stroke="#0a1420" strokeWidth="15" />
          <path d="M80,124 C64,148 62,176 82,190 C92,197 103,192 100,180" stroke="#3fb6a5" strokeWidth="8" />

          <path d="M100,128 C99,156 92,182 106,196" stroke="#0a1420" strokeWidth="15" />
          <path d="M100,128 C99,156 92,182 106,196" stroke="#4fd8c4" strokeWidth="8" />

          <path d="M120,124 C136,148 138,176 118,190 C108,197 97,192 100,180" stroke="#0a1420" strokeWidth="15" />
          <path d="M120,124 C136,148 138,176 118,190 C108,197 97,192 100,180" stroke="#3fb6a5" strokeWidth="8" />

          <path d="M134,108 C156,118 176,112 182,90 C187,72 176,56 158,54" stroke="#0a1420" strokeWidth="15" />
          <path d="M134,108 C156,118 176,112 182,90 C187,72 176,56 158,54" stroke="#3fb6a5" strokeWidth="8" />
        </g>

        {/* head */}
        <path
          d="M100,20 C132,20 150,46 147,76 C145,98 128,116 100,120 C72,116 55,98 53,76 C50,46 68,20 100,20 Z"
          fill="#5fe0cd"
          stroke="#0a1420"
          strokeWidth="8"
        />
        {/* head shading */}
        <path
          d="M100,20 C132,20 150,46 147,76 C145,98 128,116 100,120 L100,20 Z"
          fill="#39a596"
          opacity="0.55"
        />

        {/* brow */}
        <path d="M66,66 C76,58 88,58 96,64" fill="none" stroke="#0a1420" strokeWidth="6" />
        <path d="M134,66 C124,58 112,58 104,64" fill="none" stroke="#0a1420" strokeWidth="6" />

        {/* eyes */}
        <ellipse cx="80" cy="78" rx="12" ry="16" transform="rotate(-18 80 78)" fill="#ff7a2e" stroke="#0a1420" strokeWidth="5" />
        <ellipse cx="120" cy="78" rx="12" ry="16" transform="rotate(18 120 78)" fill="#ff7a2e" stroke="#0a1420" strokeWidth="5" />
        <circle cx="80" cy="80" r="3.5" fill="#0a1420" />
        <circle cx="120" cy="80" r="3.5" fill="#0a1420" />

        {/* beak */}
        <path d="M92,96 L108,96 L100,107 Z" fill="#0a1420" />
      </g>
    </svg>
  );
}
