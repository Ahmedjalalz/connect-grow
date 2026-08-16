import {
  Calendar,
  Crosshair,
  FolderOpen,
  Headphones,
  Mail,
  MessageSquare,
  Radar,
  Ruler,
  Terminal,
  Grid3x3,
} from "lucide-react";
import type { DeviceShape } from "@/lib/services";
import type { ReactNode } from "react";

/**
 * Classic corded receiver: an arched handle with an earpiece and a mouthpiece,
 * so it reads as the handset from the hero rather than a generic phone glyph.
 */
function HandsetGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <g transform="rotate(-32 12 12)">
        {/* arched handle */}
        <path
          d="M6.4 9.2 C8.6 15.4 15.4 15.4 17.6 9.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {/* earpiece + mouthpiece cups */}
        <rect
          x="3.1"
          y="6.1"
          width="6.6"
          height="4"
          rx="2"
          transform="rotate(-28 6.4 8.1)"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="14.3"
          y="6.1"
          width="6.6"
          height="4"
          rx="2"
          transform="rotate(28 17.6 8.1)"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </g>
    </svg>
  );
}


const ICONS: Record<DeviceShape, ReactNode> = {
  handset: <HandsetGlyph className="h-6 w-6" />,
  dialpad: <Grid3x3 className="h-6 w-6" />,
  chat: <MessageSquare className="h-6 w-6" />,
  envelope: <Mail className="h-6 w-6" />,
  headset: <Headphones className="h-6 w-6" />,
  radar: <Radar className="h-6 w-6" />,
  calendar: <Calendar className="h-6 w-6" />,
  target: <Crosshair className="h-6 w-6" />,
  terminal: <Terminal className="h-6 w-6" />,
  drawer: <FolderOpen className="h-6 w-6" />,
  blueprint: <Ruler className="h-6 w-6" />,
};

export function DeviceIcon({ shape }: { shape: DeviceShape }) {
  return <>{ICONS[shape]}</>;
}

/**
 * Small illustrative "device" that sits inside each service card, so cards read
 * like objects on a desk instead of identical boxes.
 */
export function DeviceArt({ shape }: { shape: DeviceShape }) {
  const stroke = "oklch(0.52 0.096 254)";
  const fill = "oklch(0.34 0.096 259)";

  switch (shape) {
    case "handset":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          {/* cradle base */}
          <rect x="22" y="58" width="76" height="10" rx="5" fill={stroke} opacity="0.28" />
          {/* coiled cord */}
          <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.55">
            <path d="M74 52 c6 0 6 -7 12 -7 s6 7 12 7" />
            <path d="M74 58 c6 0 6 -7 12 -7 s6 7 12 7" opacity="0.6" />
          </g>
          {/* receiver, filled, tilted like the hero handset */}
          <g transform="rotate(-24 60 36) translate(24 -4) scale(2.2)">
            <path d={HANDSET_PATH} fill={fill} />
            <circle cx="12" cy="5.9" r="1.5" fill="oklch(0.72 0.048 249)" opacity="0.5" />
            <circle cx="12" cy="18.1" r="1.5" fill="oklch(0.72 0.048 249)" opacity="0.5" />
          </g>
          {/* live indicator */}
          <circle cx="100" cy="14" r="4.5" fill="oklch(0.72 0.13 205)" />
        </svg>
      );


    case "dialpad":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="30" y="8" width="60" height="64" rx="10" fill={fill} />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2].map((c) => (
              <circle
                key={`${r}-${c}`}
                cx={44 + c * 16}
                cy={22 + r * 14}
                r="4"
                fill="oklch(0.72 0.048 249)"
                opacity={r === 0 && c === 1 ? 1 : 0.45}
              />
            )),
          )}
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <path d="M12 14 h68 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-44 l-14 12 v-12 h-10 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10z" fill={fill} />
          <rect x="70" y="42" width="40" height="26" rx="9" fill="none" stroke={stroke} strokeWidth="2" />
          <g fill="oklch(0.72 0.048 249)">
            <circle cx="34" cy="35" r="3.5" />
            <circle cx="46" cy="35" r="3.5" />
            <circle cx="58" cy="35" r="3.5" />
          </g>
        </svg>
      );
    case "envelope":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="16" y="18" width="88" height="52" rx="8" fill={fill} />
          <path d="M16 24 l44 30 l44 -30" fill="none" stroke="oklch(0.72 0.048 249)" strokeWidth="2.5" />
          <circle cx="98" cy="20" r="9" fill="oklch(0.72 0.13 205)" />
        </svg>
      );
    case "headset":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <path d="M26 52 v-8 a34 34 0 0 1 68 0 v8" fill="none" stroke={fill} strokeWidth="7" strokeLinecap="round" />
          <rect x="14" y="46" width="18" height="26" rx="8" fill={fill} />
          <rect x="88" y="46" width="18" height="26" rx="8" fill={fill} />
          <path d="M88 62 q-16 12 -28 4" fill="none" stroke={stroke} strokeWidth="2.5" />
          <circle cx="58" cy="68" r="4" fill="oklch(0.72 0.13 205)" />
        </svg>
      );
    case "radar":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <g fill="none" stroke={stroke} strokeWidth="2">
            <circle cx="60" cy="44" r="10" />
            <circle cx="60" cy="44" r="22" opacity="0.6" />
            <circle cx="60" cy="44" r="34" opacity="0.3" />
          </g>
          <path d="M60 44 L96 20" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="44" r="5" fill={fill} />
          <circle cx="84" cy="30" r="4" fill="oklch(0.72 0.13 205)" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="22" y="14" width="76" height="58" rx="10" fill={fill} />
          <rect x="22" y="14" width="76" height="16" rx="8" fill="oklch(0.52 0.096 254)" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={32 + c * 16}
                y={38 + r * 11}
                width="10"
                height="7"
                rx="2"
                fill={r === 1 && c === 2 ? "oklch(0.72 0.13 205)" : "oklch(0.72 0.048 249)"}
                opacity={r === 1 && c === 2 ? 1 : 0.4}
              />
            )),
          )}
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <circle cx="56" cy="44" r="30" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="56" cy="44" r="18" fill="none" stroke={stroke} strokeWidth="2" opacity="0.7" />
          <circle cx="56" cy="44" r="7" fill={fill} />
          <path d="M96 12 L60 42" stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <path d="M92 8 l12 -2 l-2 12 z" fill="oklch(0.72 0.13 205)" />
        </svg>
      );
    case "terminal":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="14" y="12" width="92" height="50" rx="8" fill={fill} />
          <rect x="46" y="66" width="28" height="6" rx="3" fill={stroke} />
          <g stroke="oklch(0.72 0.13 205)" strokeWidth="2.5" fill="none">
            <path d="M26 28 l8 8 l-8 8" />
          </g>
          <rect x="42" y="42" width="30" height="4" rx="2" fill="oklch(0.72 0.048 249)" opacity="0.7" />
        </svg>
      );
    case "drawer":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="20" y="14" width="80" height="18" rx="5" fill={fill} opacity="0.75" />
          <rect x="20" y="36" width="80" height="18" rx="5" fill={fill} />
          <rect x="20" y="58" width="80" height="14" rx="5" fill={fill} opacity="0.55" />
          <rect x="52" y="42" width="16" height="5" rx="2.5" fill="oklch(0.72 0.048 249)" />
          <circle cx="100" cy="24" r="6" fill="oklch(0.72 0.13 205)" />
        </svg>
      );
    case "blueprint":
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full">
          <rect x="16" y="12" width="88" height="56" rx="8" fill="none" stroke={fill} strokeWidth="3" />
          <g stroke={stroke} strokeWidth="1.5" opacity="0.55">
            <path d="M16 30 h88 M16 48 h88 M46 12 v56 M76 12 v56" />
          </g>
          <rect x="46" y="30" width="30" height="18" fill="oklch(0.72 0.13 205)" opacity="0.35" />
          <circle cx="46" cy="30" r="3.5" fill={fill} />
          <circle cx="76" cy="48" r="3.5" fill={fill} />
        </svg>
      );
  }
}
