/**
 * Small visual metaphor for each service, shown next to the rotary dial.
 * Composed from thin line-work + a single icon so it reads as part of the
 * editorial composition rather than a generic icon tile.
 */
import {
  BarChart3,
  CalendarCheck,
  Headphones,
  Mail,
  MessageCircle,
  MonitorCheck,
  PhoneCall,
  PhoneOutgoing,
  Send,
  Share2,
  UserCheck,
} from "lucide-react";
import type { ServiceSlug } from "@/lib/services";

const ICONS: Record<ServiceSlug, typeof PhoneCall> = {
  "inbound-call-support": PhoneCall,
  "outbound-calling": PhoneOutgoing,
  "live-chat-support": MessageCircle,
  "email-support": Mail,
  "customer-service": Headphones,
  "lead-generation": UserCheck,
  "appointment-setting": CalendarCheck,
  "sales-outreach": Send,
  "technical-support": MonitorCheck,
  "custom-solutions": Share2,
};

const CAPTIONS: Record<ServiceSlug, string> = {
  "inbound-call-support": "Incoming line · picked up",
  "outbound-calling": "Outgoing line · connected",
  "live-chat-support": "Conversation · live",
  "email-support": "Inbox · at zero",
  "customer-service": "Customer · agent paired",
  "lead-generation": "Contact · qualified",
  "appointment-setting": "Calendar · confirmed",
  "sales-outreach": "Sequence · in flight",
  "technical-support": "Diagnostics · resolved",
  "custom-solutions": "Channels · unified",
};

export function ServiceMetaphor({ slug }: { slug: ServiceSlug }) {
  const Icon = ICONS[slug] ?? PhoneCall;

  return (
    <div key={slug} className="animate-fade-in flex items-center gap-4">
      <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary-foreground/12 bg-primary-foreground/[0.06] text-signal">
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-signal/10 blur-md"
        />
        <Icon className="relative h-6 w-6" />
      </span>

      <div className="min-w-0">
        <div aria-hidden className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="signal-bar block w-1 rounded-full bg-signal/70"
              style={{
                height: 6 + ((i * 7) % 16),
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
          <BarChart3 className="ml-1 h-3.5 w-3.5 text-primary-foreground/30" />
        </div>
        <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/45">
          {CAPTIONS[slug]}
        </p>
      </div>
    </div>
  );
}
