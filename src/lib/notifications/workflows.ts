export type NotificationChannel = "in_app" | "email";

export interface WorkflowDefinition {
  key: string;
  label: string;
  description: string;
  availableChannels: NotificationChannel[];
  defaultChannels: NotificationChannel[];
  renderInApp: (data: Record<string, unknown>) => { title: string; body: string };
  renderEmail: (data: Record<string, unknown>) => { subject: string; html: string };
}

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

/**
 * Declarative catalog of classic, self-describing workflows. This is the SINGLE
 * source of truth for what notifications an app can send. The seed (`seed.ts`)
 * turns each entry into a `NotificationWorkflowConfig` row (enabled=false by
 * default). Souped never sees this file — it reads the seeded rows from the DB
 * and renders each row's `label`/`description` in its UI.
 *
 * IMPORTANT (owner-facing rule): every workflow here has an explicit, human
 * label + description so the project owner understands what it is, when it
 * fires, and can decide whether to enable it and on which channels. When a
 * feature needs to notify a new event and no classic entry fits, add a NEW
 * NAMED entry here (its own key/label/description/renderers) — never a generic,
 * identity-less catch-all.
 *
 * The agent (following the `souped-notify` skill) activates only the workflows
 * relevant to the app being built: it seeds those rows and places the matching
 * `notify("<key>", ...)` calls. Entries not relevant to an app are simply not
 * seeded, so the owner never sees a toggle for something that can't fire.
 *
 * ── Generic payload-driven pattern (EXAMPLE ONLY — DO NOT add to WORKFLOWS) ──
 * A workflow whose content comes entirely from the payload looks like this:
 *
 *   {
 *     key: "generic-alert",
 *     label: "Generic alert",
 *     description: "Catch-all driven by its payload (title + body).",
 *     availableChannels: ["in_app", "email"],
 *     defaultChannels: ["in_app"],
 *     renderInApp: (data) => ({ title: str(data.title, "Notification"), body: str(data.body) }),
 *     renderEmail: (data) => ({ subject: str(data.title, "Notification"), html: `<p>${str(data.body)}</p>` }),
 *   }
 *
 * This is shown so you know HOW to write payload-driven renderers — but a
 * generic alert is opaque to the owner in Souped's UI (they can't tell what it
 * is or when it fires). Prefer a named workflow with a real label/description.
 * Do not seed it.
 */
export const WORKFLOWS: WorkflowDefinition[] = [
  // ── Account / onboarding ───────────────────────────────────────────────
  {
    key: "signup",
    label: "Welcome",
    description: "Sent when a new user signs up.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app", "email"],
    renderInApp: (data) => ({
      title: str(data.title, "Welcome!"),
      body: str(data.body, "Thanks for signing up."),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Welcome!"),
      html: `<p>${str(data.body, "Thanks for signing up.")}</p>`,
    }),
  },
  {
    key: "onboarding-reminder",
    label: "Onboarding reminder",
    description: "Nudges a user who hasn't finished onboarding.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["email"],
    renderInApp: (data) => ({
      title: str(data.title, "Finish setting up"),
      body: str(data.body, "You have a few steps left to complete."),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Finish setting up your account"),
      html: `<p>${str(data.body, "You have a few steps left to complete.")}</p>`,
    }),
  },

  // ── Social / collaboration ─────────────────────────────────────────────
  {
    key: "mention",
    label: "You were mentioned",
    description: "Sent when someone mentions the user.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app"],
    renderInApp: (data) => ({
      title: str(data.title, "You were mentioned"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "You were mentioned"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "comment-reply",
    label: "Replies & comments",
    description: "Sent when someone replies to the user's content.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app"],
    renderInApp: (data) => ({
      title: str(data.title, "New reply"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "New reply to your post"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "team-invite",
    label: "Team invite",
    description: "Sent when the user is invited to a space or team.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app", "email"],
    renderInApp: (data) => ({
      title: str(data.title, "You've been invited"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "You've been invited to a team"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "team-activity",
    label: "Team activity",
    description: "Activity from teammates or collaborators.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app"],
    renderInApp: (data) => ({
      title: str(data.title, "Team activity"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Team activity"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },

  // ── Billing / subscription (seed only if the app charges) ──────────────
  {
    key: "payment-successful",
    label: "Payment confirmed",
    description: "Sent after a successful payment.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["email"],
    renderInApp: (data) => ({
      title: str(data.title, "Payment confirmed"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Your payment was confirmed"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "payment-failed",
    label: "Payment failed",
    description: "Sent when a payment attempt fails.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["email"],
    renderInApp: (data) => ({
      title: str(data.title, "Payment failed"),
      body: str(data.body, "We couldn't process your payment."),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Your payment failed"),
      html: `<p>${str(data.body, "We couldn't process your payment.")}</p>`,
    }),
  },
  {
    key: "trial-ending",
    label: "Trial ending",
    description: "Sent before a trial expires.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["email"],
    renderInApp: (data) => ({
      title: str(data.title, "Your trial is ending soon"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Your trial is ending soon"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "subscription-changed",
    label: "Subscription change",
    description: "Sent on upgrade, downgrade, or cancellation.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["email"],
    renderInApp: (data) => ({
      title: str(data.title, "Your subscription changed"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Your subscription was updated"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },

  // ── Usage / limits (seed only if the app has plan limits) ──────────────
  {
    key: "usage-milestone",
    label: "Usage milestone",
    description: "Sent when the user reaches a usage threshold (e.g. 80%).",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app"],
    renderInApp: (data) => ({
      title: str(data.title, "You're approaching your limit"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "You're approaching your usage limit"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "usage-limit",
    label: "Usage limit reached",
    description: "Sent when a usage limit is hit.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app", "email"],
    renderInApp: (data) => ({
      title: str(data.title, "Usage limit reached"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "You've reached your usage limit"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },

  // ── Product / system ───────────────────────────────────────────────────
  {
    key: "new-feature",
    label: "New feature",
    description: "Sent when a new feature ships.",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app"],
    renderInApp: (data) => ({
      title: str(data.title, "New feature"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Something new just shipped"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
  {
    key: "system-alert",
    label: "System alerts",
    description: "Important account or service notices (security, limits, maintenance).",
    availableChannels: ["in_app", "email"],
    defaultChannels: ["in_app", "email"],
    renderInApp: (data) => ({
      title: str(data.title, "System alert"),
      body: str(data.body),
    }),
    renderEmail: (data) => ({
      subject: str(data.title, "Important account notice"),
      html: `<p>${str(data.body)}</p>`,
    }),
  },
];

export function getWorkflow(key: string): WorkflowDefinition | undefined {
  return WORKFLOWS.find((w) => w.key === key);
}
