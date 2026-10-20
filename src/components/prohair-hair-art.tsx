// PROHAIR 2027 hero bezagi: oltin lenta o'ralgan soch tolasi (afisha uslubida, sof SVG)

// Soch tolasi atrofidagi lenta: [old tomondagi bo'lak, orqa tomondagi bo'lak]
const ribbonLoops: [string, string][] = [
  ['M102 70 Q172 125 242 110', 'M242 110 Q190 105 126 150'],
  ['M126 150 Q196 205 266 190', 'M266 190 Q210 185 150 230'],
  ['M150 230 Q219 285 288 270', 'M288 270 Q235 265 170 312'],
  ['M170 312 Q238 368 300 345', 'M300 345 Q332 330 342 296'],
];

const pearls: [number, number, number][] = [
  [300, 58, 14], [334, 138, 10], [92, 118, 8], [312, 232, 16], [78, 262, 9],
  [332, 412, 12], [118, 384, 6], [286, 502, 9], [58, 182, 5], [356, 300, 6],
];

// Deterministik "oltin chang" (SSR va klientda bir xil chiqishi uchun)
// Faqat butun sonli arifmetika — server (Node) va brauzerda bit-bab bir xil natija beradi.
// (Math.sin oxirgi xonalarda farq qilib, hydration xatosiga olib kelgan edi.)
const dust = Array.from({ length: 46 }, (_, i) => ({
  x: 60 + ((i * 97 + 13) % 300),
  y: 40 + ((i * 173 + 29) % 440),
  r: 0.8 + ((i * 7) % 5) * 0.45,
  o: 0.35 + ((i * 3) % 6) * 0.1,
}));

const sparkles: [number, number, number][] = [
  [262, 36, 9], [70, 92, 7], [356, 196, 8], [110, 300, 6], [312, 456, 7], [216, 160, 5],
];

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`}
      fill="#fff3c4"
    />
  );
}

export function ProhairHairArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 560" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id="ph-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#c084fc" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ph-strand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b2a4f" />
          <stop offset="55%" stopColor="#120a1c" />
          <stop offset="100%" stopColor="#050308" />
        </linearGradient>
        <linearGradient id="ph-strand-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#e9d5ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ph-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8650f" />
          <stop offset="35%" stopColor="#f7d774" />
          <stop offset="55%" stopColor="#fff1b8" />
          <stop offset="80%" stopColor="#e2a93b" />
          <stop offset="100%" stopColor="#8a5208" />
        </linearGradient>
        <radialGradient id="ph-pearl" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="35%" stopColor="#f3c75a" />
          <stop offset="75%" stopColor="#b7791f" />
          <stop offset="100%" stopColor="#6b3f06" />
        </radialGradient>
        <filter id="ph-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Fon nuri */}
      <ellipse cx="200" cy="260" rx="200" ry="250" fill="url(#ph-glow)" />
      <circle cx="120" cy="200" r="40" fill="#f0abfc" opacity="0.18" filter="url(#ph-soft)" />
      <circle cx="300" cy="380" r="56" fill="#e9b949" opacity="0.12" filter="url(#ph-soft)" />

      {/* Lentaning orqa bo'laklari (tola ortida) */}
      <path d="M58 38 Q80 70 102 70" fill="none" stroke="url(#ph-gold)" strokeWidth="9" strokeLinecap="round" opacity="0.6" />
      {ribbonLoops.map(([, back], i) => (
        <path key={`b${i}`} d={back} fill="none" stroke="url(#ph-gold)" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
      ))}

      {/* Soch tolasi va piyozchasi */}
      <path
        d="M146 0 C188 120 228 220 250 330 C266 400 292 452 262 502 C238 542 186 524 198 470 C208 424 226 382 214 332 C198 232 168 120 136 0 Z"
        fill="url(#ph-strand)"
      />
      <path
        d="M144 0 C182 120 214 220 236 330 C248 392 262 440 244 488"
        fill="none"
        stroke="url(#ph-strand-shine)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <ellipse cx="228" cy="470" rx="9" ry="22" fill="#ffffff" opacity="0.22" transform="rotate(-18 228 470)" />

      {/* Lentaning old bo'laklari (tola ustida) */}
      {ribbonLoops.map(([front], i) => (
        <g key={`f${i}`}>
          <path d={front} fill="none" stroke="url(#ph-gold)" strokeWidth="10" strokeLinecap="round" />
          <path d={front} fill="none" stroke="#fff6d0" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" transform="translate(0 -2.5)" />
        </g>
      ))}

      {/* Oltin chang */}
      {dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#f7d774" opacity={d.o} />
      ))}

      {/* Oltin marjonlar */}
      {pearls.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="url(#ph-pearl)" />
          <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.22} fill="#ffffff" opacity="0.85" />
        </g>
      ))}

      {sparkles.map(([x, y, s], i) => (
        <Sparkle key={i} x={x} y={y} s={s} />
      ))}
    </svg>
  );
}
