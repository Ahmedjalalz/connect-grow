import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown, Sparkles, PhoneCall, Zap } from "lucide-react";
import { RotaryDial } from "./RotaryDial";
import { ServiceMetaphor } from "./ServiceMetaphor";
import { SERVICES } from "@/lib/services";

export function RotarySection() {
  const [index, setIndex] = useState(1); // 1-based
  const [preview, setPreview] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [isBlooming, setIsBlooming] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const shown = preview ?? index;
  const service = SERVICES[shown - 1] ?? SERVICES[0]!;
  const isConnecting = preview !== null;

  const handleSelect = (n: number) => {
    setIndex(n);
    setTouched(true);
    setIsBlooming(true);
    setPulseKey((prev) => prev + 1);
    window.setTimeout(() => {
      setIsBlooming(false);
    }, 650);
  };

  return (
    <section className="surface-navy relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-[0.07]" />
      <div
        aria-hidden
        className="float-slow absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/10 blur-[110px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
              Interactive Service Switchboard
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
              One line. <span className="text-signal">Ten ways</span> to be answered.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/65">
              Whatever your business needs to communicate, there is a dedicated pod for it. Turn the dial or tap any channel below to switch the live service preview.
            </p>
          </div>

          {/* Real-time Guidance Pill */}
          <div className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 backdrop-blur-md transition-all duration-300 ${
            isBlooming
              ? "border-signal/50 bg-signal/15 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              : "border-signal/30 bg-signal/10"
          }`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-signal text-navy transition-transform duration-300 ${
              isBlooming ? "scale-105" : ""
            }`}>
              <PhoneCall className="h-3.5 w-3.5" />
            </span>
            <div className="text-left">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-signal">
                {isConnecting ? "Routing Channel..." : isBlooming ? "Channel Connected!" : "Interactive Switchboard"}
              </p>
              <p className="text-xs font-medium text-primary-foreground/90">
                Dial number on left ➔ Updates service on right
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Desktop Visual Signal Conduit (Positioned at z-0 BEHIND both columns, visible only in the gap) */}
          <div
            aria-hidden="true"
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-80 h-16 pointer-events-none z-0 items-center justify-center"
          >
            <svg width="320" height="40" viewBox="0 0 320 40" fill="none" className="overflow-hidden">
              <defs>
                <linearGradient id="zapGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.1)" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              {/* Baseline subtle dashed conduit */}
              <line
                x1="0"
                y1="20"
                x2="320"
                y2="20"
                stroke="rgba(56, 189, 248, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Animated signal flow when connecting */}
              {isConnecting && (
                <line
                  x1="0"
                  y1="20"
                  x2="320"
                  y2="20"
                  stroke="var(--signal)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="cx-signal-flow opacity-70"
                />
              )}
              {/* High-speed laser spark on select */}
              {isBlooming && (
                <g key={pulseKey}>
                  <line
                    x1="0"
                    y1="20"
                    x2="320"
                    y2="20"
                    stroke="url(#zapGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_8px_var(--signal)]"
                  />
                  <circle r="4.5" fill="#ffffff" className="filter drop-shadow-[0_0_8px_#38bdf8]">
                    <animateMotion
                      path="M 0 20 L 320 20"
                      dur="0.38s"
                      repeatCount="1"
                      fill="freeze"
                    />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          {/* Left Column: Interactive Phone Dialer (z-10 sits over the wire) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-full">
              <RotaryDial
                count={SERVICES.length}
                active={index}
                onSelect={handleSelect}
                onPreview={setPreview}
              />
            </div>

            {/* Connecting visual prompt pointing to right card on desktop */}
            <div className={`mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
              isBlooming || isConnecting ? "text-signal" : "text-signal/80"
            }`}>
              <Zap className={`h-3.5 w-3.5 text-signal ${isBlooming || isConnecting ? "animate-bounce" : "animate-pulse"}`} />
              <span>
                {isConnecting
                  ? `Routing to Channel ${String(shown).padStart(2, "0")} (${service.name})`
                  : `Dialing Channel ${String(shown).padStart(2, "0")} (${service.name})`}
              </span>
              <ArrowRight className={`h-4 w-4 hidden lg:inline ${isBlooming ? "translate-x-1 text-signal" : "animate-pulse"}`} />
            </div>
          </div>

          {/* Mobile Downward Bridge */}
          <div className="lg:hidden flex flex-col items-center gap-1.5 -my-2 text-signal">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider">
              {isConnecting ? "Routing to Service Below..." : "Live Service Linked Below"}
            </span>
            <div className={`flex items-center justify-center h-7 w-7 rounded-full border border-signal/40 bg-signal/10 transition-all duration-300 ${
              isBlooming ? "scale-115 bg-signal text-navy shadow-[0_0_12px_var(--signal)]" : ""
            }`}>
              <ArrowDown className={`h-4 w-4 ${isBlooming ? "animate-bounce" : "animate-pulse"}`} />
            </div>
          </div>

          {/* Right Column: Live Service Output Card (z-10 sits over the wire) */}
          <div className="relative z-10">
            <div
              aria-hidden
              className={`absolute -inset-6 rounded-[3rem] transition-all duration-300 ${
                isBlooming
                  ? "bg-signal/20 blur-2xl opacity-100"
                  : isConnecting
                  ? "bg-signal/16 blur-2xl opacity-100"
                  : "bg-signal/[0.06] blur-2xl opacity-50"
              }`}
            />
            <div
              className={`relative rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl transition-all duration-300 ${
                isBlooming
                  ? "border-signal shadow-[0_0_40px_rgba(56,189,248,0.35)] ring-2 ring-signal/30 bg-primary-foreground/[0.09]"
                  : isConnecting
                  ? "border-signal/70 shadow-[0_0_28px_rgba(56,189,248,0.25)] ring-1 ring-signal/25 bg-primary-foreground/[0.08]"
                  : "border border-signal/30 bg-primary-foreground/[0.06]"
              }`}
            >
              {/* Connected Line Banner */}
              <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className={`absolute inline-flex h-full w-full rounded-full bg-signal ${
                      isBlooming ? "animate-ping opacity-80" : isConnecting ? "animate-ping opacity-60" : "opacity-0"
                    }`} />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-signal shadow-[0_0_8px_var(--signal)]" />
                  </span>
                  <span
                    className={`text-xs font-extrabold uppercase tracking-[0.2em] transition-colors duration-200 ${
                      isBlooming
                        ? "text-signal drop-shadow-[0_0_6px_var(--signal)]"
                        : isConnecting
                        ? "text-amber-300"
                        : "text-signal"
                    }`}
                  >
                    {isConnecting
                      ? `Patching Channel ${String(shown).padStart(2, "0")}...`
                      : isBlooming
                      ? `● Live Channel ${String(shown).padStart(2, "0")} Connected!`
                      : `Connected to Dial Position ${String(shown).padStart(2, "0")}`}
                  </span>
                </div>
                <span
                  key={shown}
                  className={`font-display text-3xl font-bold transition-all duration-300 ${
                    isBlooming
                      ? "text-signal scale-105 drop-shadow-[0_0_8px_var(--signal)]"
                      : isConnecting
                      ? "text-signal/90"
                      : "text-primary-foreground/35"
                  }`}
                >
                  {String(shown).padStart(2, "0")}/{SERVICES.length}
                </span>
              </div>

              {/* Dynamic Service Content */}
              <div key={service.slug} className="pt-4 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-signal bg-signal/15 px-2.5 py-0.5 rounded-full border border-signal/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                    Channel #{String(shown).padStart(2, "0")} Active
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
                    {service.metric.value} {service.metric.label}
                  </span>
                </div>
                <h3 className="mt-2.5 font-display text-2xl font-semibold sm:text-3xl text-primary-foreground">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                  {service.short} {service.blurb.split(".")[0]}.
                </p>
              </div>

              <div className="mt-6 border-t border-primary-foreground/10 pt-6">
                <ServiceMetaphor slug={service.slug} isBlooming={isBlooming || isConnecting} />
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-primary-foreground/10 pt-6">
                <Link
                  to="/services"
                  hash={service.slug}
                  className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  Explore {service.name}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services"
                  className="text-xs font-semibold text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  View all 10 services →
                </Link>
              </div>
            </div>

            {/* Quick Switch Channel Buttons */}
            <div className="mt-6">
              <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-foreground/50">
                Quick dial channels (1–10):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SERVICES.map((s, i) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      handleSelect(i + 1);
                    }}
                    className={`flex h-7 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition-all duration-200 ${
                      i + 1 === shown
                        ? "bg-signal text-navy shadow-md scale-105"
                        : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                    }`}
                    aria-label={`Switch to channel ${i + 1}: ${s.name}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
