/**
 * Temporary browser-storage lead store + dummy auth.
 * Swap for a real backend later — the API shape stays the same.
 */

export const STAGES = [
  { value: "new_lead", label: "New lead" },
  { value: "qualification", label: "Qualification" },
  { value: "sales_contacted", label: "Sales contacted" },
  { value: "consultation_booked", label: "Consultation booked" },
  { value: "discovery_completed", label: "Discovery completed" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export type Stage = (typeof STAGES)[number]["value"];

export type Lead = {
  id: string;
  created_at: string;
  stage: Stage;
  services: string[];
  operation_size: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string | null;
};

export const stageLabel = (s: Stage) =>
  STAGES.find((x) => x.value === s)?.label ?? s;

const LEADS_KEY = "northlinecx.leads";
const SESSION_KEY = "northlinecx.session";

/** Demo credentials while there is no backend. */
export const DEMO_CREDENTIALS = {
  email: "admin@northlinecx.com",
  password: "northline",
};

function read(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEADS_KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function write(leads: Lead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function getLeads(): Lead[] {
  return read().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function addLead(
  input: Omit<Lead, "id" | "created_at" | "stage">,
): Lead {
  const lead: Lead = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    created_at: new Date().toISOString(),
    stage: "new_lead",
  };
  write([lead, ...read()]);
  return lead;
}

export function updateLeadStage(id: string, stage: Stage) {
  write(read().map((l) => (l.id === id ? { ...l, stage } : l)));
}

export function deleteLead(id: string) {
  write(read().filter((l) => l.id !== id));
}

/* ---------- dummy auth ---------- */

export function signInDemo(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
  }
  return ok;
}

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(SESSION_KEY));
}

export function signOutDemo() {
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}
