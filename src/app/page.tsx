import Link from "next/link";
import { ClipboardCheck, HandHeart, MapPin, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Good Deeds — do good, keep the receipts",
  description:
    "Find volunteering near you, show up, and build a record of your impact — hours and deeds that add up.",
};

export default function Landing() {
  return (
    <div className="bg-gd-paper text-gd-ink min-h-full">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="bg-gd-forest flex size-8 items-center justify-center rounded-lg">
            <Sprout className="text-gd-sprout-light size-5" aria-hidden />
          </span>
          <span className="font-heading text-lg font-semibold">Good Deeds</span>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app">Sign in</Link>
        </Button>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 pb-16 md:grid-cols-2 md:pt-16">
          <div>
            <span className="border-gd-sprout/40 text-gd-forest inline-flex rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
              Volunteering, tracked
            </span>
            <h1 className="font-heading mt-5 text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
              Do good.
              <br />
              Keep the receipts.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gd-ink/70">
              Find volunteering near you, show up, and build a record of your impact —
              hours and deeds that add up to something you can be proud of.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gd-forest text-gd-paper hover:bg-gd-forest/90">
                <Link href="/app">Find a deed</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gd-forest/20 text-gd-ink"
              >
                <Link href="/app/events/new">Post a deed</Link>
              </Button>
            </div>
          </div>

          {/* Impact card mock */}
          <div className="bg-gd-forest text-gd-paper rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Sprout className="size-4" aria-hidden /> Your impact ledger
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                ["24", "Hours"],
                ["7", "Deeds"],
                ["2", "Upcoming"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-3xl font-semibold tabular-nums">{n}</div>
                  <div className="mt-1 text-xs opacity-75">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-1.5 flex justify-between text-xs opacity-75">
                <span>Growth</span>
                <span className="font-mono">24/25 hrs</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                <div className="bg-gd-amber h-full rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-gd-forest/10 border-t bg-white/50">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
            {[
              {
                icon: <MapPin className="size-5" aria-hidden />,
                title: "Find a deed",
                body: "Browse volunteering events posted by local non-profits and neighbors.",
              },
              {
                icon: <HandHeart className="size-5" aria-hidden />,
                title: "Show up",
                body: "Join with one tap. See who else is going and what to bring.",
              },
              {
                icon: <ClipboardCheck className="size-5" aria-hidden />,
                title: "Log your hours",
                body: "Record participation and watch your impact ledger grow over time.",
              },
            ].map((s) => (
              <div key={s.title}>
                <span className="bg-gd-sprout/15 text-gd-forest flex size-10 items-center justify-center rounded-xl">
                  {s.icon}
                </span>
                <h3 className="font-heading mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gd-ink/70">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For orgs */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="bg-gd-forest text-gd-paper flex flex-col items-start gap-4 rounded-2xl px-8 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Run a non-profit?</h2>
              <p className="mt-1.5 max-w-md text-sm opacity-80">
                Post events, rally volunteers, and see exactly who showed up and for how long.
              </p>
            </div>
            <Button asChild size="lg" className="bg-gd-amber text-gd-ink hover:bg-gd-amber/90">
              <Link href="/app/events/new">Post your first deed</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-gd-forest/10 border-t">
        <div className="text-gd-ink/50 mx-auto max-w-6xl px-6 py-8 text-sm">
          Good Deeds — do good, keep the receipts.
        </div>
      </footer>
    </div>
  );
}
