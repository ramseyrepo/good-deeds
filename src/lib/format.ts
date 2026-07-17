const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatEventWhen(startsAt: Date, endsAt: Date): string {
  const sameDay = startsAt.toDateString() === endsAt.toDateString();
  if (sameDay) {
    return `${dateFmt.format(startsAt)} · ${timeFmt.format(startsAt)}–${timeFmt.format(endsAt)}`;
  }
  return `${dateFmt.format(startsAt)} ${timeFmt.format(startsAt)} → ${dateFmt.format(endsAt)} ${timeFmt.format(endsAt)}`;
}

export const ACTIVITY_LABELS: Record<string, string> = {
  cleanup: "Cleanup",
  "food-bank": "Food bank",
  tutoring: "Tutoring",
  fundraiser: "Fundraiser",
  other: "Other",
};

export function activityLabel(type: string): string {
  return ACTIVITY_LABELS[type] ?? "Other";
}
