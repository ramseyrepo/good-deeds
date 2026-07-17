"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent } from "@/actions/events";

const ACTIVITIES = [
  ["cleanup", "Cleanup"],
  ["food-bank", "Food bank"],
  ["tutoring", "Tutoring"],
  ["fundraiser", "Fundraiser"],
  ["other", "Other"],
] as const;

export function EventForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await createEvent(fd);
          if (res.ok && res.data) {
            toast.success("Your deed is live. People can join now.");
            router.push(`/app/events/${res.data.id}`);
          } else if (!res.ok) {
            toast.error(res.error);
          }
        })
      }
      className="flex max-w-2xl flex-col gap-5"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Saturday river cleanup" required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          placeholder="What will volunteers do? What should they bring?"
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-3"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="activityType">Activity type</Label>
          <select
            id="activityType"
            name="activityType"
            defaultValue="cleanup"
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
          >
            {ACTIVITIES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Riverside Park, Main St" required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="startsAt">Starts</Label>
          <Input id="startsAt" name="startsAt" type="datetime-local" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="endsAt">Ends</Label>
          <Input id="endsAt" name="endsAt" type="datetime-local" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="capacity">Capacity (optional)</Label>
          <Input id="capacity" name="capacity" type="number" min="1" placeholder="No limit" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Posting…" : "Post this deed"}
        </Button>
      </div>
    </form>
  );
}
