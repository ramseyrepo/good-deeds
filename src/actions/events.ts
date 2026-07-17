"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

const createEventSchema = z
  .object({
    title: z.string().trim().min(3, "Give your deed a title").max(120),
    description: z.string().trim().min(10, "Add a few details so people know what to expect").max(2000),
    activityType: z.enum(["cleanup", "food-bank", "tutoring", "fundraiser", "other"]),
    location: z.string().trim().min(2, "Where is it?").max(160),
    startsAt: z.string().min(1, "Pick a start time"),
    endsAt: z.string().min(1, "Pick an end time"),
    capacity: z.string().optional(),
  })
  .refine((v) => new Date(v.endsAt) > new Date(v.startsAt), {
    message: "End time must be after the start time",
    path: ["endsAt"],
  });

/** Create a volunteering event. The creator becomes its organizer. */
export async function createEvent(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = createEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    activityType: formData.get("activityType"),
    location: formData.get("location"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    capacity: formData.get("capacity") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const capacity = d.capacity ? Number.parseInt(d.capacity, 10) : null;

  const event = await db.event.create({
    data: {
      title: d.title,
      description: d.description,
      activityType: d.activityType,
      location: d.location,
      startsAt: new Date(d.startsAt),
      endsAt: new Date(d.endsAt),
      capacity: Number.isFinite(capacity as number) ? capacity : null,
      organizerId: user.id,
    },
  });

  // Organizing is participating: the host is counted as going.
  await db.participation.upsert({
    where: { eventId_userId: { eventId: event.id, userId: user.id } },
    update: {},
    create: { eventId: event.id, userId: user.id, status: "going" },
  });

  revalidatePath("/app");
  revalidatePath("/app/events");
  return { ok: true, data: { id: event.id } };
}

/** Join an event (RSVP as "going"). Idempotent. */
export async function joinEvent(eventId: string): Promise<ActionResult> {
  const user = await requireUser();
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { participations: { where: { status: { not: "cancelled" } } } } } },
  });
  if (!event) return { ok: false, error: "That deed no longer exists" };

  const existing = await db.participation.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (!existing && event.capacity && event._count.participations >= event.capacity) {
    return { ok: false, error: "This deed is full" };
  }

  await db.participation.upsert({
    where: { eventId_userId: { eventId, userId: user.id } },
    update: { status: "going" },
    create: { eventId, userId: user.id, status: "going" },
  });

  revalidatePath(`/app/events/${eventId}`);
  revalidatePath("/app");
  return { ok: true };
}

/** Leave an event (mark participation cancelled). */
export async function leaveEvent(eventId: string): Promise<ActionResult> {
  const user = await requireUser();
  await db.participation.updateMany({
    where: { eventId, userId: user.id, status: { not: "attended" } },
    data: { status: "cancelled" },
  });
  revalidatePath(`/app/events/${eventId}`);
  revalidatePath("/app");
  return { ok: true };
}

const logSchema = z.object({
  eventId: z.string().min(1),
  hours: z.coerce.number().min(0, "Hours can't be negative").max(24, "That's a long day — 24h max per log"),
});

/**
 * Mark attendance and log hours — the participation-tracking core action.
 * Turns an RSVP into a recorded deed on the volunteer's ledger.
 */
export async function logAttendance(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = logSchema.safeParse({
    eventId: formData.get("eventId"),
    hours: formData.get("hours"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { eventId, hours } = parsed.data;

  const existing = await db.participation.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  if (!existing) return { ok: false, error: "Join the deed before logging hours" };

  await db.participation.update({
    where: { eventId_userId: { eventId, userId: user.id } },
    data: { status: "attended", hoursLogged: hours },
  });

  revalidatePath(`/app/events/${eventId}`);
  revalidatePath("/app");
  return { ok: true };
}
