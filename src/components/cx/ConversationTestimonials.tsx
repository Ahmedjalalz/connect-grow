/**
 * Testimonials rendered as an unfolding conversation instead of review cards.
 * Copy is drawn from the site's own positioning; presented as illustrative.
 */
import { useInView } from "@/hooks/use-scroll-reveal";
import { Check } from "lucide-react";

type Turn = { role: "Customer" | "Team"; text: string };

const THREAD: Turn[] = [
  {
    role: "Customer",
    text: "We needed someone who could handle our support volume.",
  },
  {
    role: "Team",
    text: "We built a dedicated support workflow around your business, writing custom scripts and runbooks with you and training against real tickets.",
  },
  {
    role: "Customer",
    text: "Our response times improved dramatically.",
  },
  {
    role: "Team",
    text: "Same pod, named team lead, weekly reporting. Inbound, outbound, chat, email and technical support on one line.",
  },
  {
    role: "Customer",
    text: "Now it feels like they work here.",
  },
];

export function ConversationTestimonials() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-secondary/25">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-40" />

      <div ref={ref} className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
              Step 05 · Deliver
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] sm:text-[2.4rem]">
              The conversation that{" "}
              <span className="text-gradient-navy">starts every account</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Every partnership begins the same way: a problem said plainly, and
              an operation built around it. This is how that exchange usually
              runs.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground/80">
              Illustrative conversation composed from our onboarding
              process (not an individual client statement).
            </p>
          </div>

          <div className="relative rounded-[2.25rem] border border-border/60 bg-card p-6 shadow-lift sm:p-9">
            <div className="flex items-center justify-between border-b border-border/60 pb-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-navy-soft">
                Conversation thread
              </p>
              <span className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-signal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                Open
              </span>
            </div>

            <div className="mt-7 space-y-6">
              {THREAD.map((turn, i) => {
                const mine = turn.role === "Team";
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? "none" : "translateY(14px)",
                      transition: `opacity 0.7s ease ${i * 0.55 + 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.55 + 0.15}s`,
                    }}
                  >
                    <p
                      className={`text-[0.58rem] font-bold uppercase tracking-[0.22em] ${
                        mine ? "text-signal" : "text-navy-soft"
                      }`}
                    >
                      {turn.role}
                    </p>
                    <p
                      className={`mt-2 max-w-[92%] rounded-3xl px-5 py-4 text-sm leading-relaxed sm:max-w-[80%] ${
                        mine
                          ? "surface-navy rounded-tr-lg"
                          : "rounded-tl-lg border border-border/60 bg-secondary/50 text-foreground"
                      }`}
                    >
                      {turn.text}
                    </p>
                  </div>
                );
              })}

              <div
                className="flex items-center gap-2 pt-1 text-sm font-semibold text-signal"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.7s ease ${THREAD.length * 0.55 + 0.2}s`,
                }}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-signal/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                Pod live · Coverage handed over
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
