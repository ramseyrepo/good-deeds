import { getSession } from "@souped-tools/auth-nextjs";
import { db } from "@/lib/db";
import type { User } from "@/generated/prisma/client";
import { baseSlug, randomSuffix } from "@/lib/username";

export type CurrentSession = Awaited<ReturnType<typeof getSession>>;

/** Raw session from the Souped auth cookie, or null. */
export async function getCurrentSession(): Promise<CurrentSession> {
  return getSession();
}

/**
 * Lazy-sync the session into a local `User` row and return it.
 * Creates the row (with a unique username) on first sight of a `sub`.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  const sub = (session as { sub?: string } | null)?.sub;
  if (!session || !sub) return null;

  const email = (session as { email?: string }).email ?? null;
  const name = (session as { name?: string }).name ?? null;

  const existing = await db.user.findUnique({ where: { sub } });
  if (existing) {
    if ((email && email !== existing.email) || (name && name !== existing.name)) {
      return db.user.update({
        where: { sub },
        data: { ...(email ? { email } : {}), ...(name ? { name } : {}) },
      });
    }
    return existing;
  }

  // First login for this sub — mint a unique username.
  const base = baseSlug(name ?? email);
  for (let attempt = 0; attempt < 6; attempt++) {
    const username = attempt === 0 ? base : `${base}-${randomSuffix()}`;
    const taken = await db.user.findUnique({ where: { username } });
    if (taken) continue;
    try {
      return await db.user.create({ data: { sub, email, name, username } });
    } catch {
      // Unique race — try again with a fresh suffix.
    }
  }
  // Extremely unlikely fallback.
  return db.user.create({
    data: { sub, email, name, username: `${base}-${randomSuffix()}${randomSuffix()}` },
  });
}

/** Same as getCurrentUser but throws if there is no session. Use in actions. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
