"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile";

export function ProfileForm({
  initial,
}: {
  initial: { name: string | null; username: string; bio: string | null; profilePublic: boolean };
}) {
  const [pending, startTransition] = useTransition();
  const [isPublic, setIsPublic] = useState(initial.profilePublic);
  const [username, setUsername] = useState(initial.username);

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await updateProfile(fd);
          if (res.ok) toast.success("Profile saved.");
          else toast.error(res.error);
        })
      }
      className="flex max-w-xl flex-col gap-5"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input id="name" name="name" defaultValue={initial.name ?? ""} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">/u/</span>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="max-w-xs"
            required
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Lowercase letters, numbers, and hyphens. This is your public profile address.
        </p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={280}
          defaultValue={initial.bio ?? ""}
          placeholder="A line about why you volunteer."
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-3"
        />
      </div>

      <div className="bg-muted/40 flex items-start gap-3 rounded-xl border p-4">
        <input
          id="profilePublic"
          name="profilePublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mt-0.5 size-4"
        />
        <div className="grid gap-0.5">
          <Label htmlFor="profilePublic" className="cursor-pointer">
            Make my profile public
          </Label>
          <p className="text-muted-foreground text-xs">
            When on, anyone with the link can see your name, bio, hours, and the deeds you&apos;ve
            done. When off, your profile is private.
          </p>
          {isPublic && username && (
            <Link
              href={`/u/${username}`}
              className="text-primary mt-1 inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
            >
              View public profile <ExternalLink className="size-3" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
