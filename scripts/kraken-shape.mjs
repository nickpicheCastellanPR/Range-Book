// Shared geometry for the kraken mark: tapered "ribbon" tentacles built by
// offsetting a smoothed centerline, instead of uniform-width strokes (which
// read as stiff limbs). Used by generate-icons.mjs to build the static app
// icon SVG; src/components/art/KrakenMark.tsx re-implements the same math
// in TypeScript with the same anchor points, so the in-app mark matches.

function midpoint(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function quadPoint(p0, p1, p2, t) {
  const mt = 1 - t;
  return [
    mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

function smoothSamples(points, samplesPerSeg = 14) {
  if (points.length < 3) return points;
  const pts = [points[0]];
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = i === 0 ? points[0] : midpoint(points[i], points[i + 1]);
    const p1 = points[i + 1];
    const p2 = midpoint(points[i + 1], points[i + 2]);
    for (let s = 1; s <= samplesPerSeg; s++) {
      pts.push(quadPoint(p0, p1, p2, s / samplesPerSeg));
    }
  }
  return pts;
}

export function ribbonPath(points, baseR, tipR) {
  const samples = smoothSamples(points);
  const n = samples.length;
  const top = [];
  const bottom = [];
  for (let i = 0; i < n; i++) {
    const p = samples[i];
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(n - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / (n - 1);
    const r = baseR + (tipR - baseR) * Math.pow(t, 0.8);
    top.push([p[0] + nx * r, p[1] + ny * r]);
    bottom.push([p[0] - nx * r, p[1] - ny * r]);
  }
  const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  let d = `M ${fmt(top[0])} `;
  for (let i = 1; i < top.length; i++) d += `L ${fmt(top[i])} `;
  for (let i = bottom.length - 1; i >= 0; i--) d += `L ${fmt(bottom[i])} `;
  d += "Z";
  return d;
}

// six distinct tentacles: varied length/curl/direction, none hanging
// straight down the centerline, none mirrored pairs.
export const TENTACLES = [
  { pts: [[70, 100], [46, 112], [24, 104], [16, 82], [26, 64]], color: "#3fb6a5" },
  { pts: [[80, 112], [60, 132], [52, 158], [64, 178], [82, 184]], color: "#4fd8c4" },
  { pts: [[94, 118], [84, 142], [80, 164], [68, 176], [56, 172]], color: "#3fb6a5" },
  { pts: [[110, 118], [122, 138], [128, 158], [142, 168], [156, 162]], color: "#4fd8c4" },
  { pts: [[124, 110], [146, 124], [156, 148], [148, 170], [130, 176]], color: "#3fb6a5" },
  { pts: [[132, 100], [156, 108], [172, 96], [176, 74], [162, 58]], color: "#4fd8c4" },
];

// two tentacles for the "wrapped around a club" empty-state illustration
export const CLUB_TENTACLES = [
  { pts: [[40, 168], [24, 130], [50, 110], [70, 86], [54, 64], [40, 44], [52, 26]], baseR: 10, tipR: 3, color: "#4fd8c4" },
  { pts: [[92, 178], [112, 176], [118, 150], [90, 140]], baseR: 8, tipR: 3, color: "#3fb6a5" },
];

export function tentaclesSvg() {
  return TENTACLES.map(
    (t) =>
      `<path d="${ribbonPath(t.pts, 9, 2.5)}" fill="${t.color}" stroke="#08111a" stroke-width="4" stroke-linejoin="round"/>`,
  ).join("\n      ");
}

export const HEAD_PATH =
  "M100,8 C112,8 121,22 124,42 L129,78 C131,100 118,114 100,118 C82,114 69,100 71,78 L76,42 C79,22 88,8 100,8 Z";

export const MANTLE_DOTS = [
  [100, 26, 4.2],
  [88, 40, 3.4],
  [113, 44, 3.6],
  [80, 60, 3],
  [121, 62, 3.2],
  [100, 100, 3.6],
  [86, 94, 2.8],
  [115, 92, 3],
];

export function krakenGroupSvg() {
  const dots = MANTLE_DOTS.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join("");
  return `
      ${tentaclesSvg()}
      <path d="${HEAD_PATH}" fill="#5fe0cd" stroke="#08111a" stroke-width="8"/>
      <g fill="#39a596" opacity="0.85">${dots}</g>
      <path d="M64,64 C74,56 87,56 95,63" fill="none" stroke="#08111a" stroke-width="6" stroke-linecap="round"/>
      <path d="M136,64 C126,56 113,56 105,63" fill="none" stroke="#08111a" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="79" cy="76" rx="12" ry="16" transform="rotate(-18 79 76)" fill="#ff7a2e" stroke="#08111a" stroke-width="5"/>
      <ellipse cx="121" cy="76" rx="12" ry="16" transform="rotate(18 121 76)" fill="#ff7a2e" stroke="#08111a" stroke-width="5"/>
      <circle cx="79" cy="78" r="3.5" fill="#08111a"/>
      <circle cx="121" cy="78" r="3.5" fill="#08111a"/>
      <path d="M92,95 L108,95 L100,106 Z" fill="#08111a"/>`;
}

export function renderIconSvg() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c2f40"/>
      <stop offset="1" stop-color="#0b131c"/>
    </linearGradient>
    <clipPath id="clip"><rect width="512" height="512" rx="112"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="512" height="512" fill="url(#bg)"/>
    <g transform="translate(76,34) scale(1.8)" stroke-linecap="round" stroke-linejoin="round">${krakenGroupSvg()}
    </g>
    <g transform="translate(0,404)">
      <path d="M0,44 C40,10 80,10 120,44 C160,78 200,78 240,44 C280,10 320,10 360,44 C400,78 440,78 480,44 L512,44 L512,108 L0,108 Z" fill="#1c4d47"/>
      <path d="M0,34 C40,0 80,0 120,34 C160,68 200,68 240,34 C280,0 320,0 360,34 C400,68 440,68 480,34 L512,34 L512,108 L0,108 Z" fill="#4fd8c4"/>
      <path d="M0,34 C40,0 80,0 120,34 C160,68 200,68 240,34 C280,0 320,0 360,34 C400,68 440,68 480,34" fill="none" stroke="#dff4f0" stroke-width="5" stroke-linecap="round"/>
    </g>
  </g>
</svg>
`;
}
