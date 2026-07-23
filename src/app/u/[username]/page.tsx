import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, HandHeart, MapPin, Sprout } from "lucide-react";
import { UluMark } from "@/components/gd/ulu-mark";
import { getPublicProfile } from "@/lib/profile";
import { formatEventWhen } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const memberFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) {
    return { title: "Profile · Ulu", robots: { index: false, follow: false } };
  }
  const who = profile.user.name ?? `@${profile.user.username}`;
  return {
    title: `${who} · Ulu`,
    description: `${who} has logged ${Math.round(profile.hoursLogged)} volunteering hours across ${profile.deedsDone} deeds on Ulu.`,
    robots: { index: true, follow: true },
  };
}

function initials(name: string | null, username: string): string {
  const src = (name ?? username).trim();
  const parts = src.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "GD";
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) notFound();

  const { user, hoursLogged, deedsDone, breakdown, events } = profile;
  const displayName = user.name ?? `@${user.username}`;

  return (
    <div className="bg-gd-paper text-gd-ink min-h-full">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gd-forest flex size-7 items-center justify-center rounded-lg">
            <UluMark className="size-4 text-white" />
          </span>
          <span className="font-heading text-base font-semibold">Ulu</span>
        </Link>
        <Button asChild size="sm" className="bg-gd-forest text-gd-paper hover:bg-gd-forest/90">
          <Link href="/app">Start your record</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <section className="flex items-center gap-4 pt-4">
          <div className="bg-gd-forest text-gd-paper font-heading flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold">
            {initials(user.name, user.username)}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              {displayName}
            </h1>
            <p className="text-gd-ink/60 text-sm">
              @{user.username} · Volunteering since {memberFmt.format(user.createdAt)}
            </p>
          </div>
        </section>

        {user.bio && <p className="mt-5 max-w-2xl leading-relaxed">{user.bio}</p>}

        <div className="bg-gd-forest text-gd-paper mt-6 grid grid-cols-2 gap-4 rounded-2xl p-6 sm:grid-cols-3">
          <Stat icon={<Clock className="size-4" aria-hidden />} value={hoursLogged % 1 === 0 ? String(hoursLogged) : hoursLogged.toFixed(1)} label="Hours logged" />
          <Stat icon={<HandHeart className="size-4" aria-hidden />} value={String(deedsDone)} label="Deeds done" />
          <Stat icon={<Sprout className="size-4" aria-hidden />} value={String(breakdown.length)} label="Causes" />
        </div>

        {breakdown.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading mb-3 text-lg font-semibold">What they do</h2>
            <div className="flex flex-wrap gap-2">
              {breakdown.map((b) => (
                <Badge key={b.type} variant="secondary" className="gap-1.5">
                  {b.label} <span className="font-mono opacity-70">{b.count}</span>
                </Badge>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-heading mb-3 text-lg font-semibold">Deeds done</h2>
          {events.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color:rgba(31,77,58,0.15)] bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-gd-ink/60 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" aria-hidden /> {formatEventWhen(e.startsAt, e.startsAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" aria-hidden /> {e.location}
                      </span>
                    </p>
                  </div>
                  <span className="font-mono text-gd-forest text-sm">
                    {e.hoursLogged % 1 === 0 ? e.hoursLogged : e.hoursLogged.toFixed(1)} hrs
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gd-ink/60 text-sm">No logged deeds yet — check back soon.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="opacity-80">{icon}</div>
      <div className="font-mono mt-1 text-3xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs opacity-75">{label}</div>
    </div>
  );
}
