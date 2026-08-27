/**
 * "One conversation, many channels" — a click-driven composition where
 * real communication objects light up around a single customer.
 */
import { useState } from "react";
import phoneImg from "@/assets/cx/obj-phone-modern.webp";
import chatImg from "@/assets/cx/obj-chat.webp";
import emailImg from "@/assets/cx/obj-email.webp";
import smsImg from "@/assets/cx/obj-sms.webp";
import calendarImg from "@/assets/cx/obj-calendar.webp";

type Channel = {
  key: string;
  label: string;
  note: string;
  img: string;
  /** position of the object, % of the stage */
  x: number;
  y: number;
};

const CHANNELS: Channel[] = [
  { key: "phone", label: "Phone", note: "Inbound & outbound calls", img: phoneImg, x: 50, y: 9 },
  { key: "chat", label: "Chat", note: "Live chat on your site", img: chatImg, x: 89, y: 36 },
  { key: "email", label: "Email", note: "Shared inbox coverage", img: emailImg, x: 76, y: 85 },
  { key: "sms", label: "SMS", note: "Text follow-ups", img: smsImg, x: 24, y: 85 },
  { key: "appointment", label: "Appointment", note: "Booked into your calendar", img: calendarImg, x: 11, y: 36 },
];

export function ChannelsSection() {
  const [stage, setStage] = useState(0);


  return (
    <section className="relative surface-navy">
      <div className="relative">
        <div className="relative flex items-center overflow-hidden py-20 md:py-24">
          <div aria-hidden className="absolute inset-0 grid-blueprint opacity-[0.07]" />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[140px]"
          />

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.85fr_1.15fr]">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
                Step two — connect
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-[1.12] sm:text-[2.3rem]">
                Your customers don't care which channel they use.
                <br />
                <span className="text-signal">They just want an answer.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/65">
                One person, five ways of reaching you. Pick a channel — we staff
                every line with the same context, the same tone and the same
                runbook, so the conversation never restarts.
              </p>

              <ul className="mt-8 space-y-2.5">
                {CHANNELS.map((c, i) => {
                  const active = i === stage;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => setStage(i)}
                        aria-pressed={active}
                        className={`flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-all duration-500 ${
                          active
                            ? "border-signal/50 bg-signal/10 text-primary-foreground"
                            : "border-primary-foreground/10 bg-primary-foreground/[0.03] text-primary-foreground/55 hover:border-signal/30 hover:bg-primary-foreground/[0.07] hover:text-primary-foreground/80"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${
                            active ? "animate-pulse bg-signal" : "bg-primary-foreground/25"
                          }`}
                        />
                        <span className="font-semibold uppercase tracking-[0.14em] text-[0.7rem]">
                          {c.label}
                        </span>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-[0.2em]">
                          {active ? "Active" : "Idle"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

            </div>

            {/* stage */}
            <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
              <svg
                aria-hidden
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                {CHANNELS.map((c, i) => {
                  const active = i === stage;
                  const done = i < stage;
                  const mx = (50 + c.x) / 2 + (c.y - 50) * 0.14;
                  const my = (50 + c.y) / 2 - (c.x - 50) * 0.14;
                  return (
                    <path
                      key={c.key}
                      d={`M 50 50 Q ${mx} ${my} ${c.x} ${c.y}`}
                      fill="none"
                      stroke={
                        active
                          ? "color-mix(in oklab, var(--signal) 90%, transparent)"
                          : "color-mix(in oklab, white 16%, transparent)"
                      }
                      strokeWidth={active ? 0.7 : 0.35}
                      strokeLinecap="round"
                      strokeDasharray={active ? "3 2.5" : done ? "0" : "1 2"}
                      className={active ? "cx-signal-flow" : ""}
                      style={{
                        filter: active
                          ? "drop-shadow(0 0 3px color-mix(in oklab, var(--signal) 70%, transparent))"
                          : "none",
                        opacity: active ? 1 : done ? 0.5 : 0.35,
                        transition: "opacity 0.6s ease, stroke-width 0.6s ease",
                      }}
                    />
                  );
                })}
              </svg>

              {/* the customer */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-primary-foreground/20 bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,white_18%,transparent),transparent_65%)] backdrop-blur-sm sm:h-40 sm:w-40">
                  <span
                    aria-hidden
                    className="wave-ring absolute inset-0 rounded-full border border-signal/40"
                  />
                  <span
                    aria-hidden
                    className="wave-ring absolute inset-0 rounded-full border border-signal/25"
                    style={{ animationDelay: "1.4s" }}
                  />
                  <div className="text-center">
                    <p className="font-display text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary-foreground/50">
                      One
                    </p>
                    <p className="font-display text-base font-semibold sm:text-lg">
                      Customer
                    </p>
                    <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-signal">
                      {CHANNELS[stage]?.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* channel objects */}
              {CHANNELS.map((c, i) => {
                const active = i === stage;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setStage(i)}
                    aria-pressed={active}
                    aria-label={`Show ${c.label} channel`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  >
                    <div
                      className="relative transition-all duration-500 ease-out hover:scale-105"
                      style={{
                        transform: active ? "scale(1.12)" : "scale(0.94)",
                        filter: active
                          ? "drop-shadow(0 18px 30px rgba(0,0,0,0.45)) brightness(1.06)"
                          : "grayscale(0.35) brightness(0.72)",
                        opacity: active ? 1 : 0.72,
                      }}
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute -inset-6 rounded-full bg-signal/20 blur-2xl"
                        />
                      ) : null}
                      <img
                        src={c.img}
                        alt={`${c.label} channel`}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="relative h-20 w-20 object-contain sm:h-28 sm:w-28"
                      />
                    </div>
                    <p
                      className={`mt-1 text-center text-[0.58rem] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
                        active ? "text-signal" : "text-primary-foreground/35"
                      }`}
                    >
                      {active ? c.note : c.label}
                    </p>
                  </button>
                );
              })}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
