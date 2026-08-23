import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Globe2, ShieldCheck } from "lucide-react";
import { HeroPhone } from "@/components/hero/HeroPhone";
import { SiteLayout } from "@/components/site/SiteLayout";
import { RotarySection } from "@/components/services/RotarySection";
import { ListenSection } from "@/components/cx/ListenSection";
import { ChannelsSection } from "@/components/cx/ChannelsSection";
import { QueueSection } from "@/components/cx/QueueSection";
import { BeforeAfterSection } from "@/components/cx/BeforeAfterSection";
import { AgentDeskSection } from "@/components/cx/AgentDeskSection";
import { ConversationTestimonials } from "@/components/cx/ConversationTestimonials";
import { RingingQuoteSection } from "@/components/cx/RingingQuoteSection";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NorthlineCX — Outsourced Call Center & CX Teams for B2B" },
      {
        name: "description",
        content:
          "Inbound and outbound calling, live chat, email support, lead generation and back-office pods. Launch a trained customer experience team in weeks.",
      },
      { property: "og:title", content: "NorthlineCX — Outsourced Call Center & CX Teams" },
      {
        property: "og:description",
        content:
          "Trained agents for inbound support, outbound calling, live chat, lead generation and back-office work. Coverage in weeks, not quarters.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { icon: Clock, value: "< 20s", label: "Average answer time" },
  { icon: Globe2, value: "3", label: "Time zones covered" },
  { icon: ShieldCheck, value: "99%", label: "SLA adherence" },
];

function Home() {
  return (
    <SiteLayout>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-4 px-5 pb-20 pt-14 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-8">
          {/* copy column — CTAs sit around the earpiece height of the receiver */}
          <div className="flex flex-col justify-center md:pt-24">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Lines open 24/7
            </span>

            <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
              Your customers call.
              <br />
              <span className="text-gradient-navy">We answer</span> — like we
              work there.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              NorthlineCX builds outsourced{" "}
              <strong className="font-semibold text-primary">call center</strong>{" "}
              and{" "}
              <strong className="font-semibold text-primary">
                customer experience
              </strong>{" "}
              pods for B2B teams — inbound, outbound, chat, email and
              back-office, live in{" "}
              <strong className="font-semibold text-primary">two weeks</strong>.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/quote"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                Get a quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Explore services
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-xl font-semibold text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* receiver */}
          <div className="order-first md:order-none">
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* ---------------- LISTEN ---------------- */}
      <ListenSection />

      {/* ---------------- ROTARY DIAL ---------------- */}
      <RotarySection />

      {/* ---------------- CHANNELS ---------------- */}
      <ChannelsSection />





      {/* ---------------- CONSULTATION ---------------- */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">Expert Guidance</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Not sure where to start? <br/>
              <span className="text-gradient-navy">Consult an expert</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
              Book a 15-minute strategy session to discuss your specific needs. No commitment, just a roadmap for your customer experience transformation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/consult" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5">
                Book a consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-12 bg-primary/10 blur-[80px] rounded-full opacity-50" />
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-signal/10 blur-[60px] rounded-full float-reverse" />
            
            <div className="glass-card-premium p-10 rounded-[2.5rem] relative overflow-hidden float-slow">
              <div aria-hidden className="absolute inset-0 grid-blueprint opacity-[0.03]" />
              <div className="relative">
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-navy rounded-full blur-[2px] opacity-20" />
                    <div className="h-16 w-16 rounded-2xl bg-navy flex items-center justify-center text-white font-display text-2xl font-bold relative shadow-lift">
                      AJ
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary tracking-tight">Ahmed Jalal</p>
                    <p className="text-[0.65rem] text-navy-soft font-bold uppercase tracking-[0.2em] mt-0.5">CX Strategy Expert</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-signal" />
                    <div className="h-2 w-full bg-navy/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-navy/10" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-signal/50" />
                    <div className="h-2 w-4/5 bg-navy/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-navy/10" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-signal/30" />
                    <div className="h-2 w-5/6 bg-navy/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-navy/10" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-navy/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-secondary" />
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-card bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                      +12
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-navy-soft uppercase tracking-widest">Available now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- QUEUE ---------------- */}
      <QueueSection />

      {/* ---------------- BEFORE / AFTER ---------------- */}
      <BeforeAfterSection />

      {/* ---------------- AGENT DESK ---------------- */}
      <AgentDeskSection />


      {/* ---------------- PROCESS ---------------- */}
      <section className="relative overflow-hidden surface-navy">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] grid-blueprint" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
            How onboarding runs
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            From first call to live coverage in three moves
          </h2>

          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Scoping call",
                body: "30 minutes to map volumes, channels, hours and the tools your team already lives in.",
              },
              {
                step: "02",
                title: "Pod design & training",
                body: "We hand-pick agents, write the scripts and runbooks with you, then train against real tickets.",
              },
              {
                step: "03",
                title: "Go live & tune",
                body: "Soft launch, daily QA in week one, then weekly reporting with a named team lead.",
              },
            ].map((s) => (
              <li
                key={s.step}
                className="relative rounded-2xl border border-primary-foreground/12 bg-primary-foreground/[0.04] p-6"
              >
                <span className="font-display text-3xl font-semibold text-primary-foreground/25">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- TESTIMONIAL CONVERSATION ---------------- */}
      <ConversationTestimonials />

      {/* ---------------- CTA ---------------- */}
      <RingingQuoteSection />

    </SiteLayout>
  );
}
