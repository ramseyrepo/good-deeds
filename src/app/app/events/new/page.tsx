import { EventForm } from "@/components/gd/event-form";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Post a deed</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Rally volunteers for a good cause. You&apos;ll be counted as going automatically.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
