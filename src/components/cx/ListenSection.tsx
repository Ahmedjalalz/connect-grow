/**
 * "Listen to the customer" — a large studio-style waveform that plays back a
 * support conversation. Visual only (no audio file), driven by rAF timing.
 */
import { useEffect, useRef, useState } from "react";
import { Check, Play, Square } from "lucide-react";

const BAR_COUNT = 96;
const DURATION = 12000;

/** Deterministic, speech-like amplitude envelope. */
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / BAR_COUNT;
  const speech =
    Math.abs(Math.sin(t * 21)) * 0.55 +
    Math.abs(Math.sin(t * 7.3 + 1.2)) * 0.3 +
    Math.abs(Math.sin(t * 43 + 0.6)) * 0.15;
  const breath = 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI * 3.1));
  return Math.max(0.12, Math.min(1, speech * breath + 0.1));
});

type Line = {
  at: number;
  role: "Customer" | "Support";
  text: string;
};

const LINES: Line[] = [
  { at: 700, role: "Customer", text: "Hi, I need help with my order…" },
  { at: 4200, role: "Support", text: "Absolutely. Let me look into that for you." },
  { at: 8200, role: "Customer", text: "Thank you so much." },
];

const RESOLVED_AT = 10800;

export function ListenSection() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - elapsed;
    const tick = (now: number) => {
      const e = now - start;
      if (e >= DURATION) {
        setElapsed(DURATION);
        setPlaying(false);
        return;
      }
      setElapsed(e);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const progress = elapsed / DURATION;
  const head = progress * BAR_COUNT;
  const visible = LINES.filter((l) => elapsed >= l.at);
  const resolved = elapsed >= RESOLVED_AT;
  const speaking = playing ? LINES.filter((l) => elapsed >= l.at).at(-1) : undefined;

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (elapsed >= DURATION) setElapsed(0);
    setPlaying(true);
  };

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-secondary/25">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-40" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
            Step one — listen
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
            Every customer has{" "}
            <span className="text-gradient-navy">something to say.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Great customer experience doesn't start with a script — it starts
            with hearing the person on the other end of the line. Press play and
            listen in on how a handled conversation sounds.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2.25rem] border border-border/60 bg-card shadow-lift">
          {/* console head */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-9">
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-signal" : "bg-border"}`}
              />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-navy-soft">
                {playing ? "Live playback" : resolved ? "Call ended" : "Call recording"}
              </span>
            </div>
            <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground">
              {formatTime(elapsed)} / {formatTime(DURATION)}
            </span>
          </div>

          <div className="grid gap-10 px-6 py-9 sm:px-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            {/* waveform */}
            <div>
              <div className="flex h-44 items-center gap-[3px] sm:h-52">
                {BARS.map((amp, i) => {
                  const played = i <= head;
                  const near = Math.abs(i - head);
                  const boost = playing && near < 6 ? 1 + (6 - near) * 0.07 : 1;
                  const height =
                    Math.round(Math.min(100, amp * 100 * boost) * 100) / 100;
                  return (
                    <span
                      key={i}
                      className="flex-1 rounded-full transition-[height,background-color,opacity] duration-150 ease-out"
                      style={{
                        height: `${height}%`,
                        backgroundColor: played
                          ? "color-mix(in oklab, var(--signal) 78%, var(--navy))"
                          : "color-mix(in oklab, var(--navy) 16%, transparent)",
                        opacity: played ? 1 : 0.75,
                        boxShadow:
                          playing && near < 4
                            ? "0 0 14px color-mix(in oklab, var(--signal) 55%, transparent)"
                            : "none",
                      }}
                    />
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={toggle}
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  {playing ? (
                    <Square className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                  {playing ? "Stop" : "Play conversation"}
                </button>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Illustrative conversation — visual playback, no audio.
                </p>
              </div>
            </div>

            {/* transcript */}
            <div className="relative rounded-[1.75rem] border border-border/60 bg-secondary/40 p-6">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-navy-soft">
                Transcript
              </p>

              <div className="mt-5 space-y-4">
                {visible.length === 0 ? (
                  <p className="text-sm text-muted-foreground/70">
                    Waiting for the line to open…
                  </p>
                ) : null}

                {visible.map((line) => (
                  <div key={line.at} className="rise-in">
                    <p
                      className={`text-[0.6rem] font-bold uppercase tracking-[0.22em] ${
                        line.role === "Customer" ? "text-navy-soft" : "text-signal"
                      }`}
                    >
                      {line.role}
                    </p>
                    <p
                      className={`mt-1.5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        line.role === "Customer"
                          ? "bg-card text-foreground shadow-soft"
                          : "surface-navy"
                      } ${speaking === line ? "ring-1 ring-signal/40" : ""}`}
                    >
                      {line.text}
                    </p>
                  </div>
                ))}

                {resolved ? (
                  <div className="rise-in flex items-center gap-2 pt-1 text-sm font-semibold text-signal">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-signal/15">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    Resolved
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  return `0:${String(total).padStart(2, "0")}`;
}
