import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getEventDetail } from "@/lib/events";
import { formatEventWhen } from "@/lib/format";
import { ActivityBadge } from "@/components/gd/activity-badge";
import { JoinButton } from "@/components/gd/join-button";
import { LogHoursForm } from "@/components/gd/log-hours-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const detail = await getEventDetail(id, user.id);
  if (!detail) notFound();
  const { event, mine, hasStarted } = detail;

  const joined = mine != null && mine.status !== "cancelled";
  const attended = mine?.status === "attended";
  const goingCount = event.participations.length;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/app/events"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden /> All deeds
      </Link>

      <div className="flex flex-col gap-3">
        <ActivityBadge type={event.activityType} />
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {event.title}
        </h1>
        <div className="text-muted-foreground flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-2">
            <Clock className="size-4" aria-hidden /> {formatEventWhen(event.startsAt, event.endsAt)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden /> {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4" aria-hidden /> {goingCount} going
            {event.capacity ? ` · cap ${event.capacity}` : ""} · hosted by{" "}
            {event.organizer.profilePublic ? (
              <Link
                href={`/u/${event.organizer.username}`}
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {event.organizer.name ?? `@${event.organizer.username}`}
              </Link>
            ) : (
              event.organizer.name ?? event.organizer.email ?? "an organizer"
            )}
          </span>
        </div>
      </div>

      <p className="max-w-2xl leading-relaxed whitespace-pre-line">{event.description}</p>

      <div className="flex flex-wrap items-center gap-3">
        <JoinButton eventId={event.id} joined={joined} locked={attended} />
      </div>

      {joined && hasStarted && (
        <Card>
          <CardHeader>
            <CardTitle>Log your participation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Volunteered? Log your hours to add this deed to your impact ledger.
            </p>
            <LogHoursForm
              eventId={event.id}
              defaultHours={mine?.hoursLogged ?? 0}
              attended={attended}
            />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="font-heading mb-3 text-lg font-semibold">Who&apos;s going</h2>
        {goingCount > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {event.participations.map((p) => {
              const label = `${p.user.name ?? p.user.email ?? "Volunteer"}${p.status === "attended" ? " ✓" : ""}`;
              return (
                <li
                  key={p.id}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                >
                  {p.user.profilePublic ? (
                    <Link href={`/u/${p.user.username}`} className="underline-offset-4 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">Be the first to join.</p>
        )}
      </div>
    </div>
  );
}
