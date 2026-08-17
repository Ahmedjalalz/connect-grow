/**
 * Signature section: a photographed navy rotary telephone with a genuinely
 * interactive dial. Turning the dial changes the highlighted service.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MousePointer2 } from "lucide-react";
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
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
            How we connect
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
            One line. <span className="text-signal">Eleven ways</span> to be
            answered.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/65">
            Whatever your business needs to communicate, there is a service for
            it. Turn the dial and every part of our operation comes on the line.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="relative">
            <RotaryDial
              count={SERVICES.length}
              active={index}
              onSelect={(n) => {
                setIndex(n);
                setTouched(true);
              }}
              onPreview={setPreview}
            />
            <p
              className={`mt-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-foreground/45 transition-opacity duration-700 ${
                touched ? "opacity-0" : "opacity-100"
              }`}
            >
              Turn the dial to explore our services
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[3rem] bg-signal/[0.06] blur-3xl"
            />
            <div className="relative rounded-[2.5rem] border border-primary-foreground/12 bg-primary-foreground/[0.04] p-9 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl font-semibold text-primary-foreground/20">
                  {String(shown).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary-foreground/55">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                  On the line
                </span>
              </div>

              <div key={service.slug} className="animate-fade-in">
                <h3 className="mt-6 font-display text-2xl font-semibold">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                  {service.short} {service.blurb.split(".")[0]}.
                </p>
              </div>

              <div className="mt-8 border-t border-primary-foreground/10 pt-8">
                <ServiceMetaphor slug={service.slug} />
              </div>

              <Link
                to="/services"
                hash={service.slug}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal"
              >
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {SERVICES.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    setIndex(i + 1);
                    setTouched(true);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 === shown
                      ? "w-8 bg-signal"
                      : "w-4 bg-primary-foreground/20 hover:bg-primary-foreground/40"
                  }`}
                  aria-label={s.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
