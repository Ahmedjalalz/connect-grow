/**
 * Hanging telephone receiver with a classic coiled spring cord.
 * Pure SVG + CSS so it swings gently and pulses sound waves from the earpiece.
 */

function coilPath(startY: number, endY: number, coils: number, width: number) {
  const step = (endY - startY) / coils;
  let d = `M0 ${startY}`;
  for (let i = 0; i < coils; i++) {
    const y0 = startY + i * step;
    const dir = i % 2 === 0 ? 1 : -1;
    d += ` C ${dir * width} ${y0 + step * 0.25}, ${dir * width} ${y0 + step * 0.75}, 0 ${y0 + step}`;
  }
  return d;
}

export function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* halo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--navy-soft) 22%, transparent), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 340 560"
        className="relative w-full"
        role="img"
        aria-label="A telephone receiver hanging from a coiled cord"
      >
        <defs>
          <linearGradient id="handsetBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.44 0.09 259)" />
            <stop offset="45%" stopColor="oklch(0.3 0.086 259)" />
            <stop offset="100%" stopColor="oklch(0.22 0.07 259)" />
          </linearGradient>
          <linearGradient id="handsetSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.34" />
            <stop offset="55%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {/* ceiling mount */}
        <g>
          <rect x="140" y="0" width="60" height="10" rx="5" fill="oklch(0.34 0.096 259)" />
          <circle cx="170" cy="14" r="5" fill="oklch(0.52 0.096 254)" />
        </g>

        <g className="swing-receiver" style={{ transformOrigin: "170px 12px" }}>
          {/* coiled spring cord */}
          <g transform="translate(170 14)">
            <path
              d={coilPath(0, 288, 11, 30)}
              fill="none"
              stroke="oklch(0.34 0.096 259)"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d={coilPath(0, 288, 11, 30)}
              fill="none"
              stroke="oklch(0.62 0.08 252)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          {/* handset */}
          <g transform="translate(170 306) rotate(-13) scale(1.12)">
            {/* sound waves from the earpiece */}
            <g transform="translate(-104 18)" stroke="oklch(0.52 0.096 254)" fill="none">
              <circle className="wave-ring" r="20" strokeWidth="2" opacity="0" />
              <circle
                className="wave-ring"
                r="32"
                strokeWidth="1.6"
                opacity="0"
                style={{ animationDelay: "0.7s" }}
              />
              <circle
                className="wave-ring"
                r="46"
                strokeWidth="1.2"
                opacity="0"
                style={{ animationDelay: "1.4s" }}
              />
            </g>

            {/* bar */}
            <rect x="-64" y="0" width="128" height="30" rx="15" fill="url(#handsetBody)" />
            {/* earpiece (left) */}
            <path
              d="M-108 -6 h34 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-34 a14 14 0 0 1 -14 -14 v-14 a14 14 0 0 1 14 -14 z"
              fill="url(#handsetBody)"
            />
            {/* mouthpiece (right) */}
            <path
              d="M74 -6 h34 a14 14 0 0 1 14 14 v14 a14 14 0 0 1 -14 14 h-34 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10 z"
              fill="url(#handsetBody)"
            />
            {/* sheen */}
            <rect
              x="-120"
              y="-2"
              width="242"
              height="9"
              rx="4.5"
              fill="url(#handsetSheen)"
              opacity="0.8"
            />
            {/* speaker grill */}
            <g fill="oklch(0.72 0.048 249)" opacity="0.8">
              <circle cx="-105" cy="10" r="2" />
              <circle cx="-97" cy="10" r="2" />
              <circle cx="-89" cy="10" r="2" />
              <circle cx="-105" cy="18" r="2" />
              <circle cx="-97" cy="18" r="2" />
              <circle cx="-89" cy="18" r="2" />
              <circle cx="-105" cy="26" r="2" />
              <circle cx="-97" cy="26" r="2" />
              <circle cx="-89" cy="26" r="2" />
            </g>
            <g fill="oklch(0.72 0.048 249)" opacity="0.55">
              <circle cx="92" cy="14" r="2" />
              <circle cx="100" cy="14" r="2" />
              <circle cx="108" cy="14" r="2" />
              <circle cx="92" cy="22" r="2" />
              <circle cx="100" cy="22" r="2" />
              <circle cx="108" cy="22" r="2" />
            </g>
            {/* live indicator */}
            <circle cx="0" cy="15" r="3.5" fill="oklch(0.72 0.13 205)">
              <animate
                attributeName="opacity"
                values="0.25;1;0.25"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  );
}
