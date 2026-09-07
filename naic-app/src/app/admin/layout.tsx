import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "../_components/Logo";
import { signOut } from "../auth/actions";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "./AdminNav";
import { SearchBar } from "./_components/SearchBar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

/** Unreviewed counts for the sidebar badges. `head: true` fetches no rows. */
async function pendingCounts() {
  const supabase = await createClient();

  const [nominations, advisory, registrations] = await Promise.all([
    supabase
      .from("nominations")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "new"),
    supabase
      .from("advisory_applications")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "new"),
    supabase
      .from("program_registrations")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    "/admin/nominations": nominations.count ?? 0,
    "/admin/advisory": advisory.count ?? 0,
    "/admin/registrations": registrations.count ?? 0,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Renders the 404 page for anyone who isn't an admin — including signed-in
  // members, who learn nothing about this area existing.
  const { user, profile } = await requireAdmin();
  const counts = await pendingCounts();

  const name = profile.full_name || user.email || "Admin";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="grain relative isolate min-h-dvh bg-[#00004d] text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(90%_60%_at_75%_-10%,#3d1d7a_0%,#150d33_45%,#00004d_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-52 top-24 -z-10 h-[32rem] w-[32rem] rounded-full bg-violet-600/15 blur-[140px]"
      />

      <div className="mx-auto flex max-w-[110rem] gap-0 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-[264px] shrink-0 lg:block">
          <div className="sticky top-0 flex h-dvh flex-col py-6">
            <Link href="/admin" className="flex items-center px-2">
              <Logo className="h-9" />
            </Link>

            <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
              <AdminNav counts={counts} />
            </div>

            <div className="mt-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-xs font-semibold text-white"
                >
                  {initials || "A"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{name}</p>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {user.email}
                  </p>
                </div>
              </div>
              <form action={signOut} className="mt-3">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-violet-400/50 hover:text-white"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1 pb-16">
          <header className="sticky top-0 z-30 -mx-4 mb-2 border-b border-[var(--surface-border)] bg-[#00004d]/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-4">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center lg:hidden">
                <Logo className="h-8" />
              </Link>
              <Suspense fallback={<div className="h-10 w-full max-w-md" />}>
                <SearchBar />
              </Suspense>
              <span className="ml-auto hidden items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--muted)] sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                Admin access
              </span>
              <form action={signOut} className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-200"
                >
                  Sign out
                </button>
              </form>
            </div>

            {/* Sidebar collapses to a scrolling strip below lg. */}
            <div className="-mx-4 mt-3 overflow-x-auto px-4 lg:hidden">
              <div className="w-max [&_nav]:flex [&_nav]:items-center [&_nav]:gap-1 [&_nav]:pb-1 [&_nav>div]:flex [&_nav>div]:items-center [&_nav>div]:gap-1 [&_nav_p]:hidden [&_nav_ul]:flex [&_nav_ul]:gap-1 [&_nav_ul]:space-y-0">
                <AdminNav counts={counts} />
              </div>
            </div>
          </header>

          <main className="pt-4 lg:pt-2">{children}</main>
        </div>
      </div>
    </div>
  );
}
