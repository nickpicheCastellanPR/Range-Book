/** A tentacle wrapped around a golf club — used for empty states. */
export function TentacleClub({ size = 140, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 200" width={size} height={(size * 200) / 160} className={className} aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* club shaft */}
        <line x1="98" y1="14" x2="70" y2="150" stroke="#0a1420" strokeWidth="10" />
        <line x1="98" y1="14" x2="70" y2="150" stroke="#c7d2d6" strokeWidth="5" />
        {/* grip */}
        <rect x="90" y="10" width="16" height="34" rx="6" transform="rotate(11 98 27)" fill="#1c2a37" stroke="#0a1420" strokeWidth="4" />
        {/* clubhead (iron) */}
        <path
          d="M70,150 C64,146 54,146 46,152 C36,160 34,176 44,184 C56,192 78,188 86,176 C90,168 84,156 70,150 Z"
          fill="#c7d2d6"
          stroke="#0a1420"
          strokeWidth="6"
        />

        {/* tentacle wrapping the shaft, coiling upward */}
        <g fill="none">
          <path
            d="M40,168 C20,150 24,120 50,110 C78,100 76,74 54,64 C36,56 34,38 52,26"
            stroke="#0a1420"
            strokeWidth="17"
          />
          <path
            d="M40,168 C20,150 24,120 50,110 C78,100 76,74 54,64 C36,56 34,38 52,26"
            stroke="#4fd8c4"
            strokeWidth="10"
          />
          <circle cx="34" cy="140" r="4" fill="#1c4d47" />
          <circle cx="63" cy="94" r="4" fill="#1c4d47" />
          <circle cx="42" cy="52" r="4" fill="#1c4d47" />
        </g>

        {/* second, shorter tentacle curling from behind the head */}
        <g fill="none">
          <path d="M92,178 C110,178 122,164 116,148 C112,136 96,132 90,140" stroke="#0a1420" strokeWidth="15" />
          <path d="M92,178 C110,178 122,164 116,148 C112,136 96,132 90,140" stroke="#3fb6a5" strokeWidth="8" />
        </g>
      </g>
    </svg>
  );
}
