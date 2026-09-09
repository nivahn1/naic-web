import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TIERS, getTier } from "@/lib/tiers";
import { BarChart, Donut, type BarDatum } from "./_components/charts";
import {
  Card,
  CardHeader,
  PageTitle,
  Pill,
  StatCard,
  formatDateTime,
  formatMoney,
} from "./_components/ui";

const DAY = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 14;

/** Percent change between this period and the one before it. */
function delta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

/** "AI Ethics Program" / "AI Ethics Program +2" — a registration can cover several. */
function summarise(names: string[] | null | undefined) {
  if (!names || names.length === 0) return "—";
  return names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`;
}

function since(now: Date, days: number) {
  return new Date(now.getTime() - days * DAY).toISOString();
}

const TIER_COLORS: Record<string, string> = {
  free: "#64748b",
  bronze: "#b45309",
  silver: "#94a3b8",
  gold: "#eab308",
  platinum: "#7c3aed",
  diamond: "#d946ef",
};

type ActivityItem = {
  id: string;
  at: string;
  kind: string;
  who: string;
  detail: string;
  href: string;
  tone: "violet" | "green" | "amber" | "slate";
};

export default async function AdminDashboard() {
  // One clock read for the whole render, so the 14-day chart and the 30-day
  // deltas can't disagree across a midnight boundary.
  const now = new Date();
  const supabase = await createClient();

  const [
    profilesRes,
    registrationsRes,
    certificationsRes,
    nominationsRes,
    advisoryRes,
  ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, membership_tier, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("program_registrations")
        .select("id, program_names, full_name, amount_cents, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("certification_registrations")
        .select("id, certification_names, full_name, amount_cents, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("nominations")
        .select("id, nominee_name, nominator_name, review_status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("advisory_applications")
        .select("id, full_name, company, review_status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  const profiles = profilesRes.data ?? [];
  const registrations = registrationsRes.data ?? [];
  const certifications = certificationsRes.data ?? [];
  const nominations = nominationsRes.data ?? [];
  const advisory = advisoryRes.data ?? [];

  /* ------------------------------------------------------------- headline */

  const last30 = since(now, 30);
  const prior30 = since(now, 60);

  const inWindow = <T extends { created_at: string }>(
    rows: T[],
    from: string,
    to?: string,
  ) => rows.filter((r) => r.created_at >= from && (!to || r.created_at < to));

  const memberDelta = delta(
    inWindow(profiles, last30).length,
    inWindow(profiles, prior30, last30).length,
  );
  const registrationDelta = delta(
    inWindow([...registrations, ...certifications], last30).length,
    inWindow([...registrations, ...certifications], prior30, last30).length,
  );

  // Programs and certifications are two checkout flows into two tables; the
  // money tiles have to span both or they quietly understate revenue.
  const allSales = [...registrations, ...certifications];
  const paid = allSales.filter((r) => r.status === "paid");
  const revenue = paid.reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);
  const revenueDelta = delta(
    inWindow(paid, last30).reduce((s, r) => s + r.amount_cents, 0),
    inWindow(paid, prior30, last30).reduce((s, r) => s + r.amount_cents, 0),
  );

  const awaiting =
    nominations.filter((n) => n.review_status === "new").length +
    advisory.filter((a) => a.review_status === "new").length;

  /* --------------------------------------------------------------- charts */

  const days: BarDatum[] = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = new Date(now.getTime() - (WINDOW_DAYS - 1 - i) * DAY);
    const key = date.toISOString().slice(0, 10);
    return {
      label: String(date.getDate()),
      sublabel: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: registrations.filter((r) => r.created_at.slice(0, 10) === key)
        .length,
    };
  });

  const tierSegments = TIERS.map((tier) => ({
    label: tier.name,
    value: profiles.filter((p) => p.membership_tier === tier.id).length,
    color: TIER_COLORS[tier.id],
  }));

  /* ------------------------------------------------------------- activity */

  const activity: ActivityItem[] = [
    ...registrations.slice(0, 8).map((r) => ({
      id: `reg-${r.id}`,
      at: r.created_at,
      kind: "Registration",
      who: r.full_name,
      detail: `${summarise(r.program_names)} · ${formatMoney(r.amount_cents)}`,
      href: "/admin/registrations",
      tone: (r.status === "paid"
        ? "green"
        : r.status === "pending"
          ? "amber"
          : "slate") as ActivityItem["tone"],
    })),
    ...certifications.slice(0, 8).map((c) => ({
      id: `cert-${c.id}`,
      at: c.created_at,
      kind: "Certification",
      who: c.full_name,
      detail: `${summarise(c.certification_names)} · ${formatMoney(c.amount_cents)}`,
      href: "/admin/certifications",
      tone: (c.status === "paid"
        ? "green"
        : c.status === "pending"
          ? "amber"
          : "slate") as ActivityItem["tone"],
    })),
    ...profiles.slice(0, 8).map((p) => ({
      id: `mem-${p.id}`,
      at: p.created_at,
      kind: "New member",
      who: p.full_name || p.email || "Member",
      detail: `${getTier(p.membership_tier).name} plan`,
      href: "/admin/members",
      tone: "violet" as const,
    })),
    ...nominations.slice(0, 8).map((n) => ({
      id: `nom-${n.id}`,
      at: n.created_at,
      kind: "Nomination",
      who: n.nominee_name,
      detail: `Nominated by ${n.nominator_name}`,
      href: "/admin/nominations",
      tone: "slate" as const,
    })),
    ...advisory.slice(0, 8).map((a) => ({
      id: `adv-${a.id}`,
      at: a.created_at,
      kind: "Advisory application",
      who: a.full_name,
      detail: a.company || "—",
      href: "/admin/advisory",
      tone: "slate" as const,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 10);

  const totalRegistrationsInWindow = days.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <PageTitle
        title="Dashboard"
        lead="Everything members and visitors have submitted, at a glance."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total members"
          value={profiles.length.toLocaleString()}
          delta={memberDelta}
          hint="vs. previous 30 days"
        />
        <StatCard
          label="Registrations"
          value={(registrations.length + certifications.length).toLocaleString()}
          delta={registrationDelta}
          hint={`${registrations.length} program · ${certifications.length} certification`}
        />
        <StatCard
          label="Revenue collected"
          value={formatMoney(revenue)}
          delta={revenueDelta}
          hint="paid registrations"
        />
        <StatCard
          label="Awaiting review"
          value={awaiting.toLocaleString()}
          hint="nominations & applications"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                Registrations
              </h2>
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                {totalRegistrationsInWindow} in the last {WINDOW_DAYS} days
              </p>
            </div>
            <span className="rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
              Daily
            </span>
          </div>
          <div className="mt-6">
            <BarChart data={days} unit=" registrations" id="reg" />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-white">
            Membership mix
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Plan selected in the member portal
          </p>
          <div className="mt-6">
            <Donut
              segments={tierSegments}
              total={profiles.length}
              caption="Total members"
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Recent activity"
          action={
            <Link
              href="/admin/registrations"
              className="text-xs font-semibold text-violet-300 hover:text-violet-200"
            >
              View registrations →
            </Link>
          }
        />
        {activity.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-[var(--muted)]">
            Nothing has come in yet. Submissions from the public site will
            appear here.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--surface-border)]">
            {activity.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-white/[0.04]"
                >
                  <Pill tone={item.tone}>{item.kind}</Pill>
                  <span className="text-sm font-medium text-white">
                    {item.who}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {item.detail}
                  </span>
                  <span className="ml-auto whitespace-nowrap text-xs text-[var(--muted)]">
                    {formatDateTime(item.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
