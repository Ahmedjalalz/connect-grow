export type ServiceSlug =
  | "inbound-call-support"
  | "outbound-calling"
  | "live-chat-support"
  | "email-support"
  | "customer-service"
  | "lead-generation"
  | "appointment-setting"
  | "sales-outreach"
  | "technical-support"
  | "custom-solutions";

export type DeviceShape =
  | "handset"
  | "dialpad"
  | "chat"
  | "envelope"
  | "headset"
  | "radar"
  | "calendar"
  | "target"
  | "terminal"
  | "drawer"
  | "blueprint";

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  blurb: string;
  device: DeviceShape;
  metric: { value: string; label: string };
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "inbound-call-support",
    name: "Inbound Call Support",
    short: "Every ring answered, on brand.",
    blurb:
      "Trained agents pick up in seconds, follow your scripts and escalation paths, and log every call in your CRM, giving you 24/7 coverage without a hiring cycle.",
    device: "handset",
    metric: { value: "< 20s", label: "avg. answer time" },
    bullets: [
      "24/7/365 or overflow-only coverage",
      "Scripted triage with live escalation paths",
      "Call recording, tagging and CRM logging",
    ],
  },
  {
    slug: "outbound-calling",
    name: "Outbound Calling",
    short: "Dial with intent, not volume.",
    blurb:
      "Campaign-ready dialers, tested openers and disciplined follow-up cadences that turn cold lists into calendars full of real conversations.",
    device: "dialpad",
    metric: { value: "3.2x", label: "more connects" },
    bullets: [
      "List hygiene and DNC compliance",
      "A/B tested openers and objection paths",
      "Daily campaign dashboards",
    ],
  },
  {
    slug: "live-chat-support",
    name: "Live Chat Support",
    short: "Answers before they bounce.",
    blurb:
      "Human agents handle live chat across your website, app, or WhatsApp with concurrent conversations, sub-minute first replies, and seamless context handoffs.",
    device: "chat",
    metric: { value: "48s", label: "first reply" },
    bullets: [
      "Web, in-app and WhatsApp channels",
      "Macros tuned to your product",
      "Chat-to-ticket and chat-to-lead routing",
    ],
  },
  {
    slug: "email-support",
    name: "Email Support",
    short: "An inbox that never backs up.",
    blurb:
      "Queue ownership, SLA discipline and reply quality reviews so your support inbox stays at zero and your tone of voice stays yours.",
    device: "envelope",
    metric: { value: "99%", label: "SLA adherence" },
    bullets: [
      "Tiered queues with priority rules",
      "Templates written in your voice",
      "Weekly quality scoring",
    ],
  },
  {
    slug: "customer-service",
    name: "Customer Service",
    short: "One team, every channel.",
    blurb:
      "A blended CX pod that owns phone, chat, email, and social across your accounts, backed by clear reporting your leadership can actually use.",
    device: "headset",
    metric: { value: "4.8/5", label: "CSAT" },
    bullets: [
      "Omnichannel pods with a named lead",
      "CSAT, NPS and QA reporting",
      "Peak-season surge capacity",
    ],
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    short: "Pipeline, researched and warmed.",
    blurb:
      "ICP research, verified data and multi-touch outreach that hands your closers qualified conversations instead of raw lists.",
    device: "radar",
    metric: { value: "100%", label: "verified contacts" },
    bullets: [
      "ICP definition and list building",
      "Email + call + LinkedIn sequencing",
      "BANT-style qualification notes",
    ],
  },
  {
    slug: "appointment-setting",
    name: "Appointment Setting",
    short: "Calendars that fill themselves.",
    blurb:
      "We work your inbound and outbound interest into confirmed meetings, then guard the calendar with reminders that kill no-shows.",
    device: "calendar",
    metric: { value: "-41%", label: "no-show rate" },
    bullets: [
      "Direct booking into your calendar",
      "Reminder and reschedule flows",
      "Pre-call briefs for every meeting",
    ],
  },
  {
    slug: "sales-outreach",
    name: "Sales Outreach",
    short: "SDR muscle, on demand.",
    blurb:
      "A dedicated outreach squad running your sequences end to end, complete with messaging tests, consistent follow-through, and clean CRM hygiene.",
    device: "target",
    metric: { value: "6+", label: "touches per prospect" },
    bullets: [
      "Dedicated SDR pods",
      "Message testing by segment",
      "Full CRM activity logging",
    ],
  },
  {
    slug: "technical-support",
    name: "Technical Support",
    short: "Tier 1 and 2 that actually resolves.",
    blurb:
      "Product-trained agents run diagnostics, follow runbooks, and close tickets, escalating to your engineers only when genuinely needed.",
    device: "terminal",
    metric: { value: "82%", label: "first-contact resolution" },
    bullets: [
      "Runbook-driven troubleshooting",
      "Tier 1 + Tier 2 coverage",
      "Bug reports your engineers can use",
    ],
  },
  {
    slug: "custom-solutions",
    name: "Custom Solutions",
    short: "Built around your workflow.",
    blurb:
      "From odd hours and niche languages to hybrid roles and regulated scripts: tell us what you need, and we build the pod around it.",
    device: "blueprint",
    metric: { value: "2 wks", label: "typical ramp-up" },
    bullets: [
      "Custom pods and hybrid roles",
      "Multilingual and off-hours coverage",
      "Process design and documentation",
    ],
  },
];

/** Options shown in the quote form (matches the requested wording). */
export const QUOTE_SERVICE_OPTIONS = [
  "Inbound call support",
  "Outbound calling",
  "Live chat support",
  "Email support",
  "Customer service",
  "Lead generation",
  "Appointment setting",
  "Sales outreach",
  "Technical support",
  "Other",
] as const;

export const OPERATION_SIZES = ["1–5 agents", "6–20", "21–50", "50+"] as const;
