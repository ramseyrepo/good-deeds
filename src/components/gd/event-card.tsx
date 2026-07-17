import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityBadge } from "@/components/gd/activity-badge";
import { formatEventWhen } from "@/lib/format";

export function EventCard({
  event,
}: {
  event: {
    id: string;
    title: string;
    location: string;
    startsAt: Date;
    endsAt: Date;
    activityType: string;
    capacity: number | null;
    _count: { participations: number };
  };
}) {
  const spotsLeft =
    event.capacity != null ? Math.max(0, event.capacity - event._count.participations) : null;

  return (
    <Link
      href={`/app/events/${event.id}`}
      className="focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-3"
    >
      <Card className="hover:ring-primary/40 h-full transition-all hover:-translate-y-0.5">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{event.title}</CardTitle>
            <ActivityBadge type={event.activityType} />
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            {formatEventWhen(event.startsAt, event.endsAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0" aria-hidden />
            {event._count.participations} going
            {spotsLeft != null && spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ""}
            {spotsLeft === 0 ? " · full" : ""}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
