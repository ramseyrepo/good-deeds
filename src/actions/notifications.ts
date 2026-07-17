"use server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export type ActionResult = { ok: boolean };

/** Mark a single notification read — scoped to the current user's sub. */
export async function markRead(id: string): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session?.sub) return { ok: false };
  await db.notification.updateMany({
    where: { id, userSub: session.sub, readAt: null },
    data: { readAt: new Date() },
  });
  return { ok: true };
}

/** Mark every unread notification read for the current user. */
export async function markAllRead(): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session?.sub) return { ok: false };
  await db.notification.updateMany({
    where: { userSub: session.sub, readAt: null },
    data: { readAt: new Date() },
  });
  return { ok: true };
}
