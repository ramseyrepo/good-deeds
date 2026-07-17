"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAttendance } from "@/actions/events";

export function LogHoursForm({
  eventId,
  defaultHours,
  attended,
}: {
  eventId: string;
  defaultHours: number;
  attended: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          const res = await logAttendance(fd);
          if (res.ok) {
            const hrs = fd.get("hours");
            toast.success(`Nice work — ${hrs} hours added to your ledger.`);
          } else {
            toast.error(res.error);
          }
        })
      }
      className="flex flex-wrap items-end gap-3"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <div className="grid gap-1.5">
        <Label htmlFor="hours">Hours volunteered</Label>
        <Input
          id="hours"
          name="hours"
          type="number"
          step="0.5"
          min="0"
          max="24"
          defaultValue={defaultHours || ""}
          placeholder="e.g. 3"
          className="w-32"
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : attended ? "Update hours" : "Log attendance"}
      </Button>
    </form>
  );
}
