import { Badge } from "@/components/ui/badge";
import { activityLabel } from "@/lib/format";

export function ActivityBadge({ type }: { type: string }) {
  return <Badge variant="secondary">{activityLabel(type)}</Badge>;
}
