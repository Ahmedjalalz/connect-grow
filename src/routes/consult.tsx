import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  CONSULT_TOPICS,
  SLOT_DURATION_MINUTES,
  TEAM_SIZES,
  TIMEZONES,
  TIME_SLOTS,
  addMonths,
  formatSlot,
  guessTimezone,
  isBookableDay,
  isSlotPast,
  monthGrid,
  monthLabel,
  slotEndLabel,
  startOfDay,
  toDateKey,
  WEEKDAY_LABELS,
} from "@/lib/booking";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "Book a CX Consultation — Free 15-Min Call | KyteLine" },
      {
        name: "description",
        content:
          "Pick a date and time slot to speak with a KyteLine call center strategy expert. Get a roadmap for inbound support, outbound calling and CX outsourcing.",
      },
      { property: "og:title", content: "Book a CX Consultation — KyteLine" },
      {
        property: "og:description",
        content:
          "Choose a slot and talk to a call center outsourcing expert. 15 minutes, no commitment.",
      },
      { property: "og:url", content: "https://www.kyteline.com/consult" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.kyteline.com/KyteLine.png" },
      { property: "og:image:secure_url", content: "https://www.kyteline.com/KyteLine.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "500" },
      { property: "og:image:height", content: "500" },
      { property: "og:image:alt", content: "Book a CX Consultation with KyteLine" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Book a CX Consultation — KyteLine" },
      {
        name: "twitter:description",
        content:
          "Pick a date and time slot to speak with a KyteLine call center strategy expert. 15 minutes, no commitment.",
      },
      { name: "twitter:image", content: "https://www.kyteline.com/KyteLine.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.kyteline.com/consult" },
      { rel: "image_src", href: "https://www.kyteline.com/KyteLine.png" },
    ],
  }),
  component: ConsultExpertPage,
});

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(1000).optional(),
});

function ConsultExpertPage() {
  const navigate = useNavigate();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    topic: CONSULT_TOPICS[0] as string,
    team_size: TEAM_SIZES[0] as string,
    timezone: "UTC",
    notes: "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, timezone: guessTimezone() }));
  }, []);

  const grid = useMemo(() => monthGrid(month), [month]);

  // Load taken slots for the visible month so booked times are greyed out.
  useEffect(() => {
    let active = true;
    const from = toDateKey(grid[0]!.date);
    const to = toDateKey(grid[grid.length - 1]!.date);
    supabase
      .rpc("taken_slots", { _from: from, _to: to })
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setTaken(new Set(data.map((r) => `${r.slot_date}|${r.slot_time}`)));
      });
    return () => {
      active = false;
    };
  }, [grid]);

  const selectedDate = dateKey ? new Date(`${dateKey}T00:00:00`) : null;

  const slotState = (s: string) => {
    if (!dateKey) return "closed" as const;
    if (taken.has(`${dateKey}|${s}`)) return "taken" as const;
    if (isSlotPast(dateKey, s)) return "past" as const;
    return "open" as const;
  };

  const openSlots = dateKey
    ? TIME_SLOTS.filter((s) => slotState(s) === "open").length
    : 0;

  const submit = async () => {
    const parsed = detailsSchema.safeParse(form);
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
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      phone: parsed.data.phone || null,
      topic: form.topic,
      team_size: form.team_size,
      timezone: form.timezone,
      notes: parsed.data.notes || null,
      slot_date: dateKey!,
      slot_time: slot!,
      duration_minutes: SLOT_DURATION_MINUTES,
    });
    setSaving(false);
    if (error) {
      if (error.code === "23505" || error.code === "23514" || error.code === "23000") {
        toast.error("That slot was just taken. Please pick another time.");
      } else if (error.code === "23505" || error.message.includes("duplicate")) {
        toast.error("That slot was just taken. Please pick another time.");
      } else {
        toast.error("We couldn't confirm that slot. Please try again.");
      }
      return;
    }
    setTaken((prev) => new Set(prev).add(`${dateKey}|${slot}`));
    setStep(3);
  };

  if (step === 3 && selectedDate && slot) {
    return (
      <SiteLayout>
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 grid-blueprint opacity-50" />
          <div className="relative mx-auto max-w-2xl px-5 py-24 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl surface-navy">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-7 font-display text-4xl font-semibold">
              Your session is booked
            </h1>
            <p className="mt-3 text-muted-foreground">
              A calendar invite is on its way to{" "}
              <span className="font-semibold text-primary">{form.email}</span>.
            </p>

            <div className="mt-10 rounded-3xl border border-border bg-card p-7 text-left shadow-soft">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Date"
                  value={selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <Detail
                  icon={<Clock className="h-4 w-4" />}
                  label="Time"
                  value={`${formatSlot(slot)} – ${slotEndLabel(slot)} (${SLOT_DURATION_MINUTES} min)`}
                />
                <Detail
                  icon={<Globe2 className="h-4 w-4" />}
                  label="Timezone"
                  value={form.timezone}
                />
                <Detail
                  icon={<Video className="h-4 w-4" />}
                  label="Format"
                  value="Video call — link in the invite"
                />
              </dl>
              <p className="mt-6 rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                Topic: <span className="font-semibold text-primary">{form.topic}</span>{" "}
                · Operation size{" "}
                <span className="font-semibold text-primary">{form.team_size}</span>
              </p>
            </div>

            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-10 rounded-full border border-primary/25 px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
            >
              Back to home
            </button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 grid-blueprint opacity-50" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            {/* left rail */}
            <aside>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
                Consult an expert
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                A 15-minute call that maps your CX
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Bring your volumes, channels and pain points. You leave with a
                staffing shape, a coverage plan and a realistic cost band.
              </p>

              <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full surface-navy font-display text-lg font-bold">
                    AH
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Alexander Hayes</p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      CX strategy expert
                    </p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {[
                    `${SLOT_DURATION_MINUTES} minutes, video or phone`,
                    "No commitment, no sales maze",
                    "Slots update live",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedDate ? (
                <div className="mt-6 rounded-3xl border border-border bg-secondary/60 p-5 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Your selection
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-primary">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                    {slot ? ` · ${formatSlot(slot)}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {slot
                      ? `${formatSlot(slot)} – ${slotEndLabel(slot)} · ${form.timezone}`
                      : `${openSlots} slot${openSlots === 1 ? "" : "s"} available`}
                  </p>
                </div>
              ) : null}
            </aside>

            {/* scheduler */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-9">
              <div className="mb-8 flex items-center gap-3">
                {[1, 2].map((n) => (
                  <div key={n} className="flex flex-1 items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        n <= step
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {n < step ? <Check className="h-4 w-4" /> : n}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {n === 1 ? "Date & time" : "Your details"}
                    </span>
                    {n === 1 ? (
                      <span
                        className={`h-px flex-1 ${step > 1 ? "bg-primary" : "bg-border"}`}
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              {step === 1 ? (
                <div className="grid gap-8 md:grid-cols-[1.25fr_1fr]">
                  {/* calendar */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-lg font-semibold">
                        {monthLabel(month)}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="Previous month"
                          onClick={() => setMonth(addMonths(month, -1))}
                          disabled={
                            month <= new Date(today.getFullYear(), today.getMonth(), 1)
                          }
                          className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-secondary disabled:opacity-35"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next month"
                          onClick={() => setMonth(addMonths(month, 1))}
                          className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-secondary"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-7 gap-1 text-center">
                      {WEEKDAY_LABELS.map((d) => (
                        <span
                          key={d}
                          className="pb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                        >
                          {d}
                        </span>
                      ))}
                      {grid.map(({ date, inMonth }) => {
                        const key = toDateKey(date);
                        const bookable = isBookableDay(date, today);
                        const selected = key === dateKey;
                        const isToday = key === toDateKey(new Date());
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={!bookable}
                            onClick={() => {
                              setDateKey(key);
                              setSlot(null);
                            }}
                            className={`relative aspect-square rounded-xl border text-sm font-semibold transition-all ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground shadow-lift"
                                : bookable
                                  ? "border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-primary/50"
                                  : "border-transparent text-muted-foreground/45"
                            } ${inMonth ? "" : "opacity-45"}`}
                          >
                            {date.getDate()}
                            {isToday && !selected ? (
                              <span className="absolute inset-x-0 bottom-1.5 mx-auto h-1 w-1 rounded-full bg-primary" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      All times shown in{" "}
                      <span className="font-semibold text-primary">{form.timezone}</span>.
                    </p>
                  </div>

                  {/* slots */}
                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <h3 className="font-display text-base font-semibold">
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })
                        : "Pick a day"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedDate
                        ? `${openSlots} of ${TIME_SLOTS.length} slots free · ${SLOT_DURATION_MINUTES} min each`
                        : "Available times will appear here."}
                    </p>

                    <div className="mt-5 grid max-h-[22rem] gap-2 overflow-y-auto pr-1">
                      {TIME_SLOTS.map((s) => {
                        const state = slotState(s);
                        const active = slot === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={state !== "open"}
                            onClick={() => setSlot(s)}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : state === "open"
                                  ? "border-border bg-card hover:border-primary/50"
                                  : "border-dashed border-border bg-transparent text-muted-foreground/60"
                            }`}
                          >
                            <span>{formatSlot(s)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                              {state === "taken"
                                ? "Booked"
                                : state === "past"
                                  ? "Passed"
                                  : state === "closed"
                                    ? ""
                                    : slotEndLabel(s)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={!dateKey || !slot}
                      onClick={() => setStep(2)}
                      className="sheen mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-45 disabled:hover:translate-y-0"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mb-6 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <ChevronLeft className="h-3 w-3" /> Change date or time
                  </button>

                  <h2 className="font-display text-xl font-semibold">
                    Where should we send the invite?
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    · {slot ? `${formatSlot(slot)} – ${slotEndLabel(slot)}` : ""}
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      value={form.name}
                      error={errors["name"]}
                      onChange={(v) => setForm({ ...form, name: v })}
                      placeholder="Jane Doe"
                    />
                    <Field
                      label="Work email"
                      type="email"
                      value={form.email}
                      error={errors["email"]}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="jane@company.com"
                    />
                    <Field
                      label="Company"
                      value={form.company}
                      error={errors["company"]}
                      onChange={(v) => setForm({ ...form, company: v })}
                      placeholder="Company Ltd."
                    />
                    <Field
                      label="Phone"
                      type="tel"
                      value={form.phone}
                      error={errors["phone"]}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      placeholder="+1 555 000 1234"
                    />
                    <Select
                      label="What's the call about?"
                      value={form.topic}
                      options={[...CONSULT_TOPICS]}
                      onChange={(v) => setForm({ ...form, topic: v })}
                    />
                    <Select
                      label="Operation size"
                      value={form.team_size}
                      options={[...TEAM_SIZES]}
                      onChange={(v) => setForm({ ...form, team_size: v })}
                    />
                    <Select
                      label="Timezone"
                      value={form.timezone}
                      options={Array.from(
                        new Set([form.timezone, ...TIMEZONES]),
                      )}
                      onChange={(v) => setForm({ ...form, timezone: v })}
                    />
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Anything we should prepare? (optional)
                      </span>
                      <textarea
                        rows={4}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Monthly volumes, channels, current tooling…"
                        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={submit}
                    className="sheen mt-8 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {saving ? "Confirming…" : "Confirm my session"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-primary">{value}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${
          error ? "border-destructive" : "border-input"
        }`}
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
