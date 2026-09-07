/**
 * Stylized kraken emblem in the headcover's embroidered-patch style:
 * pointed squid-like mantle, flat teal fill with sucker-dot texture,
 * thick black outlines, five asymmetric tentacles, angry orange eyes.
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
        {/* tentacles, drawn behind the head, double-stroked for a thick ink outline.
            each one is a distinct shape/length/curl so nothing mirrors. */}
        <g fill="none">
          <path d="M62,108 C38,114 16,104 15,80 C14,62 30,49 47,52 C55,53 59,60 53,66" stroke="#0a1420" strokeWidth="15" />
          <path d="M62,108 C38,114 16,104 15,80 C14,62 30,49 47,52 C55,53 59,60 53,66" stroke="#3fb6a5" strokeWidth="8" />

          <path d="M76,120 C56,130 48,152 60,170 C68,182 82,184 87,172" stroke="#0a1420" strokeWidth="15" />
          <path d="M76,120 C56,130 48,152 60,170 C68,182 82,184 87,172" stroke="#4fd8c4" strokeWidth="8" />

          <path d="M98,126 C96,152 102,176 94,194 C90,202 80,202 78,192" stroke="#0a1420" strokeWidth="15" />
          <path d="M98,126 C96,152 102,176 94,194 C90,202 80,202 78,192" stroke="#3fb6a5" strokeWidth="8" />

          <path d="M116,118 C134,122 146,138 140,158 C136,172 120,178 112,168" stroke="#0a1420" strokeWidth="15" />
          <path d="M116,118 C134,122 146,138 140,158 C136,172 120,178 112,168" stroke="#4fd8c4" strokeWidth="8" />

          <path d="M128,102 C152,106 172,94 168,70 C165,53 146,45 133,53 C126,57 127,66 136,70" stroke="#0a1420" strokeWidth="15" />
          <path d="M128,102 C152,106 172,94 168,70 C165,53 146,45 133,53 C126,57 127,66 136,70" stroke="#3fb6a5" strokeWidth="8" />
        </g>

        {/* suckers along the tentacles for texture */}
        <g fill="#1c4d47">
          <circle cx="30" cy="88" r="3.6" />
          <circle cx="46" cy="66" r="3.2" />
          <circle cx="57" cy="145" r="3.6" />
          <circle cx="70" cy="168" r="3" />
          <circle cx="98" cy="160" r="3.4" />
          <circle cx="90" cy="188" r="3" />
          <circle cx="130" cy="140" r="3.4" />
          <circle cx="122" cy="166" r="3" />
          <circle cx="156" cy="80" r="3.6" />
          <circle cx="140" cy="58" r="3" />
        </g>

        {/* head — pointed mantle, squid-style */}
        <path
          d="M100,8 C112,8 121,22 124,42 L129,78 C131,100 118,114 100,118 C82,114 69,100 71,78 L76,42 C79,22 88,8 100,8 Z"
          fill="#5fe0cd"
          stroke="#0a1420"
          strokeWidth="8"
        />

        {/* mantle texture: scattered suckers instead of a flat shade split */}
        <g fill="#39a596" opacity="0.85">
          <circle cx="100" cy="26" r="4.2" />
          <circle cx="88" cy="40" r="3.4" />
          <circle cx="113" cy="44" r="3.6" />
          <circle cx="80" cy="60" r="3" />
          <circle cx="121" cy="62" r="3.2" />
          <circle cx="100" cy="100" r="3.6" />
          <circle cx="86" cy="94" r="2.8" />
          <circle cx="115" cy="92" r="3" />
        </g>

        {/* brow */}
        <path d="M64,64 C74,56 87,56 95,63" fill="none" stroke="#0a1420" strokeWidth="6" />
        <path d="M136,64 C126,56 113,56 105,63" fill="none" stroke="#0a1420" strokeWidth="6" />

        {/* eyes */}
        <ellipse cx="79" cy="76" rx="12" ry="16" transform="rotate(-18 79 76)" fill="#ff7a2e" stroke="#0a1420" strokeWidth="5" />
        <ellipse cx="121" cy="76" rx="12" ry="16" transform="rotate(18 121 76)" fill="#ff7a2e" stroke="#0a1420" strokeWidth="5" />
        <circle cx="79" cy="78" r="3.5" fill="#0a1420" />
        <circle cx="121" cy="78" r="3.5" fill="#0a1420" />

        {/* beak */}
        <path d="M92,95 L108,95 L100,106 Z" fill="#0a1420" />
      </g>
    </svg>
  );
}
