import type { Database } from "@/integrations/supabase/types";

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

export type Stage = Database["public"]["Enums"]["lead_stage"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingStatus = Database["public"]["Enums"]["booking_status"];

export const stageLabel = (s: Stage) =>
  STAGES.find((x) => x.value === s)?.label ?? s;

/** Stage-specific badge colours, kept inside the navy/ivory palette. */
export const stageBadge: Record<Stage, string> = {
  new_lead: "bg-sky-100 text-sky-800 border-sky-200",
  qualification: "bg-indigo-100 text-indigo-800 border-indigo-200",
  sales_contacted: "bg-violet-100 text-violet-800 border-violet-200",
  consultation_booked: "bg-cyan-100 text-cyan-800 border-cyan-200",
  discovery_completed: "bg-teal-100 text-teal-800 border-teal-200",
  proposal_sent: "bg-amber-100 text-amber-900 border-amber-200",
  negotiation: "bg-orange-100 text-orange-900 border-orange-200",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-rose-100 text-rose-800 border-rose-200",
};

export const bookingStatusBadge: Record<BookingStatus, string> = {
  requested: "bg-sky-100 text-sky-800 border-sky-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-secondary text-primary border-border",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export const BOOKING_STATUSES: BookingStatus[] = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
];
