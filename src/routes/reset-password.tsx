import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password | KyteLine Lead Desk" },
      {
        name: "description",
        content: "Reset your KyteLine lead desk account password.",
      },
      { property: "og:title", content: "Set New Password | KyteLine" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Listen for recovery event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setReady(true);
      }
    });

    // Also check current session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }
      setReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasMinLength = password.length >= 6;
  const hasMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    setBusy(false);

    if (error) {
      toast.error(error.message || "Failed to update password. Please try again.");
      return;
    }

    toast.success("Password updated successfully!");
    setDone(true);
    setTimeout(() => {
      navigate({ to: "/admin" });
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Logo variant="light" size="md" />

        {done ? (
          <div className="mt-8 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your new password is now active. Redirecting you to the lead desk…
            </p>
            <Link
              to="/admin"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift"
            >
              Go to lead desk
            </Link>
          </div>
        ) : ready && hasSession === false ? (
          <div className="mt-8 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <KeyRound className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-display text-xl font-semibold">Recovery link expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is invalid or has expired. Please request a fresh reset link.
            </p>
            <Link
              to="/auth"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl surface-navy text-primary-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h1 className="font-display text-xl font-semibold">Set new password</h1>
                <p className="text-xs text-muted-foreground">
                  Choose a secure password for your account
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  New password
                </span>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Confirm new password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                      hasMinLength
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary"
                    }`}
                  >
                    {hasMinLength ? <Check className="h-2.5 w-2.5" /> : null}
                  </span>
                  At least 6 characters
                </p>
                <p className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                      hasMatch
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary"
                    }`}
                  >
                    {hasMatch ? <Check className="h-2.5 w-2.5" /> : null}
                  </span>
                  Passwords match
                </p>
              </div>

              <button
                type="submit"
                disabled={busy || !hasMinLength || !hasMatch}
                className="sheen mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-all disabled:opacity-50"
              >
                {busy ? "Updating password…" : "Update password"}
              </button>
            </form>

            <Link
              to="/auth"
              className="mt-5 block text-center text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
