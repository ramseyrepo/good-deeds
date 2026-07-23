import Link from "next/link";
import { UluMark } from "@/components/gd/ulu-mark";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Button } from "@/components/ui/button";

export function AppNav() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur md:px-6">
      <Link href="/app" className="flex items-center gap-2">
        <span className="bg-gd-forest flex size-7 items-center justify-center rounded-md">
          <UluMark className="size-4 text-white" />
        </span>
        <span className="font-heading text-base font-semibold">Ulu</span>
      </Link>
      <nav className="flex items-center gap-1 md:gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/events">Browse</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/events/new">Post a deed</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/profile">Profile</Link>
        </Button>
        <NotificationBell />
        <Button asChild variant="ghost" size="sm">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route: needs a full navigation to clear the session */}
          <a href="/api/auth/logout">Sign out</a>
        </Button>
      </nav>
    </header>
  );
}
