/**
 * Interactive rotary telephone dial.
 *
 * Physical model: each finger hole sits at a fixed angle on the wheel. Put a
 * pointer in a hole, drag clockwise until that hole reaches the finger stop,
 * release — the wheel springs back and the matching service is selected.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import dialWheel from "@/assets/rotary-dial.png";
import phoneBody from "@/assets/rotary-phone.jpg";

/** clockwise degrees from 12 o'clock, measured from the dial artwork */
const STOP_ANGLE = 128;
const HOLE_ANGLES = [110, 78, 46, 14, 342, 310, 278, 246, 214, 182, 150];
/** hole angle for number n (1-based) */
const holeAngle = (n: number) => HOLE_ANGLES[n - 1] ?? 0;
/** rotation needed to bring hole n to the finger stop */
const travelFor = (n: number) => {
  const angle = holeAngle(n);
  // Ensure we always rotate clockwise.
  // We want (STOP_ANGLE - angle) but wrapped to 0..360 range.
  return (STOP_ANGLE - angle + 360) % 360;
};

const HOLE_RADIUS = 0.337; // fraction of dial size, matches the wheel artwork

/** Generate a springy coiled cord path from start to end. */
function coiledCordPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  coils = 12,
  amplitude = 18,
  points = 120,
) {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  let d = `M ${startX} ${startY}`;
  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const dist = t * length;
    const baseX = startX + ux * dist;
    const baseY = startY + uy * dist;
    const wave =
      Math.sin(t * Math.PI * 2 * coils) * amplitude * (1 - t * 0.45);
    d += ` L ${baseX + px * wave} ${baseY + py * wave}`;
  }
  return d;
}


type Props = {
  count: number;
  active: number; // 1-based
  onSelect: (n: number) => void;
  onPreview?: (n: number | null) => void;
};

export function RotaryDial({ count, active, onSelect, onPreview }: Props) {
  const plateRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: number;
    lastAngle: number;
    total: number;
    hole: number;
    max: number;
  } | null>(null);

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [returning, setReturning] = useState(false);
  const [held, setHeld] = useState<number | null>(null);

  const pointerAngle = useCallback((x: number, y: number) => {
    const el = plateRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    // clockwise degrees from 12 o'clock
    return (Math.atan2(dx, -dy) * 180) / Math.PI;
  }, []);

  const nearestHole = useCallback(
    (angle: number) => {
      let best = 1;
      let bestDiff = 999;
      for (let n = 1; n <= count; n++) {
        const d = Math.abs(((angle - holeAngle(n) + 540) % 360) - 180);
        if (d < bestDiff) {
          bestDiff = d;
          best = n;
        }
      }
      return best;
    },
    [count],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    const a = pointerAngle(e.clientX, e.clientY);
    const hole = nearestHole(a);
    dragRef.current = { id: e.pointerId, lastAngle: a, total: 0, hole, max: travelFor(hole) };
    setReturning(false);
    setHeld(hole);
    onPreview?.(hole);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const a = pointerAngle(e.clientX, e.clientY);
      // incremental delta, unwrapped — lets total travel exceed 180deg
      let step = a - drag.lastAngle;
      if (step < -180) step += 360;
      if (step > 180) step -= 360;
      drag.lastAngle = a;
      drag.total = Math.max(0, Math.min(drag.max + 40, drag.total + step));

      // resistance past the finger stop
      const clamped = Math.min(drag.max, drag.total);
      const over = Math.max(0, drag.total - drag.max);
      setRotation(clamped + over * 0.12);
    };

    const up = () => {
      const drag = dragRef.current;
      if (!drag) return;
      const reached = drag.total >= drag.max * 0.85;
      dragRef.current = null;
      setReturning(true);
      setRotation(0);
      setHeld(null);
      onPreview?.(null);
      if (reached) onSelect(drag.hole);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [pointerAngle, onSelect, onPreview]);

  rotationRef.current = rotation;

  /** tap / keyboard fallback: dial the number without precise dragging */
  const dialTo = (n: number) => {
    setReturning(false);
    setRotation(travelFor(n));
    setHeld(n);
    window.setTimeout(() => {
      setReturning(true);
      setRotation(0);
      setHeld(null);
      onSelect(n);
    }, 420);
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px] select-none">
      <div
        aria-hidden
        className="absolute inset-[-12%] rounded-full bg-signal/10 blur-[90px]"
      />

      <img
        src={phoneBody}
        alt="Deep navy vintage rotary telephone"
        width={1024}
        height={1024}
        loading="lazy"
        className="relative h-full w-full rounded-[2.5rem] object-cover"
        draggable={false}
      />

      {/* dial plate — sits over the phone's dial recess */}
      <div
        ref={plateRef}
        className="absolute left-1/2 top-1/2 aspect-square w-[43%] -translate-x-1/2 -translate-y-1/2"
      >
        {/* fixed number ring, read through the holes */}
        <div className="absolute inset-0">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
            const a = ((holeAngle(n) - 90) * Math.PI) / 180;
            const isActive = n === active;
            const isHeld = n === held;
            return (
              <button
                key={n}
                type="button"
                onClick={() => dialTo(n)}
                aria-label={`Dial ${n}`}
                className={`absolute flex h-[19%] w-[19%] items-center justify-center rounded-full font-display text-[clamp(0.7rem,1.6vw,0.95rem)] font-semibold transition-all duration-300 ${
                  isActive || isHeld
                    ? "bg-signal/25 text-primary-foreground shadow-[0_0_18px_2px_color-mix(in_oklab,var(--signal)_45%,transparent)]"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                }`}
                style={{
                  left: `${50 + Math.cos(a) * HOLE_RADIUS * 100 - 9.5}%`,
                  top: `${50 + Math.sin(a) * HOLE_RADIUS * 100 - 9.5}%`,
                }}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* rotating chrome finger wheel */}
        <img
          src={dialWheel}
          alt=""
          aria-hidden
          width={1024}
          height={1024}
          loading="lazy"
          draggable={false}
          onPointerDown={onPointerDown}
          className="pointer-events-auto absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: returning
              ? "transform 900ms cubic-bezier(0.22, 1.4, 0.3, 1)"
              : "transform 60ms linear",
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))",
          }}
        />

        {/* finger stop */}
        <span
          aria-hidden
          className="absolute h-[7%] w-[7%] rounded-full bg-signal/70 blur-[1px]"
          style={{
            left: `${50 + Math.cos(((STOP_ANGLE - 90) * Math.PI) / 180) * 46 - 3.5}%`,
            top: `${50 + Math.sin(((STOP_ANGLE - 90) * Math.PI) / 180) * 46 - 3.5}%`,
          }}
        />
      </div>

      {/* receiver cord — implies the handset is resting off-frame */}
      <svg
        aria-hidden
        viewBox="0 0 540 540"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      >
        <defs>
          <linearGradient id="cord-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.2 0.04 260)" />
            <stop offset="40%" stopColor="oklch(0.35 0.04 252)" />
            <stop offset="70%" stopColor="oklch(0.28 0.045 255)" />
            <stop offset="100%" stopColor="oklch(0.18 0.04 260)" />
          </linearGradient>
        </defs>
        <path
          d={coiledCordPath(176, 96, -52, -40, 13, 16)}
          fill="none"
          stroke="url(#cord-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(2px 4px 7px rgba(0,0,0,0.55))"
        />

      </svg>
    </div>
  );
}

