import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { getOpenEvents } from "@/lib/events";
import { EventCard } from "@/components/gd/event-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getOpenEvents();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Open deeds</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {events.length} volunteering {events.length === 1 ? "event" : "events"} looking for hands.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/events/new">
            <CalendarPlus aria-hidden /> Post a deed
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="border-border rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="font-heading text-base">No open deeds yet</p>
          <p className="text-muted-foreground mt-1 text-sm">Check back soon, or post the first one.</p>
        </div>
      )}
    </div>
  );
}
