import { getSession } from "@souped-tools/auth-nextjs";
import { db } from "@/lib/db";
import type { User } from "@/generated/prisma/client";

export type CurrentSession = Awaited<ReturnType<typeof getSession>>;

/** Raw session from the Souped auth cookie, or null. */
export async function getCurrentSession(): Promise<CurrentSession> {
  return getSession();
}

/**
 * Lazy-sync the session into a local `User` row and return it.
 * The proxy guarantees a session on /app/* routes, but this returns null
 * defensively if there's no session (e.g. called from a public surface).
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  const sub = (session as { sub?: string } | null)?.sub;
  if (!session || !sub) return null;

  const email = (session as { email?: string }).email ?? null;
  const name = (session as { name?: string }).name ?? null;

  return db.user.upsert({
    where: { sub },
    // Keep email/name fresh from the token, but never clobber a stored role.
    update: { ...(email ? { email } : {}), ...(name ? { name } : {}) },
    create: { sub, email, name },
  });
}

/** Same as getCurrentUser but throws if there is no session. Use in actions. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
