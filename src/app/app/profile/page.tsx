import { getCurrentUser } from "@/lib/auth";
import { getMyProfile } from "@/lib/profile";
import { ProfileForm } from "@/components/gd/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  const profile = user ? await getMyProfile(user.id) : null;
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your public profile is a shareable record of your volunteering — a real résumé of good.
        </p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}
