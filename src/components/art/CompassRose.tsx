import type { CSSProperties } from "react";

export function CompassRose({
  size = 120,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <g fill="var(--text)">
        <path d="M50,4 L58,46 L50,50 L42,46 Z" />
        <path d="M50,96 L58,54 L50,50 L42,54 Z" />
        <path d="M4,50 L46,42 L50,50 L46,58 Z" />
        <path d="M96,50 L54,42 L50,50 L54,58 Z" />
        <path opacity="0.6" d="M18,18 L47,44 L50,50 L44,47 Z" />
        <path opacity="0.6" d="M82,82 L53,56 L50,50 L56,53 Z" />
        <path opacity="0.6" d="M82,18 L56,47 L50,50 L53,44 Z" />
        <path opacity="0.6" d="M18,82 L44,53 L50,50 L47,56 Z" />
      </g>
      <circle cx="50" cy="50" r="3" fill="var(--text)" />
    </svg>
  );
}
