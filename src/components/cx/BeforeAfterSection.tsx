/**
 * Interactive before/after of a support operation — a draggable divider wipes
 * between two live-looking support consoles. Illustrative numbers only.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, MessageSquare, PhoneMissed, Timer } from "lucide-react";

export function BeforeAfterSection() {
  const [pos, setPos] = useState(48);
  const stage = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragging.current) move(e.clientX);
    };
    const stop = () => (dragging.current = false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [move]);

  return (
    <section className="relative overflow-hidden surface-navy">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-[0.07]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
            Step five — improve
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
            What <span className="text-signal">better CX</span> looks like.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/65">
            Same inbox, same customers, different operation. Drag the divider
            across the console.
          </p>
        </div>

        <div
          ref={stage}
          onPointerDown={(e) => {
            dragging.current = true;
            move(e.clientX);
          }}
          className="relative mt-12 h-[30rem] cursor-ew-resize select-none overflow-hidden rounded-[2.25rem] border border-primary-foreground/12 bg-primary-foreground/[0.04] shadow-lift sm:h-[27rem]"
        >
          {/* AFTER (base layer) */}
          <Console variant="after" />

          {/* BEFORE (clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <Console variant="before" />
          </div>

          {/* divider */}
          <div
            className="absolute inset-y-0 z-20 w-px bg-signal"
            style={{
              left: `${pos}%`,
              boxShadow: "0 0 22px color-mix(in oklab, var(--signal) 65%, transparent)",
            }}
          >
            <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal/50 bg-navy-deep/90 backdrop-blur-sm">
              <span className="text-signal">⟷</span>
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-primary-foreground/45">
          Illustrative scenario for demonstration only — not measured company
          performance.
        </p>
      </div>
    </section>
  );
}

const BEFORE_STATS = [
  { value: "47", label: "unanswered" },
  { value: "18", label: "waiting" },
  { value: "12", label: "unresolved" },
];

const AFTER_STATS = [
  { value: "0", label: "unanswered" },
  { value: "3", label: "waiting" },
  { value: "✓", label: "resolved" },
];

const BEFORE_ROWS = [
  { icon: PhoneMissed, title: "Missed call — 4 attempts", meta: "No callback logged", bad: true },
  { icon: MessageSquare, title: "\"Is anyone there?\"", meta: "Chat open 41 min", bad: true },
  { icon: AlertTriangle, title: "Ticket #2841 escalated", meta: "Overdue by 3 days", bad: true },
  { icon: Timer, title: "Email backlog", meta: "31 threads untouched", bad: true },
];

const AFTER_ROWS = [
  { icon: Check, title: "Call answered in 14s", meta: "Logged + tagged", bad: false },
  { icon: MessageSquare, title: "\"That's sorted, thanks!\"", meta: "Chat closed 2 min", bad: false },
  { icon: Check, title: "Ticket #2841 resolved", meta: "Same-day close", bad: false },
  { icon: Timer, title: "Inbox at zero", meta: "All threads replied", bad: false },
];

function Console({ variant }: { variant: "before" | "after" }) {
  const before = variant === "before";
  const rows = before ? BEFORE_ROWS : AFTER_ROWS;
  const stats = before ? BEFORE_STATS : AFTER_STATS;

  return (
    <div
      className="absolute inset-0 flex flex-col p-6 sm:p-9"
      style={{
        background: before
          ? "linear-gradient(140deg in oklab, oklch(0.24 0.06 268), oklch(0.2 0.05 275))"
          : "linear-gradient(140deg in oklab, oklch(0.26 0.11 258), oklch(0.32 0.13 246))",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] ${
            before
              ? "border-destructive/40 text-destructive-foreground/80"
              : "border-signal/40 text-signal"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${before ? "bg-destructive" : "animate-pulse bg-signal"}`}
          />
          {before ? "Before" : "After"}
        </span>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-primary-foreground/40">
          Support console
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.05] px-4 py-3"
          >
            <p
              className={`font-display text-2xl font-semibold tabular-nums ${
                before ? "text-primary-foreground/85" : "text-signal"
              }`}
            >
              {s.value}
            </p>
            <p className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/45">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.title}
            className="flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] px-4 py-3"
          >
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                r.bad
                  ? "bg-destructive/20 text-destructive-foreground"
                  : "bg-signal/15 text-signal"
              }`}
            >
              <r.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{r.title}</p>
              <p className="truncate text-[0.68rem] text-primary-foreground/50">
                {r.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
