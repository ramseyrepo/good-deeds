import Link from "next/link";
import { CalendarPlus, Compass } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboard, getOpenEvents } from "@/lib/events";
import { ImpactLedger } from "@/components/gd/impact-ledger";
import { EventCard } from "@/components/gd/event-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const firstName = user?.name?.split(" ")[0] ?? null;

  const [dash, open] = await Promise.all([
    user ? getDashboard(user.id) : Promise.resolve(null),
    getOpenEvents(),
  ]);

  const upcomingIds = new Set(dash?.upcoming.map((e) => e.id) ?? []);
  const discover = open.filter((e) => !upcomingIds.has(e.id)).slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Your impact"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every hour you log is a receipt for the good you&apos;ve done.
        </p>
      </div>

      <ImpactLedger
        hoursLogged={dash?.hoursLogged ?? 0}
        deedsDone={dash?.deedsDone ?? 0}
        upcomingCount={dash?.upcomingCount ?? 0}
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Your upcoming deeds</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/events">
              <Compass aria-hidden /> Browse all
            </Link>
          </Button>
        </div>
        {dash && dash.upcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {dash.upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="border-border rounded-xl border border-dashed px-6 py-10 text-center">
            <p className="font-heading text-base">Your ledger is empty</p>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
              Join your first deed to start your record. Small acts count.
            </p>
            <Button asChild className="mt-4">
              <Link href="/app/events">Find a deed</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Open near you</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/events/new">
              <CalendarPlus aria-hidden /> Post a deed
            </Link>
          </Button>
        </div>
        {discover.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discover.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No open deeds yet — be the first to{" "}
            <Link href="/app/events/new" className="text-primary underline-offset-4 hover:underline">
              post one
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
