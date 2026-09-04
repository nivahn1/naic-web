import Link from "next/link";
import { getMembers } from "@/lib/admin";
import { getTier } from "@/lib/tiers";
import { Badge, Card, formatDate, formatRelative } from "../_components/ui";

export const metadata = { title: "Members" };

const PAGE_SIZE = 25;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const members = await getMembers({
    search: q,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const total = members[0]?.total_count ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (n: number) =>
    `/admin/members?${new URLSearchParams({ ...(q ? { q } : {}), page: String(n) })}`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Members
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {total.toLocaleString()} {q ? "matching" : "registered"}
        </p>
      </div>

      <form className="mt-5 flex gap-2" action="/admin/members">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email"
          className="w-full max-w-sm rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-violet-400/70 dark:text-white"
        />
        <button
          type="submit"
          className="rounded-xl border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
        >
          Search
        </button>
        {q && (
          <Link
            href="/admin/members"
            className="self-center text-sm text-[var(--muted)] hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] text-left text-xs text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-[var(--surface-border)] last:border-0"
              >
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white">
                      {m.full_name || "—"}
                    </span>
                    {m.role === "admin" && <Badge tone="violet">Admin</Badge>}
                  </span>
                  <span className="block text-xs text-[var(--muted)]">
                    {m.email}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={m.membership_tier === "free" ? "neutral" : "violet"}>
                    {getTier(m.membership_tier).name}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  {m.email_confirmed_at ? (
                    <Badge tone="good">Confirmed</Badge>
                  ) : (
                    <Badge tone="warn">Unconfirmed</Badge>
                  )}
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">
                  {formatDate(m.created_at)}
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">
                  {formatRelative(m.last_sign_in_at)}
                </td>
              </tr>
            ))}
            {!members.length && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--muted)]">
                  {q ? `No members match “${q}”.` : "No members yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {lastPage > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            Page {page} of {lastPage}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={pageHref(page - 1)}
                className="rounded-xl border border-[var(--surface-border)] px-4 py-2 font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
              >
                Previous
              </Link>
            )}
            {page < lastPage && (
              <Link
                href={pageHref(page + 1)}
                className="rounded-xl border border-[var(--surface-border)] px-4 py-2 font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-[var(--muted)]">
        Members are read-only here. Roles and plans are changed in Supabase —
        see the promote snippet at the end of <code>supabase/schema.sql</code>.
      </p>
    </div>
  );
}
