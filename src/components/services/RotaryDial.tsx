/**
 * Interactive rotary telephone dial.
 *
 * Physical model: each finger hole sits at a fixed angle on the wheel. Put a
 * pointer in a hole, drag clockwise until that hole reaches the finger stop,
 * release — the wheel springs back and the matching service is selected.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import dialWheel from "@/assets/rotary-dial.webp";
import phoneBody from "@/assets/rotary-phone.webp";
import { FrostedGlassHand } from "./FrostedGlassHand";

/** clockwise degrees from 12 o'clock, measured from the dial artwork */
const STOP_ANGLE = 128;
const HOLE_ANGLES = [110, 78, 46, 14, 342, 310, 278, 246, 214, 182];
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

const DEMO_HOLE = 3;
const DEMO_START_ANGLE = holeAngle(DEMO_HOLE); // 46 deg
const DEMO_TRAVEL = travelFor(DEMO_HOLE); // 82 deg

const getHolePercent = (angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + Math.cos(rad) * HOLE_RADIUS * 100,
    y: 50 + Math.sin(rad) * HOLE_RADIUS * 100,
  };
};

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

  // Demo state
  const initialHolePos = getHolePercent(DEMO_START_ANGLE);
  const [handPos, setHandPos] = useState({
    x: initialHolePos.x + 7,
    y: initialHolePos.y + 11,
    angle: 16,
  });
  const [handOpacity, setHandOpacity] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const hasPlayedDemoRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const demoAnimRef = useRef<number | null>(null);
  const demoTimeoutRefs = useRef<number[]>([]);

  const cancelDemo = useCallback(() => {
    if (demoAnimRef.current !== null) {
      cancelAnimationFrame(demoAnimRef.current);
      demoAnimRef.current = null;
    }
    demoTimeoutRefs.current.forEach(window.clearTimeout);
    demoTimeoutRefs.current = [];
    setHandOpacity(0);
    setShowRipple(false);
    setIsPressing(false);
  }, []);

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
        }
      }
      return best;
    },
    [count],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hasUserInteractedRef.current = true;
    cancelDemo();
    const a = pointerAngle(e.clientX, e.clientY);
    const hole = nearestHole(a);
    dragRef.current = { id: e.pointerId, lastAngle: a, total: 0, hole, max: travelFor(hole) };
    setReturning(false);
    setHeld(hole);
    onPreview?.(hole);
    if (typeof (e.currentTarget as HTMLElement).setPointerCapture === "function") {
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  useEffect(() => {
    if (active !== 1) {
      hasUserInteractedRef.current = true;
      cancelDemo();
    }
  }, [active, cancelDemo]);

  // Automated demonstration cycle that repeats until user interacts
  const playDemoCycle = useCallback(() => {
    if (hasUserInteractedRef.current) return;

    // Reset starting position slightly offset for glide-in
    setHandPos({ x: initialHolePos.x + 7, y: initialHolePos.y + 11, angle: 16 });
    setHandOpacity(0);
    setIsPressing(false);
    setReturning(false);

    const tGlide = window.setTimeout(() => {
      if (hasUserInteractedRef.current) return;

      // 1. Glide hand in smoothly to hole #3
      setHandOpacity(1);
      setHandPos({ x: initialHolePos.x, y: initialHolePos.y, angle: 18 });

      // 2. Press down
      const tPress = window.setTimeout(() => {
        if (hasUserInteractedRef.current) return;
        setIsPressing(true);
        setShowRipple(true);
        setHeld(DEMO_HOLE);
        onPreview?.(DEMO_HOLE);

        // 3. Begin smooth rotary sweep
        const tDrag = window.setTimeout(() => {
          if (hasUserInteractedRef.current) return;
          setShowRipple(false);

          const dragStartTime = performance.now();
          const dragDuration = 1100; // ms

          const stepDrag = (now: number) => {
            if (hasUserInteractedRef.current) return;
            const elapsed = now - dragStartTime;
            const progress = Math.min(1, elapsed / dragDuration);
            // easeInOutCubic curve
            const ease =
              progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentRot = DEMO_TRAVEL * ease;
            setRotation(currentRot);

            const currentAngle = DEMO_START_ANGLE + currentRot;
            const pos = getHolePercent(currentAngle);
            setHandPos({
              x: pos.x,
              y: pos.y,
              angle: 18 + ease * 20,
            });

            if (progress < 1) {
              demoAnimRef.current = requestAnimationFrame(stepDrag);
            } else {
              // Reached the finger stop!
              const tStop = window.setTimeout(() => {
                if (hasUserInteractedRef.current) return;
                // Lift finger
                setIsPressing(false);

                const tRelease = window.setTimeout(() => {
                  if (hasUserInteractedRef.current) return;
                  // Release dial wheel to spring back, trigger selection, fade hand
                  setReturning(true);
                  setRotation(0);
                  setHeld(null);
                  onPreview?.(null);
                  setHandOpacity(0);
                  onSelect(DEMO_HOLE);

                  // 4. Repeat cycle after a natural pause if user hasn't interacted
                  const tNext = window.setTimeout(() => {
                    if (!hasUserInteractedRef.current) {
                      playDemoCycle();
                    }
                  }, 2200);
                  demoTimeoutRefs.current.push(tNext);
                }, 200);
                demoTimeoutRefs.current.push(tRelease);
              }, 240);
              demoTimeoutRefs.current.push(tStop);
            }
          };

          demoAnimRef.current = requestAnimationFrame(stepDrag);
        }, 320);
        demoTimeoutRefs.current.push(tDrag);
      }, 600);
      demoTimeoutRefs.current.push(tPress);
    }, 120);
    demoTimeoutRefs.current.push(tGlide);
  }, [initialHolePos.x, initialHolePos.y, onSelect, onPreview]);

  // Start demonstration when scrolled into view
  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;

    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          isVisible = true;
          if (!hasUserInteractedRef.current) {
            const tStart = window.setTimeout(() => {
              if (isVisible && !hasUserInteractedRef.current) {
                playDemoCycle();
              }
            }, 1000);
            demoTimeoutRefs.current.push(tStart);
          }
        } else {
          isVisible = false;
          cancelDemo();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelDemo();
    };
  }, [cancelDemo, playDemoCycle]);

  useEffect(() => {
    let animFrame: number | null = null;

    const move = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (e.pointerId !== drag.id) return;
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
      const nextRot = clamped + over * 0.12;

      if (animFrame === null) {
        animFrame = requestAnimationFrame(() => {
          animFrame = null;
          setRotation(nextRot);
        });
      }
    };

    const up = (e?: PointerEvent) => {
      if (animFrame !== null) {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
      const drag = dragRef.current;
      if (!drag) return;
      if (e && e.pointerId !== drag.id) return;
      const reached = drag.total >= Math.max(15, drag.max * 0.78);
      const hole = drag.hole;
      dragRef.current = null;
      setReturning(true);
      setRotation(0);
      setHeld(null);
      onPreview?.(null);
      if (reached) onSelect(hole);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      if (animFrame !== null) cancelAnimationFrame(animFrame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [pointerAngle, onSelect, onPreview]);

  rotationRef.current = rotation;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px] select-none">
      <div
        aria-hidden
        className="absolute inset-[-12%] rounded-full bg-signal/10 blur-[90px]"
      />

      <img
        src={phoneBody}
        alt="Deep navy vintage rotary telephone"
        width={800}
        height={800}
        loading="lazy"
        decoding="async"
        className="relative h-full w-full rounded-[2.5rem] object-cover"
        draggable={false}
      />

      {/* dial plate — sits over the phone's dial recess */}
      <div
        ref={plateRef}
        className="absolute left-1/2 top-1/2 aspect-square w-[43%] -translate-x-1/2 -translate-y-1/2 touch-none select-none"
        style={{ touchAction: "none" }}
      >
        {/* fixed number ring underneath the transparent holes of the wheel */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
            const a = ((holeAngle(n) - 90) * Math.PI) / 180;
            const isActive = n === active;
            const isHeld = n === held;
            return (
              <span
                key={n}
                className={`absolute flex h-[19%] w-[19%] items-center justify-center rounded-full font-display text-[clamp(0.7rem,1.6vw,0.95rem)] font-semibold transition-all duration-300 select-none ${
                  isActive || isHeld
                    ? "bg-signal/30 text-primary-foreground shadow-[0_0_20px_3px_color-mix(in_oklab,var(--signal)_55%,transparent)] scale-110"
                    : "text-primary-foreground/70"
                }`}
                style={{
                  left: `${(50 + Math.cos(a) * HOLE_RADIUS * 100 - 9.5).toFixed(3)}%`,
                  top: `${(50 + Math.sin(a) * HOLE_RADIUS * 100 - 9.5).toFixed(3)}%`,
                }}
              >
                {n}
              </span>
            );
          })}
        </div>

        {/* rotating chrome finger wheel — receives all touch and pointer drag events */}
        <img
          src={dialWheel}
          alt="Interactive rotary dial wheel - touch any hole and drag clockwise to the stop"
          width={560}
          height={560}
          loading="lazy"
          decoding="async"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          className="pointer-events-auto absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing hover:brightness-110 transition-[filter] touch-none select-none"
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
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
          title="Finger Stop"
          className="pointer-events-none absolute h-[8%] w-[8%] rounded-full bg-signal shadow-[0_0_12px_2px_rgba(255,200,0,0.6)]"
          style={{
            left: `${(50 + Math.cos(((STOP_ANGLE - 90) * Math.PI) / 180) * 46 - 4).toFixed(3)}%`,
            top: `${(50 + Math.sin(((STOP_ANGLE - 90) * Math.PI) / 180) * 46 - 4).toFixed(3)}%`,
          }}
        />

        {/* Subtle touch ripple when finger touches down */}
        {showRipple && (
          <span
            aria-hidden
            className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal bg-signal/25 animate-ping z-30"
            style={{
              left: `${handPos.x}%`,
              top: `${handPos.y}%`,
            }}
          />
        )}

        {/* Animated Frosted Glass Demonstration Hand */}
        <FrostedGlassHand
          x={handPos.x}
          y={handPos.y}
          angle={handPos.angle}
          isPressing={isPressing}
          opacity={handOpacity}
        />
      </div>

      {/* Rotational instruction guide */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/15 bg-navy-deep/80 px-3.5 py-1 text-[0.68rem] font-medium tracking-wider text-primary-foreground/85 shadow-md backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
          Drag clockwise to stop bracket & release
        </span>
      </div>
    </div>
  );
}

