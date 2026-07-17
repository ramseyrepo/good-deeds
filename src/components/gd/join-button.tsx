"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { joinEvent, leaveEvent } from "@/actions/events";

export function JoinButton({
  eventId,
  joined,
  locked,
}: {
  eventId: string;
  joined: boolean;
  locked: boolean; // attended — can't leave
}) {
  const [pending, startTransition] = useTransition();

  if (locked) {
    return (
      <Button size="lg" variant="secondary" disabled>
        <Check aria-hidden /> Attended
      </Button>
    );
  }

  function handle(action: "join" | "leave") {
    startTransition(async () => {
      const res = action === "join" ? await joinEvent(eventId) : await leaveEvent(eventId);
      if (res.ok) {
        toast.success(action === "join" ? "You're going. See you there!" : "You've left this deed.");
      } else {
        toast.error(res.error);
      }
    });
  }

  if (joined) {
    return (
      <div className="flex items-center gap-2">
        <Button size="lg" variant="secondary" disabled>
          <Check aria-hidden /> You&apos;re going
        </Button>
        <Button
          size="lg"
          variant="ghost"
          disabled={pending}
          onClick={() => handle("leave")}
        >
          <LogOut aria-hidden /> Leave
        </Button>
      </div>
    );
  }

  return (
    <Button size="lg" disabled={pending} onClick={() => handle("join")}>
      {pending ? "Joining…" : "Join this deed"}
    </Button>
  );
}
