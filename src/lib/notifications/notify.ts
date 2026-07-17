import { db } from "@/lib/db";
import { getWorkflow, type NotificationChannel } from "./workflows";
import { sendEmail } from "./email";

/**
 * Fire-and-forget entry point the app calls wherever a notification should be
 * emitted, e.g. `notify("welcome", { userSub, email })`. Whether anything
 * actually happens is CONFIG, not code: it reads the workflow's config row and
 * dispatches only to enabled channels. Disabled / missing / unknown → no-op.
 * Never throws — a failure here must not break the business operation.
 */
export async function notify(
  workflowKey: string,
  opts: { userSub: string; email?: string; data?: Record<string, unknown> },
): Promise<void> {
  try {
    const def = getWorkflow(workflowKey);
    if (!def) return; // unknown workflow → nothing to render

    const config = await db.notificationWorkflowConfig.findUnique({
      where: { key: workflowKey },
    });
    if (!config || !config.enabled) return;

    const channels = config.channels as NotificationChannel[];
    const data = opts.data ?? {};

    if (channels.includes("in_app")) {
      const { title, body } = def.renderInApp(data);
      await db.notification.create({
        data: {
          userSub: opts.userSub,
          workflowKey,
          title,
          body,
          data: data as object,
        },
      });
    }

    if (channels.includes("email") && opts.email) {
      const { subject, html } = def.renderEmail(data);
      await sendEmail({ to: opts.email, subject, html });
    }
  } catch (err) {
    console.error(`[notifications] notify("${workflowKey}") failed:`, err);
  }
}
