import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Headphones, ShieldCheck, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ListenSection } from "@/components/cx/ListenSection";
import { ChannelsSection } from "@/components/cx/ChannelsSection";
import { QueueSection } from "@/components/cx/QueueSection";
import { BeforeAfterSection } from "@/components/cx/BeforeAfterSection";
import { ConversationTestimonials } from "@/components/cx/ConversationTestimonials";
import { AgentDeskSection } from "@/components/cx/AgentDeskSection";
import { RingingQuoteSection } from "@/components/cx/RingingQuoteSection";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process — How We Deliver World-Class CX | NorthlineCX" },
      {
        name: "description",
        content:
          "Explore the end-to-end NorthlineCX operational framework. From listening and multi-channel routing to rapid queue response, continuous QA, and dedicated agent workstations.",
      },
      { property: "og:title", content: "Our Process — NorthlineCX" },
      {
        property: "og:description",
        content:
          "Discover how our 6-step customer experience blueprint transforms your support and sales operations.",
      },
    ],
  }),
  component: ProcessPage,
});

const HIGHLIGHTS = [
  {
    icon: Headphones,
    title: "Dedicated Pod Architecture",
    description: "Agents trained exclusively on your brand voice, tools, workflows, and escalation paths.",
  },
  {
    icon: Zap,
    title: "Two-Week Rapid Onboarding",
    description: "From scoping call to live coverage with rigorous QA and continuous metric tracking.",
  },
  {
    icon: ShieldCheck,
    title: "99% SLA & Quality Adherence",
    description: "Multi-tier supervision and regular sentiment analysis ensure consistent excellence.",
  },
];

function ProcessPage() {
  return (
    <SiteLayout>
      {/* ---------------- INTRO / HERO SECTION ---------------- */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background">
        <div aria-hidden className="absolute inset-0 grid-blueprint opacity-50" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              The NorthlineCX Operational Blueprint
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              How exceptional <span className="text-gradient-navy">customer experience</span> actually happens.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Building an outsourced CX team isn't just about picking up calls — it's about engineering empathy, speed, and continuous refinement into every single customer touchpoint.
            </p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Below is our complete six-step operational lifecycle: from hearing what your customers need, to multi-channel routing, queue elimination, quality coaching, authentic conversations, and the unified agent cockpit that powers it all.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/quote"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                Launch your pod
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/consult"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Schedule scoping call
              </Link>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 border-t border-border/80 pt-10">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <h.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-primary">
                  {h.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STEP ONE — LISTEN ---------------- */}
      <ListenSection />

      {/* ---------------- STEP TWO — CONNECT ---------------- */}
      <ChannelsSection />

      {/* ---------------- STEP THREE — RESPOND ---------------- */}
      <QueueSection />

      {/* ---------------- STEP FOUR — IMPROVE ---------------- */}
      <BeforeAfterSection />

      {/* ---------------- STEP FIVE — DELIVER ---------------- */}
      <ConversationTestimonials />

      {/* ---------------- STEP SIX — THE DESK ---------------- */}
      <AgentDeskSection />

      {/* ---------------- HOW ONBOARDING RUNS ---------------- */}
      <section className="relative overflow-hidden surface-navy">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] grid-blueprint" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
            Onboarding Timeline
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            From first call to live coverage in three moves
          </h2>
          <p className="mt-4 max-w-lg text-sm text-primary-foreground/70 leading-relaxed">
            Our structured onboarding gets your pod live and taking tickets in two weeks without disrupting your existing team.
          </p>

          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Scoping Call",
                body: "30 minutes to map volumes, channels, operating hours, and the CRM/helpdesk tools your team already lives in.",
              },
              {
                step: "02",
                title: "Pod Design & Training",
                body: "We hand-pick agents, build customized scripts and runbooks with your feedback, then train against real historical tickets.",
              },
              {
                step: "03",
                title: "Go Live & Continuous Tune",
                body: "Soft launch with 100% QA in week one, followed by scheduled weekly reporting and transparent metric reviews with a named team lead.",
              },
            ].map((s) => (
              <li
                key={s.step}
                className="relative rounded-2xl border border-primary-foreground/12 bg-primary-foreground/[0.04] p-6 backdrop-blur-sm"
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

      {/* ---------------- CTA ---------------- */}
      <RingingQuoteSection />
    </SiteLayout>
  );
}
