/**
 * Interactive vintage switchboard — drag a braided patch cable from a customer
 * line into a service jack. Built on a photographed switchboard panel.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import boardImg from "@/assets/cx/switchboard.jpg";

type Jack = { id: string; no: string; label: string; y: number };

const JACKS: Jack[] = [
  { id: "support", no: "01", label: "Customer Support", y: 16 },
  { id: "sales", no: "02", label: "Sales", y: 32 },
  { id: "tech", no: "03", label: "Technical Support", y: 48 },
  { id: "appointments", no: "04", label: "Appointment Setting", y: 64 },
  { id: "leads", no: "05", label: "Lead Generation", y: 80 },
];

const PLUGS = [
  { id: "a", label: "Customer — inbound", y: 32 },
  { id: "b", label: "Customer — callback", y: 64 },
];

const PLUG_X = 15;
const JACK_X = 79;

type Conns = Record<string, string | undefined>;

export function SwitchboardSection() {
  const board = useRef<HTMLDivElement | null>(null);
  const [conns, setConns] = useState<Conns>({});
  const [drag, setDrag] = useState<{ plug: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const toPct = useCallback((clientX: number, clientY: number) => {
    const el = board.current;
    if (!el) return { x: PLUG_X, y: 50 };
    const r = el.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
    };
  }, []);

  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      const p = toPct(e.clientX, e.clientY);
      setDrag((d) => (d ? { ...d, ...p } : d));
      const near = JACKS.find(
        (j) => Math.abs(p.x - JACK_X) < 16 && Math.abs(p.y - j.y) < 8,
      );
      setHover(near?.id ?? null);
    };

    const onUp = (e: PointerEvent) => {
      const p = toPct(e.clientX, e.clientY);
      const near = JACKS.find(
        (j) => Math.abs(p.x - JACK_X) < 16 && Math.abs(p.y - j.y) < 8,
      );
      setDrag((d) => {
        if (d && near) {
          setConns((c) => {
            const next: Conns = { ...c };
            // one cable per jack
            for (const k of Object.keys(next)) {
              if (next[k] === near.id) next[k] = undefined;
            }
            next[d.plug] = near.id;
            return next;
          });
        }
        return null;
      });
      setHover(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, toPct]);

  const connectedCount = Object.values(conns).filter(Boolean).length;

  return (
    <section className="relative overflow-hidden surface-navy">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-[0.07]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
              Step three — route
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]">
              Patch the caller through to{" "}
              <span className="text-signal">the right desk.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/65">
              Pick up a cable and plug a customer line into a service. Routing is
              the difference between a call answered and a call repeated.
            </p>
          </div>

          {connectedCount > 0 ? (
            <button
              type="button"
              onClick={() => setConns({})}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-2 text-xs font-semibold text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Unplug all
            </button>
          ) : null}
        </div>

        {/* board */}
        <div
          ref={board}
          className="relative mt-12 aspect-[3/2] w-full select-none overflow-hidden rounded-[2rem] border border-primary-foreground/15 shadow-lift"
        >
          <img
            src={boardImg}
            alt="Vintage telephone operator switchboard"
            loading="lazy"
            width={1536}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 40%, color-mix(in oklab, oklch(0.2 0.06 262) 55%, transparent), oklch(0.16 0.05 262) 100%)",
            }}
          />

          {/* cables */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {PLUGS.map((p) => {
              const target = conns[p.id];
              const jack = JACKS.find((j) => j.id === target);
              const live = drag?.plug === p.id;
              const end = live
                ? { x: drag.x, y: drag.y }
                : jack
                  ? { x: JACK_X, y: jack.y }
                  : null;
              if (!end) return null;
              const sag = Math.max(end.y, p.y) + 22;
              return (
                <g key={p.id}>
                  <path
                    d={`M ${PLUG_X} ${p.y} C ${PLUG_X + 14} ${sag}, ${end.x - 14} ${sag}, ${end.x} ${end.y}`}
                    fill="none"
                    stroke="oklch(0.16 0.03 262)"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={`M ${PLUG_X} ${p.y} C ${PLUG_X + 14} ${sag}, ${end.x - 14} ${sag}, ${end.x} ${end.y}`}
                    fill="none"
                    stroke={
                      jack && !live
                        ? "color-mix(in oklab, var(--signal) 92%, transparent)"
                        : "color-mix(in oklab, var(--steel) 70%, transparent)"
                    }
                    strokeWidth={1.3}
                    strokeLinecap="round"
                    strokeDasharray="2.5 2"
                    vectorEffect="non-scaling-stroke"
                    className={jack && !live ? "cx-signal-flow" : ""}
                    style={{
                      filter:
                        jack && !live
                          ? "drop-shadow(0 0 4px color-mix(in oklab, var(--signal) 75%, transparent))"
                          : "none",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* customer plugs */}
          {PLUGS.map((p) => {
            const connected = Boolean(conns[p.id]);
            return (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${PLUG_X}%`, top: `${p.y}%` }}
              >
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    const pt = toPct(e.clientX, e.clientY);
                    setConns((c) => ({ ...c, [p.id]: undefined }));
                    setDrag({ plug: p.id, ...pt });
                  }}
                  aria-label={`Drag ${p.label} cable`}
                  className="cx-plug group relative block h-9 w-9 cursor-grab rounded-full active:cursor-grabbing sm:h-11 sm:w-11"
                >
                  <span className="cx-plug-tip" />
                  <span
                    className={`absolute inset-0 rounded-full transition-shadow ${
                      connected
                        ? "shadow-[0_0_16px_color-mix(in_oklab,var(--signal)_60%,transparent)]"
                        : ""
                    }`}
                  />
                </button>
                <p className="mt-2 w-28 text-[0.55rem] font-bold uppercase leading-tight tracking-[0.16em] text-primary-foreground/60 sm:w-32 sm:text-[0.6rem]">
                  {p.label}
                </p>
              </div>
            );
          })}

          {/* service jacks */}
          {JACKS.map((j) => {
            const wired = Object.values(conns).includes(j.id);
            const targeted = hover === j.id;
            return (
              <div
                key={j.id}
                className="absolute flex -translate-y-1/2 items-center gap-3"
                style={{ left: `${JACK_X}%`, top: `${j.y}%` }}
              >
                <span
                  className={`cx-jack ${targeted ? "cx-jack-target" : ""} ${wired ? "cx-jack-live" : ""}`}
                >
                  <span className="cx-jack-hole" />
                </span>
                <span className="cx-plate">
                  <span className="font-display text-[0.6rem] font-bold tracking-[0.12em] text-signal/90">
                    {j.no}
                  </span>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-primary-foreground/80">
                    {j.label}
                  </span>
                  <span className={`cx-lamp ${wired ? "cx-lamp-on" : ""}`} />
                </span>
              </div>
            );
          })}

          {/* status */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
            {PLUGS.map((p) => {
              const jack = JACKS.find((j) => j.id === conns[p.id]);
              if (!jack) return null;
              return (
                <span
                  key={p.id}
                  className="rise-in inline-flex items-center gap-2 rounded-full border border-signal/40 bg-navy-deep/80 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-signal backdrop-blur-sm"
                >
                  <Check className="h-3 w-3" />
                  Customer → {jack.label} · Connected
                </span>
              );
            })}
            {connectedCount === 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-navy-deep/70 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-primary-foreground/65 backdrop-blur-sm">
                Drag a cable into a line
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
