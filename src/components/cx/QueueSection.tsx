/**
 * "The Queue": drag the slider and the waiting line physically empties out.
 * Numbers are illustrative, stated as such in the UI.
 */
import { useMemo, useState } from "react";
import { Clock, Users } from "lucide-react";

const MAX = 127;
const MIN = 18;

export function QueueSection() {
  const [t, setT] = useState(0); // 0 → 100
  const ratio = t / 100;
  const waiting = Math.round(MAX - (MAX - MIN) * ratio);
  const wait = (14 - 11.5 * ratio).toFixed(1);

  const tickets = useMemo(() => Array.from({ length: MAX }, (_, i) => i), []);

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-40" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
            Step 03 · Respond
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
            Less waiting.{" "}
            <span className="text-gradient-navy">More conversations.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Drag the handle to staff the line. Every square is a customer holding
            for an answer.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2.25rem] border border-border/60 bg-card shadow-lift">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-border/60 px-6 py-6 sm:px-9">
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-navy-soft">
                {ratio < 0.5 ? "Without dedicated support" : "With dedicated support"}
              </p>
              <p className="mt-2 flex items-baseline gap-2 font-display text-4xl font-semibold tabular-nums text-primary">
                {waiting}
                <span className="text-sm font-semibold text-muted-foreground">
                  customers waiting
                </span>
              </p>
            </div>
            <div className="flex gap-8">
              <Metric icon={Clock} value={`${wait} min`} label="Avg. hold" />
              <Metric
                icon={Users}
                value={`${Math.round(2 + 9 * ratio)}`}
                label="Agents on shift"
              />
            </div>
          </div>

          <div className="px-6 py-9 sm:px-9">
            {/* the queue itself, held inside a waiting lane */}
            <div className="relative rounded-2xl border border-dashed border-border/70 bg-secondary/25 p-5">
              <div className="mb-4 flex items-center justify-between text-[0.6rem] font-bold uppercase tracking-[0.22em] text-muted-foreground/70">
                <span>Waiting line</span>
                <span>Answered</span>
              </div>
            <div className="flex min-h-[7.5rem] flex-wrap content-start gap-1.5">
              {tickets.map((i) => {
                const gone = i >= waiting;
                return (
                  <span
                    key={i}
                    className="h-6 w-4 rounded-[0.3rem] transition-all duration-500 ease-out"
                    style={{
                      transitionDelay: `${(i % 24) * 8}ms`,
                      transform: gone ? "translateY(-10px) scale(0.5)" : "none",
                      opacity: gone ? 0 : 1,
                      background:
                        i < MIN
                          ? "color-mix(in oklab, var(--signal) 55%, var(--navy))"
                          : "color-mix(in oklab, var(--navy) 82%, white)",
                      boxShadow:
                        "inset 0 -2px 0 color-mix(in oklab, black 22%, transparent)",
                    }}
                  />
                );
              })}
            </div>
            </div>

            {/* slider */}
            <div className="mt-9">
              <input
                type="range"
                min={0}
                max={100}
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                aria-label="Support coverage"
                className="cx-slider w-full"
                style={{ "--fill": `${t}%` } as React.CSSProperties}
              />
              <div className="mt-3 flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span>Understaffed</span>
                <span className={ratio > 0.75 ? "text-signal" : ""}>
                  Fully covered
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
              <p className="font-display text-lg font-semibold text-primary">
                Better coverage. Less waiting.
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                Illustrative scenario for demonstration only (not measured
                company performance).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock;
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 font-display text-lg font-semibold tabular-nums text-primary">
        <Icon className="h-4 w-4 text-navy-soft" />
        {value}
      </p>
      <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
