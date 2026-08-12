import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { addBooking } from "@/lib/local-leads";
import { toast } from "sonner";


export const Route = createFileRoute("/consult")({
  component: ConsultExpertPage,
});

function ConsultExpertPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [step, setStep] = useState(1);


  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const slots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  const handleComplete = () => {
    addBooking({
      name: form.name,
      email: form.email,
      date: selectedDate.toISOString(),
      timeSlot: timeSlot!,
    });
    toast.success("Consultation booked! Check your email.");
    setStep(3);
  };

  if (step === 3) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-5 py-32 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-8">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-4xl font-semibold">Session Confirmed</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            We've sent a calendar invite to <span className="text-primary font-semibold">{form.email}</span>.
          </p>
          <button 
            onClick={() => navigate({ to: "/" })}
            className="mt-12 rounded-full border border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-secondary transition-colors"
          >
            Back to Home
          </button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h1 className="font-display text-4xl font-semibold">Consult an Expert</h1>
            <p className="mt-4 text-muted-foreground">
              Book a 15-minute strategy session to map your customer experience journey.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-navy flex items-center justify-center text-white font-display text-lg font-bold">AJ</div>
                <div>
                  <p className="font-semibold text-primary text-sm">Ahmed Jalal</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">CX Strategy Expert</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft relative overflow-hidden">
              <div aria-hidden className="absolute inset-0 grid-blueprint opacity-10" />
              <div className="relative">
                {step === 1 ? (
                  <>
                    <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">1</span>
                      Select Date & Time
                    </h3>
                    <div className="mt-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {days.map((d) => (
                        <button
                          key={d.toISOString()}
                          onClick={() => setSelectedDate(d)}
                          className={`flex flex-col items-center min-w-[70px] rounded-2xl border p-4 transition-all ${
                            selectedDate.toDateString() === d.toDateString()
                              ? "border-primary bg-primary text-primary-foreground shadow-lift"
                              : "border-border hover:border-primary/50 bg-background"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="mt-1 font-display text-xl font-bold">
                            {d.getDate()}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setTimeSlot(s)}
                          className={`rounded-xl border p-4 text-sm font-semibold transition-all ${
                            timeSlot === s
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border hover:border-primary/50 bg-background"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      disabled={!timeSlot}
                      onClick={() => setStep(2)}
                      className="mt-10 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50 shadow-lift transition-transform hover:-translate-y-0.5"
                    >
                      Next: Your Details
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setStep(1)} className="text-xs font-semibold text-primary flex items-center gap-1 mb-6 hover:underline">
                      <ChevronLeft className="h-3 w-3" /> Back to calendar
                    </button>
                    <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">2</span>
                      Your Details
                    </h3>
                    
                    <div className="mt-8 space-y-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Jane Doe"
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="jane@company.com"
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-8 p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground leading-relaxed">
                      Consultation for <span className="font-semibold text-primary">{selectedDate.toLocaleDateString()}</span> at <span className="font-semibold text-primary">{timeSlot}</span>.
                    </div>

                    <button
                      disabled={!form.name || !form.email}
                      onClick={handleComplete}
                      className="mt-8 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50 shadow-lift transition-transform hover:-translate-y-0.5"
                    >
                      Book My Session
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

