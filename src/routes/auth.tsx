import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, RefreshCw, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

type AuthMode = "signin" | "signup" | "forgot" | "resend";

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
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [smtpError, setSmtpError] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate({ to: "/admin" });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setInfoMessage(null);
    setSmtpError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSmtpError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Email not confirmed yet.");
        setInfoMessage("Your email hasn't been confirmed yet. You can request a new confirmation email below.");
        setMode("resend");
      } else {
        toast.error(error.message);
      }
      return;
    }
    navigate({ to: "/admin" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    setSmtpError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);

    if (error) {
      const msg = error.message;
      if (
        msg.toLowerCase().includes("confirmation email") ||
        msg.toLowerCase().includes("error sending") ||
        msg.toLowerCase().includes("smtp")
      ) {
        setSmtpError(
          "Supabase was unable to send the confirmation email via your custom SMTP server. Please verify your SMTP credentials (Host, Port, User, Password, and verified Sender Email no-reply@mail.kyteline.com) in your Supabase Auth settings."
        );
      }
      toast.error(msg);
      return;
    }

    if (data.session) {
      toast.success("Account created and signed in!");
      navigate({ to: "/admin" });
      return;
    }

    setInfoMessage(`Confirmation email sent to ${email}. Please check your inbox (and spam folder) to activate your account.`);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSmtpError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);

    if (error) {
      const msg = error.message;
      if (
        msg.toLowerCase().includes("email") ||
        msg.toLowerCase().includes("error sending") ||
        msg.toLowerCase().includes("smtp")
      ) {
        setSmtpError(
          "Unable to send recovery email via your SMTP server. Please ensure your custom SMTP settings and sender identity are verified in Supabase."
        );
      }
      toast.error(msg);
      return;
    }

    setInfoMessage(`Password reset link sent to ${email}. Click the link in the email to choose a new password.`);
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSmtpError(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setInfoMessage(`A new confirmation email has been dispatched to ${email}.`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Logo variant="light" size="md" />

        <div className="mt-6">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "signin" && "Lead desk"}
            {mode === "signup" && "Create account"}
            {mode === "forgot" && "Reset password"}
            {mode === "resend" && "Resend activation"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin" && "Sign in to review leads and consultations."}
            {mode === "signup" && "Create a team account for the lead desk."}
            {mode === "forgot" && "Enter your email to receive a password reset link."}
            {mode === "resend" && "Enter your email to receive a new confirmation email."}
          </p>
        </div>

        {/* Info or Confirmation banner */}
        {infoMessage ? (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{infoMessage}</span>
            </div>
          </div>
        ) : null}

        {/* SMTP Troubleshooting Alert */}
        {smtpError ? (
          <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs leading-relaxed text-destructive">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold">SMTP Delivery Issue</p>
                <p className="mt-1 opacity-90">{smtpError}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Password
                </span>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="sheen w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-all disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Work Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Confirm Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="sheen w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-all disabled:opacity-50"
            >
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Account Email
              </span>
              <div className="relative mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-primary"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="sheen w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-all disabled:opacity-50"
            >
              {busy ? "Sending link…" : "Send password reset link"}
            </button>
          </form>
        )}

        {/* RESEND CONFIRMATION FORM */}
        {mode === "resend" && (
          <form onSubmit={handleResend} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Email address
              </span>
              <div className="relative mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-primary"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="sheen w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lift transition-all disabled:opacity-50"
            >
              {busy ? "Sending…" : "Resend confirmation email"}
            </button>
          </form>
        )}

        {/* BOTTOM NAVIGATION LINKS */}
        <div className="mt-6 space-y-2.5 text-center text-xs">
          {mode === "signin" && (
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-primary hover:underline"
            >
              Need an account? Sign up
            </button>
          )}

          {mode === "signup" && (
            <>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="block w-full font-semibold text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode("resend")}
                className="block w-full text-muted-foreground hover:text-primary"
              >
                Didn't receive confirmation email? Resend
              </button>
            </>
          )}

          {(mode === "forgot" || mode === "resend") && (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </button>
          )}

          <Link
            to="/"
            className="mt-4 block font-semibold text-muted-foreground hover:text-primary"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
