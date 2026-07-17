"use client";

import { useEffect, useState } from "react";
import { Clock, HandHeart, Sprout } from "lucide-react";

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync value when animation is disabled (reduced motion)
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);
  return value;
}

export function ImpactLedger({
  hoursLogged,
  deedsDone,
  upcomingCount,
}: {
  hoursLogged: number;
  deedsDone: number;
  upcomingCount: number;
}) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable entrance animation only after mount (avoids SSR hydration mismatch)
    setAnimate(!reduce);
  }, []);

  const hours = useCountUp(hoursLogged, animate);
  const deeds = useCountUp(deedsDone, animate);

  // Growth bar: a gentle milestone scale (fills toward the next 25h marker).
  const nextMilestone = Math.max(25, Math.ceil((hoursLogged || 1) / 25) * 25);
  const fillTarget = Math.min(1, hoursLogged / nextMilestone);
  const fill = useCountUp(fillTarget, animate);

  return (
    <div className="bg-gd-forest text-gd-paper ring-foreground/10 relative overflow-hidden rounded-xl px-6 py-6 ring-1">
      <div className="flex items-center gap-2 text-sm/none opacity-80">
        <Sprout className="size-4" aria-hidden />
        <span className="font-heading">Your impact ledger</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Stat
          icon={<Clock className="size-4" aria-hidden />}
          value={hours.toFixed(hoursLogged % 1 === 0 ? 0 : 1)}
          label="Hours logged"
        />
        <Stat
          icon={<HandHeart className="size-4" aria-hidden />}
          value={Math.round(deeds).toString()}
          label="Deeds done"
        />
        <Stat
          icon={<Sprout className="size-4" aria-hidden />}
          value={upcomingCount.toString()}
          label="Upcoming"
        />
      </div>

      <div className="mt-6">
        <div className="mb-1.5 flex justify-between text-xs opacity-75">
          <span>Growth</span>
          <span className="font-mono">
            {Math.round(hoursLogged)}/{nextMilestone} hrs
          </span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-valuenow={Math.round(hoursLogged)}
          aria-valuemin={0}
          aria-valuemax={nextMilestone}
          aria-label="Hours toward your next milestone"
        >
          <div
            className="h-full rounded-full bg-gd-amber transition-[width] duration-700 ease-out"
            style={{ width: `${fill * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 opacity-80">{icon}</div>
      <div className="font-mono mt-1 text-3xl leading-none font-semibold tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs opacity-75">{label}</div>
    </div>
  );
}
