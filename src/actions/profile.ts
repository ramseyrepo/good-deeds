"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { USERNAME_RE } from "@/lib/username";

export type ActionResult = { ok: true } | { ok: false; error: string };

const schema = z.object({
  name: z.string().trim().min(1, "Add your name").max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username is too long")
    .regex(USERNAME_RE, "Use lowercase letters, numbers, and hyphens (no leading/trailing hyphen)"),
  bio: z.string().trim().max(280, "Keep your bio under 280 characters").optional(),
  profilePublic: z.union([z.literal("on"), z.null()]).optional(),
});

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = schema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    bio: formData.get("bio") || undefined,
    profilePublic: formData.get("profilePublic"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, username, bio, profilePublic } = parsed.data;

  const clash = await db.user.findFirst({
    where: { username, NOT: { id: user.id } },
    select: { id: true },
  });
  if (clash) return { ok: false, error: "That username is taken. Try another." };

  await db.user.update({
    where: { id: user.id },
    data: {
      name,
      username,
      bio: bio ?? null,
      profilePublic: profilePublic === "on",
    },
  });

  revalidatePath("/app/profile");
  revalidatePath(`/u/${username}`);
  return { ok: true };
}
