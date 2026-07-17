/**
 * Minimal Resend email sender. Reads RESEND_API_KEY from the environment
 * (injected by the Resend Vercel Marketplace integration in production).
 * When the key is absent (e.g. local dev), it no-ops with a warning so the
 * caller — always fire-and-forget — never breaks.
 */
export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notifications] RESEND_API_KEY not set — skipping email send");
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }
  const from = process.env.NOTIFICATIONS_EMAIL_FROM ?? "onboarding@resend.dev";

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: args.to, subject: args.subject, html: args.html }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return { sent: false, reason: `Resend responded ${resp.status}: ${text}` };
  }
  return { sent: true };
}
