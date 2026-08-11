import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Stage = Database["public"]["Enums"]["lead_stage"];
type Lead = Database["public"]["Tables"]["leads"]["Row"];

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

const STAGES: { value: Stage; label: string }[] = [
  { value: "new_lead", label: "New lead" },
  { value: "qualification", label: "Qualification" },
  { value: "sales_contacted", label: "Sales contacted" },
  { value: "consultation_booked", label: "Consultation booked" },
  { value: "discovery_completed", label: "Discovery completed" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const stageLabel = (s: Stage) => STAGES.find((x) => x.value === s)?.label ?? s;

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Stage | "all">("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    enabled: ready,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: Stage }) => {
      const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Stage updated");
    },
    onError: () => toast.error("Could not update this lead."),
  });

  const leads = leadsQuery.data ?? [];
  const visible = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

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
              onClick={async () => {
                await supabase.auth.signOut();
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
        {/* pipeline counts */}
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

        {leadsQuery.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading leads…</p>
        ) : leadsQuery.isError ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-lg font-semibold">No access</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This account isn't an admin yet, so leads stay hidden. Ask an
              existing admin to grant the admin role to your user.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No leads in this stage yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {visible.map((lead) => (
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
                      <span className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">
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
                        updateStage.mutate({
                          id: lead.id,
                          stage: e.target.value as Stage,
                        })
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
