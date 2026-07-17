import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { sendEmail } from "./email";

describe("sendEmail", () => {
  const OLD = process.env.RESEND_API_KEY;
  beforeEach(() => { delete process.env.RESEND_API_KEY; });
  afterEach(() => { if (OLD) process.env.RESEND_API_KEY = OLD; else delete process.env.RESEND_API_KEY; });

  it("no-ops when RESEND_API_KEY is missing", async () => {
    const res = await sendEmail({ to: "a@b.com", subject: "Hi", html: "<p>x</p>" });
    expect(res.sent).toBe(false);
    expect(res.reason).toMatch(/RESEND_API_KEY/);
  });
});
