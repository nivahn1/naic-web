import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "../_components/Logo";
import { getCurrentProfile } from "@/lib/profile";
import { getTier } from "@/lib/tiers";
import { signOut } from "../auth/actions";
import { PortalNav } from "./PortalNav";

export const metadata: Metadata = {
  title: { default: "Member Portal", template: "%s — Member Portal" },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentProfile();

  // Belt-and-braces: proxy.ts already guards this, but never render the
  // portal shell without a verified user.
  if (!user) redirect("/login?redirect=/portal");

  const tier = getTier(profile?.membership_tier);
  const name = profile?.full_name || user.email || "Member";

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--surface-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              National AI Consortium
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-violet-400/50 dark:text-slate-200"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4">
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                {name}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {tier.name} member
              </p>
            </div>
            <div className="mt-3">
              <PortalNav />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
