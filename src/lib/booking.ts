/** Consultation scheduling helpers: pure date math, no side effects. */

export const TIME_SLOTS = [
  "09:00",
  "09:45",
  "10:30",
  "11:15",
  "13:00",
  "13:45",
  "14:30",
  "15:15",
  "16:00",
  "16:45",
] as const;

export const SLOT_DURATION_MINUTES = 15;

export const CONSULT_TOPICS = [
  "Inbound call support",
  "Outbound calling",
  "Live chat support",
  "Email support",
  "Lead generation",
  "Appointment setting",
  "Technical support",
  "Back-office / data entry",
  "Not sure yet (advise me)",
] as const;

export const TEAM_SIZES = ["1–5", "6–20", "21–50", "50+"] as const;

export const TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Singapore",
  "Australia/Sydney",
] as const;

/** yyyy-mm-dd in local time (no UTC shift). */
export function toDateKey(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * A 6-row Monday-first grid for the given month, padded with the
 * neighbouring months so the calendar never reflows between months.
 */
export function monthGrid(month: Date): { date: Date; inMonth: boolean }[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }).map((_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date, inMonth: date.getMonth() === month.getMonth() };
  });
}

/** Past days closed, and no more than 60 days out. */
export function isBookableDay(date: Date, today = startOfDay(new Date())) {
  const d = startOfDay(date);
  if (d < today) return false;
  const limit = new Date(today);
  limit.setDate(limit.getDate() + 60);
  return d <= limit;
}

export function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = (h ?? 0) >= 12 ? "PM" : "AM";
  const hour12 = (h ?? 0) % 12 === 0 ? 12 : (h ?? 0) % 12;
  return `${hour12}:${`${m ?? 0}`.padStart(2, "0")} ${suffix}`;
}

export function slotEndLabel(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const end = new Date(2000, 0, 1, h ?? 0, (m ?? 0) + SLOT_DURATION_MINUTES);
  return formatSlot(
    `${`${end.getHours()}`.padStart(2, "0")}:${`${end.getMinutes()}`.padStart(2, "0")}`,
  );
}

/** Slot has already passed for today. */
export function isSlotPast(dateKey: string, slot: string, now = new Date()) {
  if (dateKey !== toDateKey(now)) return false;
  const [h, m] = slot.split(":").map(Number);
  const slotDate = new Date(now);
  slotDate.setHours(h ?? 0, m ?? 0, 0, 0);
  return slotDate.getTime() <= now.getTime();
}

export function guessTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
