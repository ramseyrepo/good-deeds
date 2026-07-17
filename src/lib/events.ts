import { db } from "@/lib/db";

/** Open (upcoming, not cancelled) events, soonest first. */
export async function getOpenEvents() {
  return db.event.findMany({
    where: { endsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    include: {
      organizer: { select: { name: true, email: true } },
      _count: { select: { participations: { where: { status: { not: "cancelled" } } } } },
    },
  });
}

export async function getEventDetail(eventId: string, userId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: { select: { id: true, name: true, email: true } },
      participations: {
        where: { status: { not: "cancelled" } },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!event) return null;
  const mine = event.participations.find((p) => p.userId === userId) ?? null;
  const hasStarted = event.startsAt.getTime() <= Date.now();
  return { event, mine, hasStarted };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

/** The volunteer's Impact Ledger + upcoming deeds. */
export async function getDashboard(userId: string) {
  const [attended, going, hoursAgg] = await Promise.all([
    db.participation.count({ where: { userId, status: "attended" } }),
    db.participation.findMany({
      where: { userId, status: "going", event: { endsAt: { gte: new Date() } } },
      include: {
        event: {
          include: {
            _count: { select: { participations: { where: { status: { not: "cancelled" } } } } },
          },
        },
      },
      orderBy: { event: { startsAt: "asc" } },
    }),
    db.participation.aggregate({
      where: { userId, status: "attended" },
      _sum: { hoursLogged: true },
    }),
  ]);

  return {
    deedsDone: attended,
    hoursLogged: hoursAgg._sum.hoursLogged ?? 0,
    upcoming: going.map((p) => p.event),
    upcomingCount: going.length,
  };
}
