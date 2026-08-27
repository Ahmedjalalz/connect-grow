/**
 * Closing CTA — the rotary phone from the services dial, now with the receiver
 * resting in its cradle and ringing. Answering it = getting a quote.
 *
 * The phone is split into two layers: a static base and a vibrating receiver.
 */
import { Link } from "@tanstack/react-router";
import { PhoneCall } from "lucide-react";
import phoneBase from "@/assets/cx/desk-phone-base-v6.webp";
import phoneReceiver from "@/assets/cx/desk-phone-receiver.webp";

export function RingingQuoteSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-14 shadow-soft sm:px-12">
          <div aria-hidden className="absolute inset-0 grid-blueprint opacity-50" />
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/10 blur-[90px]"
          />

          <div className="relative grid items-center gap-12 md:grid-cols-[1fr_0.95fr]">
            {/* copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-navy-soft">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                Incoming — line 1
              </span>

              <h2 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.1] sm:text-4xl">
                That's your quote calling.{" "}
                <span className="text-gradient-navy">Pick up the receiver</span>{" "}
                and we'll price it in one business day.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Answering takes three short steps — what to pick up, how big the
                operation is, and where to send the numbers. No sales maze, no
                20-field form.
              </p>

              <Link
                to="/quote"
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                <PhoneCall className="h-4 w-4 transition-transform group-hover:rotate-12" />
                Answer the call — get a quote
              </Link>
            </div>

            {/* ringing phone */}
            <div className="relative mx-auto w-full max-w-[26rem]">
              <div
                aria-hidden
                className="absolute inset-[6%] rounded-full bg-signal/15 blur-[70px]"
              />
              <Link
                to="/quote"
                aria-label="Answer the call and get a quote"
                className="group relative block [transform:perspective(1400px)_rotateX(14deg)] [transform-style:preserve-3d]"
              >
                {/* static base */}
                <img
                  src={phoneBase}
                  alt="Navy desk telephone base"
                  width={928}
                  height={1152}
                  loading="lazy"
                  className="relative z-10 w-full drop-shadow-[0_30px_55px_rgba(20,28,54,0.38)] transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* receiver resting face-down in the cradle, vibrating */}
                <img
                  src={phoneReceiver}
                  alt="Navy telephone receiver ringing in its cradle"
                  width={861}
                  height={286}
                  loading="lazy"
                  className="phone-ring-shake pointer-events-none absolute left-1/2 top-[1.5%] z-20 w-[92%] -translate-x-1/2 drop-shadow-[0_12px_20px_rgba(20,28,54,0.5)]"
                />

                {/* call waves around the receiver */}
                <span
                  aria-hidden
                  className="wave-ring pointer-events-none absolute left-1/2 top-[10%] z-0 h-44 w-44 -translate-x-1/2 rounded-full border border-signal/50"
                />
                <span
                  aria-hidden
                  className="wave-ring pointer-events-none absolute left-1/2 top-[10%] z-0 h-44 w-44 -translate-x-1/2 rounded-full border border-signal/30"
                  style={{ animationDelay: "1.2s" }}
                />
              </Link>

              <p className="relative mt-5 text-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-navy-soft">
                Tap the phone to answer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
