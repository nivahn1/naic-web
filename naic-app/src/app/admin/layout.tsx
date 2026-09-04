import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "../_components/Logo";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../auth/actions";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirects anyone who isn't a registered admin. proxy.ts turns them away
  // first; this is the check that can't be skipped.
  const { user, profile } = await requireAdmin();

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--surface-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              National AI Consortium
            </span>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              {user.email}
            </span>
            <Link
              href="/portal"
              className="rounded-lg border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-violet-400/50 dark:text-slate-200"
            >
              Member portal
            </Link>
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
                {profile?.full_name || "Administrator"}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                Consortium admin
              </p>
            </div>
            <div className="mt-3">
              <AdminNav />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
