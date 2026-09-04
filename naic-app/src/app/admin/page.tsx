import Link from "next/link";
import { getMembers, getMetrics } from "@/lib/admin";
import { TIERS, getTier } from "@/lib/tiers";
import { BarList, SignupsChart } from "./_components/charts";
import {
  Badge,
  Card,
  Delta,
  EmptyState,
  SectionTitle,
  Stat,
  compact,
  formatDate,
  formatRelative,
  money,
} from "./_components/ui";

export const metadata = { title: "Overview" };

export default async function AdminDashboard() {
  const [metrics, recent] = await Promise.all([
    getMetrics(),
    getMembers({ limit: 6 }),
  ]);

  if (!metrics) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Dashboard
        </h1>
        <div className="mt-6">
          <EmptyState>
            Couldn’t read the metrics functions. Run sections 8 and 9 of{" "}
            <code>supabase/schema.sql</code> against this project, then reload.
          </EmptyState>
        </div>
      </div>
    );
  }

  const { members, accounts, tiers, signups, nominations, advisory } = metrics;

  // Annualised value of the plans members have selected. Selecting a tier in
  // the portal records intent, not payment — so this is pipeline, not revenue.
  const annualised = TIERS.reduce(
    (sum, tier) => sum + (tiers[tier.id] ?? 0) * tier.priceValue,
    0,
  );

  const tierRows = TIERS.map((tier) => ({
    label: tier.name,
    value: tiers[tier.id] ?? 0,
    note: tier.price + "/yr",
  }));

  const awardRows = Object.entries(nominations.awards)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        Dashboard
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Everything the consortium is tracking right now — membership, sign-in
        activity, and what’s come in through the public forms.
      </p>

      {/* Hero figure: the one number this view leads with. */}
      <Card className="mt-6">
        <p className="text-xs font-medium text-[var(--muted)]">Total members</p>
        <p className="mt-1 text-5xl font-semibold tabular-nums leading-none text-slate-900 dark:text-white">
          {compact(members.total)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Delta
            value={members.new_30d - members.prev_30d}
            period="vs the previous 30 days"
          />
          <span className="text-xs text-[var(--muted)]">
            {members.new_7d} joined this week · {members.admins} admin
            {members.admins === 1 ? "" : "s"}
          </span>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="New in 30 days"
          value={members.new_30d}
          delta={{
            value: members.new_30d - members.prev_30d,
            period: "vs prior 30 days",
          }}
        />
        <Stat
          label="Paid plans selected"
          value={members.paid}
          hint={`${members.total - members.paid} on the free plan`}
        />
        <Stat
          label="Signed in (30 days)"
          value={accounts.active_30d}
          hint={`${accounts.never_signed_in} never signed in`}
        />
        <Stat
          label="Annualised plan value"
          value={money(annualised)}
          hint="Selected plans, not payments taken"
        />
      </div>

      <SectionTitle>Membership growth</SectionTitle>
      <Card className="mt-4">
        <SignupsChart data={signups} />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Members by plan
          </p>
          <p className="mt-1 mb-4 text-xs text-[var(--muted)]">
            Free through Diamond, in tier order.
          </p>
          <BarList rows={tierRows} ordinal />
        </Card>

        <Card>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Account health
          </p>
          <p className="mt-1 mb-4 text-xs text-[var(--muted)]">
            Sign-up confirmation and sign-in activity.
          </p>
          <dl className="space-y-3 text-sm">
            <Row label="Confirmed email" value={accounts.confirmed} />
            <Row
              label="Awaiting confirmation"
              value={accounts.unconfirmed}
              tone={accounts.unconfirmed > 0 ? "warn" : undefined}
            />
            <Row label="Active in last 30 days" value={accounts.active_30d} />
            <Row label="Never signed in" value={accounts.never_signed_in} />
          </dl>
        </Card>
      </div>

      <SectionTitle action={{ href: "/admin/nominations", label: "All nominations" }}>
        Submissions
      </SectionTitle>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Award nominations
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {nominations.total}
            </p>
          </div>
          <p className="mt-1 mb-4 text-xs text-[var(--muted)]">
            {nominations.new_30d} in the last 30 days
          </p>
          <BarList
            rows={awardRows}
            emptyLabel="No nominations submitted yet."
          />
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Advisory board applications
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {advisory.total}
            </p>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {advisory.new_30d} in the last 30 days
          </p>
          <Link
            href="/admin/applications"
            className="mt-5 inline-flex rounded-xl border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
          >
            Review applications
          </Link>
        </Card>
      </div>

      <SectionTitle action={{ href: "/admin/members", label: "All members" }}>
        Newest members
      </SectionTitle>
      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--surface-border)] text-left text-xs text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((m) => (
              <tr
                key={m.id}
                className="border-b border-[var(--surface-border)] last:border-0"
              >
                <td className="px-5 py-3">
                  <span className="text-slate-900 dark:text-white">
                    {m.full_name || "—"}
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
                <td className="px-5 py-3 text-[var(--muted)]">
                  {formatDate(m.created_at)}
                </td>
                <td className="px-5 py-3 text-[var(--muted)]">
                  {formatRelative(m.last_sign_in_at)}
                </td>
              </tr>
            ))}
            {!recent.length && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-[var(--muted)]">
                  No members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warn";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd
        className={`tabular-nums font-medium ${
          tone === "warn"
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value.toLocaleString()}
      </dd>
    </div>
  );
}
