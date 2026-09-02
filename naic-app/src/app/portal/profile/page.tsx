import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?redirect=/portal/profile");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        Profile
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Update the name shown across the member portal.
      </p>

      <ProfileForm
        initialName={profile?.full_name ?? ""}
        email={user.email ?? ""}
      />
    </div>
  );
}
