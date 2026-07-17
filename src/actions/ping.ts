"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
});

export type PingResult = { ok: true; message: string } | { ok: false; error: string };

export async function ping(formData: FormData): Promise<PingResult> {
  const parsed = schema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  return { ok: true, message: `Hello, ${parsed.data.name}. Your stack is souped.` };
}
