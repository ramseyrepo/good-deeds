import { describe, it, expect } from "vitest";
import { WORKFLOWS, getWorkflow } from "./workflows";

const EXPECTED_KEYS = [
  // Account / onboarding
  "signup",
  "onboarding-reminder",
  // Social / collaboration
  "mention",
  "comment-reply",
  "team-invite",
  "team-activity",
  // Billing / subscription
  "payment-successful",
  "payment-failed",
  "trial-ending",
  "subscription-changed",
  // Usage / limits
  "usage-milestone",
  "usage-limit",
  // Product / system
  "new-feature",
  "system-alert",
];

describe("workflows catalog", () => {
  it("ships the classic workflow catalog", () => {
    const keys = WORKFLOWS.map((w) => w.key);
    for (const k of EXPECTED_KEYS) {
      expect(keys).toContain(k);
    }
    expect(keys).toHaveLength(EXPECTED_KEYS.length);
  });

  it("does NOT seed the identity-less generic-alert (it lives only as a skill code example)", () => {
    const keys = WORKFLOWS.map((w) => w.key);
    expect(keys).not.toContain("generic-alert");
  });

  it("every workflow has a human-readable label and description (owner-facing)", () => {
    for (const w of WORKFLOWS) {
      expect(w.label.trim().length).toBeGreaterThan(0);
      expect(w.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate keys", () => {
    const keys = WORKFLOWS.map((w) => w.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("only uses in_app/email channels, and defaultChannels are a subset of availableChannels", () => {
    for (const w of WORKFLOWS) {
      for (const c of w.availableChannels) {
        expect(["in_app", "email"]).toContain(c);
      }
      for (const c of w.defaultChannels) {
        expect(w.availableChannels).toContain(c);
      }
    }
  });

  it("getWorkflow returns a renderable definition", () => {
    const w = getWorkflow("signup");
    expect(w).toBeDefined();
    const inApp = w!.renderInApp({ title: "Hi", body: "There" });
    expect(typeof inApp.title).toBe("string");
    expect(typeof inApp.body).toBe("string");
    const email = w!.renderEmail({ title: "Hi", body: "There" });
    expect(typeof email.subject).toBe("string");
    expect(typeof email.html).toBe("string");
  });

  it("getWorkflow returns undefined for unknown keys", () => {
    expect(getWorkflow("does-not-exist")).toBeUndefined();
  });
});
