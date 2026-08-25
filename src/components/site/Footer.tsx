import { Link } from "@tanstack/react-router";
import { SERVICES } from "@/lib/services";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 surface-navy">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo variant="dark" size="md" />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Outsourced call center and customer experience teams for growing B2B
            operations. Coverage in weeks, not quarters.
          </p>
          <Link
            to="/quote"
            className="mt-6 inline-flex rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Get a quote
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
            Services
          </p>
          <ul className="mt-4 space-y-2">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
            Company & Process
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/process"
                className="text-sm font-medium text-signal transition-colors hover:underline"
              >
                Our 6-Step Process →
              </Link>
            </li>
            <li>
              <Link
                to="/consult"
                className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
              >
                Book a Consultation
              </Link>
            </li>
            {SERVICES.slice(6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KyteLine. All rights reserved.</p>
          <p>Operations across 3 time zones · English, Spanish, Urdu, Arabic</p>
        </div>
      </div>
    </footer>
  );
}
