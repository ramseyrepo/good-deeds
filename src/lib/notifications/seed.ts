import { db } from "@/lib/db";
import { WORKFLOWS } from "./workflows";

/**
 * Idempotent seed of NotificationWorkflowConfig rows from the catalog.
 * - New workflows are inserted disabled (enabled=false) with their default channels.
 * - Existing rows have ONLY their display metadata refreshed
 *   (label/description/availableChannels). enabled/channels are the user's
 *   choices (made in Souped) and are never overwritten.
 * Safe to run repeatedly (postinstall, migration hook, or a skill command).
 */
export async function seedWorkflowConfigs(): Promise<{ upserted: number }> {
  let upserted = 0;
  for (const w of WORKFLOWS) {
    await db.notificationWorkflowConfig.upsert({
      where: { key: w.key },
      create: {
        key: w.key,
        label: w.label,
        description: w.description,
        availableChannels: w.availableChannels,
        enabled: false,
        channels: w.defaultChannels,
      },
      update: {
        label: w.label,
        description: w.description,
        availableChannels: w.availableChannels,
      },
    });
    upserted++;
  }
  return { upserted };
}
