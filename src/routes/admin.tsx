import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  STAGES,
  type Lead,
  type Stage,
  getLeads,
  isSignedIn,
  signOutDemo,
  stageLabel,
  updateLeadStage,
  getBookings,
  type Booking,
} from "@/lib/local-leads";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Lead Pipeline — NorthlineCX Admin" },
      {
        name: "description",
        content:
          "Internal pipeline for NorthlineCX quote requests, from new lead through to won or lost.",
      },
      { property: "og:title", content: "Lead Pipeline — NorthlineCX Admin" },
      {
        property: "og:description",
        content: "Internal lead pipeline for incoming quote requests.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"leads" | "bookings">("leads");
  const [filter, setFilter] = useState<Stage | "all">("all");

  useEffect(() => {
    if (!isSignedIn()) {
      navigate({ to: "/auth" });
      return;
    }
    setLeads(getLeads());
    setBookings(getBookings());
    setReady(true);
  }, [navigate]);

  const changeStage = (id: string, stage: Stage) => {
    updateLeadStage(id, stage);
    setLeads(getLeads());
    toast.success("Stage updated");
  };

  const visible = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <header className="surface-navy">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
              NorthlineCX
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">Lead desk</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-semibold text-primary-foreground/70 hover:text-primary-foreground"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => {
                signOutDemo();
                navigate({ to: "/auth" });
              }}
              className="rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-8 flex border-b border-border">
          <button
            onClick={() => setTab("leads")}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              tab === "leads" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
          >
            Leads Pipeline
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
              tab === "bookings" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
          >
            Consultations · {bookings.length}
          </button>
        </div>

        {tab === "leads" ? (
          <>
            <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
          Demo mode — leads are stored in this browser only, until the backend is
          connected.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              filter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            All · {leads.length}
          </button>
          {STAGES.map((s) => {
            const count = leads.filter((l) => l.stage === s.value).length;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilter(s.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  filter === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {s.label} · {count}
              </button>
            );
          })}
        </div>

            <div className="mt-8 grid gap-4">
              {visible.length === 0 ? (
                <p className="mt-10 text-sm text-muted-foreground">
                  No leads in this stage yet.
                </p>
              ) : (
                visible.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="font-display text-lg font-semibold">
                            {lead.company}
                          </h2>
                          <span className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] shadow-sm ${
                            lead.stage === 'won' ? 'bg-green-100 text-green-700' :
                            lead.stage === 'lost' ? 'bg-red-100 text-red-700' :
                            lead.stage === 'new_lead' ? 'bg-blue-100 text-blue-700' :
                            'bg-secondary text-primary'
                          }`}>
                            {stageLabel(lead.stage)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {lead.name} · {lead.email} · {lead.phone}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {lead.operation_size} ·{" "}
                          {new Date(lead.created_at).toLocaleString()}
                        </p>
                      </div>

                      <label className="text-xs font-semibold text-muted-foreground">
                        Stage
                        <select
                          value={lead.stage}
                          onChange={(e) => changeStage(lead.id, e.target.value as Stage)}
                          className="mt-1.5 block rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary"
                        >
                          {STAGES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {lead.services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {lead.message ? (
                      <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/85">
                        {lead.message}
                      </p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="grid gap-4">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No consultations booked yet.</p>
            ) : (
              bookings.map((b) => (
                <article key={b.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-semibold">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{new Date(b.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{b.timeSlot}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
