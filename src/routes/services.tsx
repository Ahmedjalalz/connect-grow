import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { DeviceArt, DeviceIcon } from "@/components/DeviceArt";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Call Center, CX & Back-office Pods | NorthlineCX" },
      {
        name: "description",
        content:
          "Inbound call support, outbound calling, live chat, email support, customer service, lead generation, appointment setting, sales outreach, technical support and back-office pods.",
      },
      { property: "og:title", content: "Services — NorthlineCX" },
      {
        property: "og:description",
        content:
          "Eleven outsourced customer experience services, each with a dedicated pod, scripts, QA and reporting.",
      },
    ],
  }),
  component: ServicesPage,
});

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
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                <DeviceIcon shape={s.device} />
                {s.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div>
        {SERVICES.map((service, i) => {
          const dark = i % 2 === 1;
          return (
            <section
              key={service.slug}
              id={service.slug}
              className={`relative scroll-mt-20 overflow-hidden border-b ${
                dark
                  ? "surface-navy border-primary-foreground/10"
                  : "border-border/60 bg-background"
              }`}
            >
              {dark ? (
                <div aria-hidden className="absolute inset-0 opacity-[0.07] grid-blueprint" />
              ) : null}

              <div
                className={`relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-20 ${
                  i % 4 === 2 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div
                    className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                      dark ? "text-primary-foreground/55" : "text-navy-soft"
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                        dark
                          ? "bg-primary-foreground/10 text-primary-foreground"
                          : "bg-secondary text-primary"
                      }`}
                    >
                      <DeviceIcon shape={service.device} />
                    </span>
                    Service {String(i + 1).padStart(2, "0")}
                  </div>

                  <h2 className="mt-5 font-display text-3xl font-semibold sm:text-[2.1rem]">
                    {service.name}
                  </h2>
                  <p
                    className={`mt-2 font-display text-lg ${
                      dark ? "text-primary-foreground/70" : "text-navy-soft"
                    }`}
                  >
                    {service.short}
                  </p>
                  <p
                    className={`mt-5 max-w-lg text-sm leading-relaxed ${
                      dark ? "text-primary-foreground/70" : "text-muted-foreground"
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
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      dark
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Quote this service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* device panel */}
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center rounded-3xl border p-10 ${
                    dark
                      ? "border-primary-foreground/12 bg-primary-foreground/[0.04]"
                      : "border-border bg-card shadow-soft"
                  }`}
                >
                  <div className="h-full w-full max-w-sm">
                    <DeviceArt shape={service.device} />
                  </div>
                  <div
                    className={`absolute bottom-5 left-6 rounded-full px-4 py-1.5 text-xs font-semibold ${
                      dark
                        ? "bg-primary-foreground/10 text-primary-foreground/80"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    {service.metric.value} · {service.metric.label}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 text-center">
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
