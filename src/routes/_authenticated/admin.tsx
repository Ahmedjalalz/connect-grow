import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import {
  BOOKING_STATUSES,
  STAGES,
  bookingStatusBadge,
  stageBadge,
  stageLabel,
  type Booking,
  type BookingStatus,
  type Lead,
  type Stage,
} from "@/lib/pipeline";
import { formatSlot, slotEndLabel } from "@/lib/booking";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Lead Pipeline — KyteLine Admin" },
      {
        name: "description",
        content:
          "Internal pipeline for KyteLine quote requests, from new lead through to won or lost.",
      },
      { property: "og:title", content: "Lead Pipeline — KyteLine Admin" },
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"leads" | "bookings">("leads");
  const [filter, setFilter] = useState<Stage | "all">("all");

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      navigate({ to: "/auth" });
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    const admin = Boolean(roles?.some((r) => r.role === "admin"));
    setIsAdmin(admin);

    if (admin) {
      const [leadsRes, bookingsRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase
          .from("bookings")
          .select("*")
          .order("slot_date", { ascending: true })
          .order("slot_time", { ascending: true }),
      ]);
      if (leadsRes.error || bookingsRes.error) {
        toast.error("Couldn't load the pipeline.");
      }
      setLeads(leadsRes.data ?? []);
      setBookings(bookingsRes.data ?? []);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeStage = async (id: string, stage: Stage) => {
    const previous = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
    if (error) {
      setLeads(previous);
      toast.error("Couldn't update the stage.");
      return;
    }
    toast.success("Stage updated");
  };

  const changeBookingStatus = async (id: string, status: BookingStatus) => {
    const previous = bookings;
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      setBookings(previous);
      toast.error("Couldn't update the booking.");
      return;
    }
    toast.success("Booking updated");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const visible = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

  return (
    <div className="min-h-screen">
      <header className="surface-navy">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div className="flex items-center gap-3.5">
            <Logo variant="dark" size="sm" />
            <h1 className="border-l border-primary-foreground/20 pl-3 font-display text-xl font-semibold">
              Lead desk
            </h1>
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
              onClick={signOut}
              className="rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading pipeline…</p>
        ) : !isAdmin ? (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <h2 className="font-display text-xl font-semibold">No desk access</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is signed in but doesn't have admin access yet. Ask an
              existing admin to grant your account the admin role.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex border-b border-border">
              <button
                onClick={() => setTab("leads")}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  tab === "leads"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Leads pipeline · {leads.length}
              </button>
              <button
                onClick={() => setTab("bookings")}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  tab === "bookings"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Consultations · {bookings.length}
              </button>
            </div>

            {tab === "leads" ? (
              <>
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
                            : `${stageBadge[s.value]}`
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
                              <span
                                className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${stageBadge[lead.stage]}`}
                              >
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
                              onChange={(e) =>
                                void changeStage(lead.id, e.target.value as Stage)
                              }
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
                  <p className="text-sm text-muted-foreground">
                    No consultations booked yet.
                  </p>
                ) : (
                  bookings.map((b) => (
                    <article
                      key={b.id}
                      className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-lg font-semibold">
                              {b.name}
                            </h3>
                            <span
                              className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${bookingStatusBadge[b.status]}`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm text-muted-foreground">
                            {b.email}
                            {b.phone ? ` · ${b.phone}` : ""}
                            {b.company ? ` · ${b.company}` : ""}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {b.topic ?? "General"} · {b.team_size ?? "—"} ·{" "}
                            {b.timezone ?? "UTC"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-semibold text-primary">
                            {new Date(`${b.slot_date}T00:00:00`).toLocaleDateString(
                              "en-US",
                              { weekday: "short", day: "numeric", month: "short" },
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatSlot(b.slot_time)} – {slotEndLabel(b.slot_time)}
                          </p>
                          <select
                            value={b.status}
                            onChange={(e) =>
                              void changeBookingStatus(
                                b.id,
                                e.target.value as BookingStatus,
                              )
                            }
                            className="mt-2 rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                          >
                            {BOOKING_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {b.notes ? (
                        <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/85">
                          {b.notes}
                        </p>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
