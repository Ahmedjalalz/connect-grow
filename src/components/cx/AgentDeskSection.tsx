/**
 * The Agent Desk — an editorial photograph of a support workspace where each
 * object on the desk reveals the service it stands for on hover/focus.
 */
import { useState } from "react";
import deskImg from "@/assets/cx/agent-desk.jpg";

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
    id: "notes",
    x: 54,
    y: 76,
    w: 20,
    h: 16,
    title: "Back-office",
    body: "Data entry, order handling and the admin that quietly piles up.",
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

  return (
    <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
              Step seven — the desk
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
              Everything we run for you{" "}
              <span className="text-signal">sits on one desk.</span>
            </h2>
          </div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/[0.06] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            Explore the desk
          </p>
        </div>

        <div
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-primary-foreground/12 shadow-lift"
          onPointerLeave={() => setActive(null)}
        >
          <img
            src={deskImg}
            alt="A premium customer support agent's desk with a vintage telephone, monitor, headset, calendar, notebook and documents"
            loading="lazy"
            width={1920}
            height={1080}
            className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-out"
            style={{ transform: active ? "scale(1.035)" : "scale(1)" }}
          />

          {/* gentle camera focus */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: active ? 1 : 0,
              background: active
                ? `radial-gradient(circle at ${active.x}% ${active.y}%, transparent 8%, color-mix(in oklab, oklch(0.16 0.05 262) 72%, transparent) 42%)`
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
                onPointerEnter={() => setActive(s)}
                onFocus={() => setActive(s)}
                onBlur={() => setActive(null)}
                aria-label={s.title}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl outline-none"
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
                    transform: on ? "translateY(-4px) scale(1.02)" : "none",
                    boxShadow: on
                      ? "inset 0 0 40px color-mix(in oklab, var(--signal) 18%, transparent), 0 0 26px color-mix(in oklab, var(--signal) 22%, transparent)"
                      : "none",
                    border: on
                      ? "1px solid color-mix(in oklab, var(--signal) 45%, transparent)"
                      : "1px solid transparent",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-all duration-500"
                  style={{
                    opacity: on ? 0 : 0.55,
                    boxShadow:
                      "0 0 12px color-mix(in oklab, var(--signal) 80%, transparent)",
                  }}
                />

                {/* label */}
                <span
                  className="pointer-events-none absolute top-1/2 z-20 w-56 -translate-y-1/2 rounded-2xl border border-primary-foreground/15 bg-navy-deep/85 p-4 text-left backdrop-blur-md transition-all duration-500 sm:w-64"
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
                  <span className="mt-1.5 block font-display text-base font-semibold">
                    {s.title}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-primary-foreground/65">
                    {s.body}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
