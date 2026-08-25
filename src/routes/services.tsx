import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { DeviceArt, DeviceIcon } from "@/components/DeviceArt";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Call Center & CX Pods | KyteLine" },
      {
        name: "description",
        content:
          "Inbound call support, outbound calling, live chat, email support, customer service, lead generation, appointment setting, sales outreach, technical support and custom CX pods.",
      },
      { property: "og:title", content: "Services — KyteLine" },
      {
        property: "og:description",
        content:
          "Ten outsourced customer experience services, each with a dedicated pod, scripts, QA and reporting.",
      },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Call Center & CX Services — KyteLine" },
      {
        name: "twitter:description",
        content:
          "Inbound, outbound, chat, email, lead generation, appointment setting, technical support and custom solutions.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function WaveSeparator({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
      style={{ transform: flip ? "translateY(99%) rotate(180deg)" : undefined }}
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Primary wave fill */}
      <path
        d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z"
        fill="url(#waveGradient)"
      />
      {/* Crisp stroke lines for definition */}
      <path
        d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />
      <path
        d="M0,95 C240,135 480,55 720,95 C960,135 1200,55 1440,95"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1"
      />
    </svg>
  );
}

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
            Services
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">
            Pick the lines you want{" "}
            <span className="text-gradient-navy">off your desk</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every service below ships as a pod: named agents, your scripts, your
            tools, QA reviews and a weekly report. Mix as many as you need.
          </p>

          <nav className="mt-9 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:shadow-soft"
              >
                <DeviceIcon shape={s.device} />
                {s.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="relative">
        {/* vertical connector line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-5 hidden w-px md:left-8 lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--primary) 10%, var(--primary) 90%, transparent 100%)",
            opacity: 0.22,
          }}
        />

        {SERVICES.map((service, i) => {
          const dark = i % 2 === 1;
          const fancy = i % 3 === 0; // every third section gets a wave separator
          const angled = i % 4 === 2; // every fourth section gets an angled cut
          const number = String(i + 1).padStart(2, "0");

          return (
            <section
              key={service.slug}
              id={service.slug}
              className={`relative scroll-mt-20 overflow-hidden border-b transition-colors duration-500 ${
                dark
                  ? "surface-navy border-primary-foreground/10"
                  : "border-border/60 bg-background"
              } ${fancy ? "pb-16 md:pb-20" : ""} ${
                angled ? "pt-8 md:pt-12" : ""
              }`}
            >
              {/* separator before fancy section */}
              {fancy && !dark && (
                <WaveSeparator className="section-wave-top text-primary" />
              )}
              {angled && dark && (
                <div className="angled-separator angled-separator-top bg-background" />
              )}

              {dark ? (
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.07] grid-blueprint"
                />
              ) : null}

              {/* floating orb between sections */}
              <div
                aria-hidden
                className={`service-orb ${
                  dark ? "bg-signal" : "bg-primary"
                }`}
                style={{
                  width: i % 2 === 0 ? 180 : 120,
                  height: i % 2 === 0 ? 180 : 120,
                  top: `${(i % 3) * 12}%`,
                  right: i % 2 === 0 ? "-4%" : "auto",
                  left: i % 2 === 1 ? "-4%" : "auto",
                  animationDelay: `${i * 0.4}s`,
                  opacity: dark ? 0.15 : 0.08,
                }}
              />

                <div
                  className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-20 lg:pl-10"
                >
                  {/* Number tag: Always top-left of the section grid, regardless of column order */}
                  <div
                    className={`absolute top-10 left-5 md:left-10 z-20 service-connector-inline ${
                      dark
                        ? "bg-primary-foreground text-primary connector-glow-dark"
                        : "bg-primary text-primary-foreground connector-glow"
                    } connector-pulse`}
                  >
                    {number}
                  </div>

                  <div className={`flex flex-col items-start ${i % 4 === 2 ? "md:order-last" : ""}`}>
                    {/* Spacer to account for the absolute number tag above */}
                    <div className="h-14 w-full" />
                    <div>
                  <div
                    className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                      dark ? "text-primary-foreground/55" : "text-navy-soft"
                    }`}
                  >
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                        dark
                          ? "bg-primary-foreground/10 text-primary-foreground"
                          : "bg-secondary text-primary"
                      }`}
                    >
                      <DeviceIcon shape={service.device} />
                    </span>
                    {service.short}
                  </div>

                  <h2 className="mt-5 font-display text-3xl font-semibold sm:text-[2.1rem]">
                    {service.name}
                  </h2>
                  <p
                    className={`mt-2 font-display text-lg ${
                      dark ? "text-primary-foreground/70" : "text-navy-soft"
                    }`}
                  >
                    {service.metric.value} · {service.metric.label}
                  </p>
                  <p
                    className={`mt-5 max-w-lg text-sm leading-relaxed ${
                      dark
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {service.blurb}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            dark ? "text-signal" : "text-navy-soft"
                          }`}
                        />
                        <span
                          className={
                            dark
                              ? "text-primary-foreground/85"
                              : "text-foreground/85"
                          }
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/quote"
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lift ${
                      dark
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Quote this service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

                {/* device panel */}
                <div
                  className={`relative flex aspect-[4/3] flex-col justify-between rounded-[2.5rem] border p-8 group overflow-hidden transition-all duration-700 ${
                    i % 4 === 2 ? "md:order-first" : ""
                  } ${
                    dark
                      ? "border-primary-foreground/12 bg-primary-foreground/[0.04] hover:bg-primary-foreground/[0.07]"
                      : "border-border/50 bg-card shadow-soft hover:shadow-lift hover:border-primary/20"
                  }`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 grid-blueprint opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.09]"
                  />
                  <div className="absolute -inset-20 bg-primary/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* corner ticks */}
                  {[
                    "left-6 top-6 border-l border-t",
                    "right-6 top-6 border-r border-t",
                    "left-6 bottom-6 border-l border-b",
                    "right-6 bottom-6 border-r border-b",
                  ].map((pos) => (
                    <span
                      key={pos}
                      aria-hidden
                      className={`absolute h-5 w-5 rounded-[3px] ${pos} ${
                        dark
                          ? "border-primary-foreground/20"
                          : "border-primary/15"
                      }`}
                    />
                  ))}

                  <div className="relative z-10 flex items-start justify-between">
                    <span
                      className={`font-display text-[3.4rem] font-semibold leading-none ${
                        dark
                          ? "text-primary-foreground/10"
                          : "text-primary/[0.08]"
                      }`}
                    >
                      {number}
                    </span>
                    <span
                      aria-hidden
                      className="flex items-end gap-1.5 pt-3 pr-1"
                    >
                      {[0, 1, 2, 3, 4].map((b) => (
                        <span
                          key={b}
                          className={`signal-bar block w-1 rounded-full ${
                            dark ? "bg-signal/70" : "bg-navy-soft/50"
                          }`}
                          style={{
                            height: 8 + ((b * 7) % 16),
                            animationDelay: `${b * 0.13}s`,
                          }}
                        />
                      ))}
                    </span>
                  </div>

                  <div className="relative z-10 mx-auto h-[55%] w-full max-w-[19rem] transition-all duration-700 group-hover:scale-[1.06]">
                    <DeviceArt shape={service.device} />
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-500 group-hover:translate-x-1 ${
                        dark
                          ? "bg-primary-foreground/10 text-primary-foreground/80 border border-primary-foreground/10"
                          : "bg-secondary/80 text-primary border border-primary/10"
                      }`}
                    >
                      {service.metric.value} · {service.metric.label}
                    </span>
                    <span
                      className={`hidden text-[0.6rem] font-semibold uppercase tracking-[0.2em] sm:inline ${
                        dark
                          ? "text-primary-foreground/35"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      Live pod
                    </span>
                  </div>
                </div>

              </div>

              {/* separator after section */}
              {fancy && !dark && (
                <WaveSeparator className="section-wave-bottom text-primary" />
              )}
              {angled && dark && (
                <div className="angled-separator angled-separator-bottom bg-background" />
              )}
            </section>
          );
        })}
      </div>

      <section className="relative mx-auto w-full max-w-6xl px-5 py-20 text-center">
        <div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-background/0 to-background"
        />
        <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold sm:text-4xl">
          Not sure which pod you need?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Tick a few boxes and we'll tell you what we'd actually recommend.
        </p>
        <Link
          to="/quote"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
        >
          Get a quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </SiteLayout>
  );
}
