import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MousePointer2, Sparkles, PhoneCall, Zap } from "lucide-react";
import { RotaryDial } from "./RotaryDial";
import { ServiceMetaphor } from "./ServiceMetaphor";
import { SERVICES } from "@/lib/services";

export function RotarySection() {
  const [index, setIndex] = useState(1); // 1-based
  const [preview, setPreview] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  const shown = preview ?? index;
  const service = SERVICES[shown - 1] ?? SERVICES[0]!;

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
          <div className="inline-flex items-center gap-3 rounded-2xl border border-signal/30 bg-signal/10 px-4 py-2.5 backdrop-blur-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-navy">
              <PhoneCall className="h-3.5 w-3.5" />
            </span>
            <div className="text-left">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-signal">
                Interactive Dialer
              </p>
              <p className="text-xs font-medium text-primary-foreground/90">
                Dial number on left ➔ Updates service on right
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left Column: Interactive Phone Dialer */}
          <div className="relative flex flex-col items-center">
            {/* Guide prompt above dial */}
            <div className="mb-4 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/[0.08] px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-md backdrop-blur-sm">
              <MousePointer2 className="h-3.5 w-3.5 text-signal animate-bounce" />
              <span>Turn dial or click hole <strong>#1 - #10</strong></span>
            </div>

            <div className="relative w-full">
              <RotaryDial
                count={SERVICES.length}
                active={index}
                onSelect={(n) => {
                  setIndex(n);
                  setTouched(true);
                }}
                onPreview={setPreview}
              />
            </div>

            {/* Connecting visual prompt pointing to right card on desktop */}
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-signal/80">
              <Zap className="h-3.5 w-3.5 animate-pulse text-signal" />
              <span>Dialing Channel {String(shown).padStart(2, "0")} ({service.name})</span>
              <ArrowRight className="h-4 w-4 hidden lg:inline animate-pulse" />
            </div>
          </div>

          {/* Right Column: Live Service Output Card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[3rem] bg-signal/[0.08] blur-2xl"
            />
            <div className="relative rounded-[2.5rem] border border-signal/30 bg-primary-foreground/[0.06] p-8 sm:p-10 backdrop-blur-md shadow-2xl transition-all duration-300">
              {/* Connected Line Banner */}
              <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-signal"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
                    Connected to Dial Position {String(shown).padStart(2, "0")}
                  </span>
                </div>
                <span className="font-display text-3xl font-semibold text-primary-foreground/30">
                  {String(shown).padStart(2, "0")}/{SERVICES.length}
                </span>
              </div>

              {/* Dynamic Service Content */}
              <div key={service.slug} className="animate-fade-in pt-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-foreground/50">
                  {service.metric.value} {service.metric.label}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl text-primary-foreground">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">
                  {service.short} {service.blurb.split(".")[0]}.
                </p>
              </div>

              <div className="mt-6 border-t border-primary-foreground/10 pt-6">
                <ServiceMetaphor slug={service.slug} />
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
                      setIndex(i + 1);
                      setTouched(true);
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
