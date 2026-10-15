import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import deskImg from "@/assets/cx/agent-desk.webp";

type Spot = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  body: string;
  side: "left" | "right";
};

const SPOTS: Spot[] = [
  {
    id: "phone",
    x: 15.5,
    y: 56,
    w: 20,
    h: 22,
    title: "Inbound Call Support",
    body: "Every call answered in seconds, in your name, with your script.",
    side: "right",
  },
  {
    id: "chat",
    x: 31,
    y: 21,
    w: 12,
    h: 14,
    title: "Live Chat Support",
    body: "Website chat staffed through your busiest hours, never left idle.",
    side: "right",
  },
  {
    id: "monitor",
    x: 45,
    y: 32,
    w: 16,
    h: 18,
    title: "Technical Support",
    body: "Tier-one triage inside your tools, escalation paths agreed upfront.",
    side: "left",
  },
  {
    id: "headset",
    x: 64,
    y: 46,
    w: 12,
    h: 18,
    title: "Customer Service",
    body: "A named pod that knows your product, your tone and your customers.",
    side: "left",
  },
  {
    id: "calendar",
    x: 75,
    y: 44,
    w: 11,
    h: 16,
    title: "Appointment Setting",
    body: "Qualified meetings booked straight into your team's calendar.",
    side: "left",
  },
  {
    id: "documents",
    x: 88,
    y: 64,
    w: 14,
    h: 16,
    title: "Documents & Reporting",
    body: "Weekly reporting on volumes, resolution and what customers keep asking.",
    side: "left",
  },
];

export function AgentDeskSection() {
  const [active, setActive] = useState<Spot | null>(null);

  const toggleSpot = (s: Spot) => {
    setActive((prev) => (prev?.id === s.id ? null : s));
  };

  return (
    <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
              Step 06 · The desk
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
              Everything we run for you{" "}
              <span className="text-signal">sits on one desk.</span>
            </h2>
          </div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/[0.06] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            Tap any object to inspect
          </p>
        </div>

        {/* The Desk Stage */}
        <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-primary-foreground/12 shadow-lift">
          <img
            src={deskImg}
            alt="A customer support agent's desk with telephone, monitor, headset, calendar, notebook and documents"
            loading="lazy"
            width={1920}
            height={1080}
            className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-out select-none"
            style={{ transform: active ? "scale(1.025)" : "scale(1)" }}
          />

          {/* gentle camera focus */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: active ? 1 : 0,
              background: active
                ? `radial-gradient(circle at ${active.x}% ${active.y}%, transparent 12%, color-mix(in oklab, oklch(0.16 0.05 262) 55%, transparent) 55%)`
                : "none",
              backdropFilter: active ? "blur(1.5px)" : "none",
            }}
          />

          {/* hotspots */}
          {SPOTS.map((s) => {
            const on = active?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpot(s)}
                onPointerEnter={() => setActive(s)}
                onFocus={() => setActive(s)}
                aria-label={s.title}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl outline-none cursor-pointer touch-manipulation z-20"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.w}%`,
                  height: `${s.h}%`,
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-2xl transition-all duration-500"
                  style={{
                    transform: on ? "translateY(-4px) scale(1.04)" : "none",
                    boxShadow: on
                      ? "inset 0 0 40px color-mix(in oklab, var(--signal) 22%, transparent), 0 0 28px color-mix(in oklab, var(--signal) 30%, transparent)"
                      : "none",
                    border: on
                      ? "2px solid color-mix(in oklab, var(--signal) 65%, transparent)"
                      : "1px solid transparent",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-all duration-500"
                  style={{
                    opacity: on ? 0 : 0.75,
                    boxShadow:
                      "0 0 14px 2px color-mix(in oklab, var(--signal) 90%, transparent)",
                  }}
                />

                {/* Desktop label (hidden on mobile, shown on tablet/desktop) */}
                <span
                  className="pointer-events-none hidden sm:block absolute top-1/2 z-30 w-56 -translate-y-1/2 rounded-2xl border border-primary-foreground/20 bg-navy-deep/95 p-4 text-left shadow-2xl backdrop-blur-md transition-all duration-500 sm:w-64"
                  style={{
                    opacity: on ? 1 : 0,
                    [s.side === "right" ? "left" : "right"]: "108%",
                    transform: on
                      ? "translateY(-50%)"
                      : `translateY(-50%) translateX(${s.side === "right" ? "-8px" : "8px"})`,
                  }}
                >
                  <span className="block text-[0.58rem] font-bold uppercase tracking-[0.2em] text-signal">
                    On this desk
                  </span>
                  <span className="mt-1.5 block font-display text-base font-semibold text-primary-foreground">
                    {s.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-primary-foreground/75">
                    {s.body}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Mobile unclipped floating info card at bottom of stage */}
          {active ? (
            <div className="sm:hidden absolute inset-x-3 bottom-3 z-30 flex items-start justify-between gap-3 rounded-2xl border border-signal/40 bg-navy-deep/95 p-4 shadow-2xl backdrop-blur-md animate-fade-in">
              <div className="min-w-0 flex-1">
                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-signal">
                  On this desk • Selected
                </span>
                <p className="mt-1 font-display text-base font-semibold text-primary-foreground">
                  {active.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/80">
                  {active.body}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(null);
                }}
                className="rounded-full bg-primary-foreground/15 p-1.5 text-primary-foreground/80 hover:bg-primary-foreground/25 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Quick tap selector chips below the desk image */}
        <div className="mt-6">
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-foreground/50">
            Select an item on the desk:
          </p>
          <div className="flex flex-wrap gap-2">
            {SPOTS.map((s) => {
              const on = active?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSpot(s)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer touch-manipulation ${
                    on
                      ? "bg-signal text-navy shadow-md scale-105"
                      : "bg-primary-foreground/10 text-primary-foreground/75 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
