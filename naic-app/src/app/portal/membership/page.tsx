import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { getTier } from "@/lib/tiers";
import { MembershipForm } from "./MembershipForm";

export const metadata: Metadata = { title: "Membership" };

export default async function MembershipPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?redirect=/portal/membership");

  const current = getTier(profile?.membership_tier);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl dark:text-white">
        Membership
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        You’re on the{" "}
        <span className="font-semibold text-white dark:text-white">
          {current.name}
        </span>{" "}
        plan. Choose a different tier below.
      </p>

      <MembershipForm currentTier={current.id} />
    </div>
  );
}
