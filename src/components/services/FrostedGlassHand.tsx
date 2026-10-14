import React from "react";

interface FrostedGlassHandProps {
  x: number; // percentage (0..100) on the dial container
  y: number; // percentage (0..100) on the dial container
  angle?: number; // rotation in degrees around the fingertip
  isPressing?: boolean;
  opacity?: number;
  className?: string;
}

/**
 * A sleek, semi-translucent frosted glass pointing hand.
 * The index fingertip is calibrated at (36px, 10px) in a 120x160 viewBox,
 * serving as the exact transform origin for pin-point alignment.
 */
export const FrostedGlassHand: React.FC<FrostedGlassHandProps> = ({
  x,
  y,
  angle = 20,
  isPressing = false,
  opacity = 1,
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none transition-opacity duration-300 ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        // (36px, 10px) is the fingertip coordinate within the 120x160 box
        transform: `translate(-36px, -10px) rotate(${angle}deg) scale(${isPressing ? 0.92 : 1})`,
        transformOrigin: "36px 10px",
        transition: "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease",
        filter: "drop-shadow(0 14px 28px rgba(2, 6, 23, 0.6)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.4))",
        zIndex: 40,
      }}
    >
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="backdrop-blur-[8px]"
      >
        <defs>
          {/* Frosted Glass Body Gradient */}
          <linearGradient id="glassBody" x1="20" y1="10" x2="100" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          {/* Specular Edge Highlight Gradient */}
          <linearGradient id="glassEdge" x1="10" y1="0" x2="90" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>

          {/* Fingertip Contact Glow */}
          <radialGradient id="tipGlow" cx="36" cy="12" r="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Internal refractive rib highlight */}
          <linearGradient id="sheen" x1="36" y1="10" x2="60" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Hand Silhouette */}
        <path
          d="
            M 36 8 
            C 43 8, 44 14, 44 20 
            L 44 52 
            C 47 48, 52 46, 58 48 
            C 63 49, 67 54, 66 60 
            C 70 57, 75 57, 79 61 
            C 83 65, 84 71, 82 78 
            C 86 76, 91 78, 93 84 
            C 96 92, 94 102, 90 110 
            C 85 120, 78 132, 70 142 
            L 44 146 
            C 38 132, 33 118, 30 106 
            C 26 104, 20 98, 16 90 
            C 12 82, 13 74, 18 68 
            C 22 64, 26 65, 30 70 
            L 30 20 
            C 30 13, 31 8, 36 8 
            Z
          "
          fill="url(#glassBody)"
          stroke="url(#glassEdge)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Curled finger separation lines (frosted grooves) */}
        <path
          d="M 44 58 C 50 63, 58 64, 65 61"
          stroke="url(#glassEdge)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 60 70 C 66 75, 73 76, 80 72"
          stroke="url(#glassEdge)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 72 82 C 77 87, 84 88, 90 84"
          stroke="url(#glassEdge)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Thumb crease */}
        <path
          d="M 28 80 C 25 88, 26 95, 30 102"
          stroke="url(#glassEdge)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Refractive specular sheen along index finger ridge */}
        <path
          d="M 37 13 L 37 56 C 37 70, 39 90, 44 110"
          stroke="url(#sheen)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Fingertip contact pad shine */}
        <circle cx="36" cy="13" r="5" fill="url(#tipGlow)" />
        <ellipse cx="36" cy="11" rx="3" ry="1.8" fill="#ffffff" opacity="0.85" />
      </svg>
    </div>
  );
};
