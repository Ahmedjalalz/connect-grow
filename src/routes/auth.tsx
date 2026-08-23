import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEMO_CREDENTIALS, isSignedIn, signInDemo } from "@/lib/local-leads";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team Sign In — KyteLine Lead Desk" },
      {
        name: "description",
        content:
          "Sign in to the KyteLine internal lead desk to review and progress incoming quote requests.",
      },
      { property: "og:title", content: "Team Sign In — KyteLine" },
      {
        property: "og:description",
        content: "Internal sign in for the KyteLine lead desk.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);

  useEffect(() => {
    if (isSignedIn()) navigate({ to: "/admin" });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInDemo(email, password)) {
      toast.error("Wrong demo credentials.");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl surface-navy">
          <span className="h-3 w-3 rounded-full border-2 border-primary-foreground/80" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">Lead desk</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo sign-in — no backend connected yet.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </button>
        </form>

        <p className="mt-5 rounded-xl bg-secondary px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Demo login: <strong>{DEMO_CREDENTIALS.email}</strong> /{" "}
          <strong>{DEMO_CREDENTIALS.password}</strong>
        </p>
      </div>
    </div>
  );
}
