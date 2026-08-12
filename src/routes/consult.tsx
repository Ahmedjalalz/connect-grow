import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/consult")({
  component: ConsultExpertPage,
});

function ConsultExpertPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const slots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="font-display text-4xl font-semibold">Consult an Expert</h1>
        <p className="mt-4 text-muted-foreground">
          Choose a time that works for you. We'll send a calendar invite.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold">Select Date</h3>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center rounded-xl border p-3 ${
                  selectedDate.toDateString() === d.toDateString()
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-xs uppercase opacity-70">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="mt-1 font-semibold text-lg">
                  {d.getDate()}
                </span>
              </button>
            ))}
          </div>

          <h3 className="mt-8 font-display text-lg font-semibold">Select Time</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => setTimeSlot(s)}
                className={`rounded-xl border p-3 text-sm font-semibold ${
                  timeSlot === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!timeSlot}
          className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          Confirm Consultation
        </button>
      </div>
    </SiteLayout>
  );
}
