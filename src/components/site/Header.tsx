import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SERVICES } from "@/lib/services";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/process", label: "Our Process" },
  { to: "/consult", label: "Consult" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full nav-shell",
          scrolled ? "nav-shell-scrolled px-3 py-2 sm:px-4" : "px-3 py-2.5 sm:px-5 sm:py-3",
        )}
      >
        <Logo variant="light" size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="nav-link" data-active={pathname === "/"}>
            Home
          </Link>

          {/* Services with mega dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMenu(true)}
            onMouseLeave={() => setMenu(false)}
          >
            <Link
              to="/services"
              className="nav-link inline-flex items-center gap-1.5"
              data-active={pathname.startsWith("/services")}
            >
              Services
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  menu && "rotate-180",
                )}
              />
            </Link>

            {menu ? (
              <div className="absolute left-1/2 top-full w-[38rem] -translate-x-1/2 pt-3">
                <div className="menu-pop overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 p-3 shadow-lift backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-1">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to="/services"
                        hash={s.slug}
                        className="group flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/80"
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secondary text-navy-soft transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Phone className="h-3.5 w-3.5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold leading-tight text-foreground">
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground line-clamp-1">
                            {s.short}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Not sure which pod fits? Talk to an expert first.
                    </p>
                    <Link
                      to="/consult"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Book a call <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              data-active={pathname.startsWith(item.to)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/quote"
            className="group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:inline-flex sheen"
          >
            Get a quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open ? (
        <div className="mx-auto mt-2 w-full max-w-6xl md:hidden">
          <div className="menu-pop rounded-[1.75rem] border border-border/70 bg-card/95 p-3 shadow-lift backdrop-blur-xl">
            {[...NAV, { to: "/services", label: "Services" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                {item.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Get a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
