import { db } from "@/lib/db";
import { activityLabel } from "@/lib/format";

/** Public profile by username — returns null if missing or not public (opt-in). */
export async function getPublicProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      profilePublic: true,
      createdAt: true,
    },
  });
  if (!user || !user.profilePublic) return null;

  const attended = await db.participation.findMany({
    where: { userId: user.id, status: "attended" },
    include: {
      event: { select: { id: true, title: true, activityType: true, startsAt: true, location: true } },
    },
    orderBy: { event: { startsAt: "desc" } },
  });

  const hoursLogged = attended.reduce((sum, p) => sum + p.hoursLogged, 0);

  const counts = new Map<string, number>();
  for (const p of attended) {
    counts.set(p.event.activityType, (counts.get(p.event.activityType) ?? 0) + 1);
  }
  const breakdown = [...counts.entries()]
    .map(([type, count]) => ({ type, label: activityLabel(type), count }))
    .sort((a, b) => b.count - a.count);

  return {
    user,
    hoursLogged,
    deedsDone: attended.length,
    breakdown,
    events: attended.map((p) => ({ ...p.event, hoursLogged: p.hoursLogged })),
  };
}

/** The current user's own editable profile fields. */
export async function getMyProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: { name: true, username: true, bio: true, profilePublic: true },
  });
}
