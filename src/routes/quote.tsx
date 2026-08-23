import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { addLead } from "@/lib/local-leads";
import { OPERATION_SIZES, QUOTE_SERVICE_OPTIONS } from "@/lib/services";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Quote — Outsourced CX Pricing in 3 Steps | KyteLine" },
      {
        name: "description",
        content:
          "Tell us which support lines you need, how large your operation is, and where to reach you. We reply with a scoped quote within one business day.",
      },
      { property: "og:title", content: "Get a Quote — KyteLine" },
      {
        property: "og:description",
        content:
          "A three-step quote request: pick your services, tell us your team size, leave your details.",
      },
    ],
  }),
  component: QuotePage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  company: z.string().trim().min(2, "Please enter your company").max(120),
  phone: z.string().trim().min(6, "Enter a reachable phone number").max(40),
  message: z.string().trim().max(1000).optional(),
});

function QuotePage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [size, setSize] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const toggleService = (value: string) =>
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );

  const submit = async () => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      addLead({
        services,
        operation_size: size,
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        phone: parsed.data.phone,
        message: parsed.data.message?.length ? parsed.data.message : null,
      });
    } catch {
      setSubmitting(false);
      toast.error("We couldn't save that. Please try again.");
      return;
    }
    setSubmitting(false);
    setDone(true);
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 grid-blueprint opacity-60" />
        <div className="relative mx-auto w-full max-w-3xl px-5 py-16 md:py-20">
          {done ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl surface-navy">
                <PartyPopper className="h-5 w-5" />
              </span>
              <h1 className="mt-6 font-display text-3xl font-semibold">
                Request received
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                A team lead will reply within one business day with a scoped
                quote and a suggested pod shape.
              </p>
              <Link
                to="/services"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/25 px-6 py-3 text-sm font-semibold text-primary"
              >
                Browse services
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
                Get a quote
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                Three steps. About 40 seconds.
              </h1>

              {/* progress */}
              <div className="mt-8 flex items-center gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-1 items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        n < step
                          ? "bg-primary text-primary-foreground"
                          : n === step
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {n < step ? <Check className="h-4 w-4" /> : n}
                    </span>
                    {n < 3 ? (
                      <span
                        className={`h-px flex-1 ${n < step ? "bg-primary" : "bg-border"}`}
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-9">
                {step === 1 ? (
                  <div className="rise-in">
                    <h2 className="font-display text-xl font-semibold">
                      What can we help with?
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select one or as many as you like.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {QUOTE_SERVICE_OPTIONS.map((option) => {
                        const active = services.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleService(option)}
                            aria-pressed={active}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-primary/35"
                            }`}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : null}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="rise-in">
                    <h2 className="font-display text-xl font-semibold">
                      How large is your operation?
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      A rough number is fine.
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {OPERATION_SIZES.map((option) => {
                        const active = size === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSize(option)}
                            aria-pressed={active}
                            className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition-all ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:border-primary/35"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="rise-in">
                    <h2 className="font-display text-xl font-semibold">
                      Tell us where to reach you.
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Four fields, then you're done.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {(
                        [
                          { key: "name", label: "Name", type: "text" },
                          { key: "email", label: "Work email", type: "email" },
                          { key: "company", label: "Company", type: "text" },
                          { key: "phone", label: "Phone", type: "tel" },
                        ] as const
                      ).map((field) => (
                        <label key={field.key} className="block">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {field.label}
                          </span>
                          <input
                            type={field.type}
                            value={form[field.key]}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, [field.key]: e.target.value }))
                            }
                            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                          />
                          {errors[field.key] ? (
                            <span className="mt-1.5 block text-xs text-destructive">
                              {errors[field.key]}
                            </span>
                          ) : null}
                        </label>
                      ))}
                      <label className="block sm:col-span-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Short message / requirements{" "}
                          <span className="normal-case tracking-normal">(optional)</span>
                        </span>
                        <textarea
                          rows={4}
                          maxLength={1000}
                          value={form.message}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, message: e.target.value }))
                          }
                          className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}

                {/* nav */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-opacity disabled:opacity-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={
                        (step === 1 && services.length === 0) ||
                        (step === 2 && !size)
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : "Send request"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
