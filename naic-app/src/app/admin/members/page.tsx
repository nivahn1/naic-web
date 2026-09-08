import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin";
import { TIERS, getTier } from "@/lib/tiers";
import type { Profile } from "@/lib/profile";
import { deleteMember, setMemberRole, setMemberTier } from "../actions";
import { RowMenu, type RowMenuItem } from "../_components/RowMenu";
import {
  Avatar,
  Card,
  EmptyRow,
  ExportButton,
  FilterTabs,
  Flash,
  PageTitle,
  Pill,
  StatCard,
  Table,
  Td,
  Th,
  formatDate,
} from "../_components/ui";
import { orIlike, pickFilter, sanitizeQuery, type AdminSearchParams } from "../query";

export const metadata: Metadata = { title: "Members" };

const FILTERS = ["admin", "member", ...TIERS.map((t) => t.id)] as const;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const { q, status, notice, error } = await searchParams;
  const term = sanitizeQuery(q);
  const filter = pickFilter(status, FILTERS);

  const { user } = await getAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter === "admin" || filter === "member") {
    query = query.eq("role", filter);
  } else if (filter) {
    query = query.eq("membership_tier", filter);
  }
  if (term) query = query.or(orIlike(["full_name", "email"], term));

  const [rowsRes, allRes] = await Promise.all([
    query.limit(500),
    supabase.from("profiles").select("role, membership_tier"),
  ]);

  const rows = (rowsRes.data ?? []) as Profile[];
  const all = (allRes.data ?? []) as Pick<Profile, "role" | "membership_tier">[];

  const adminCount = all.filter((p) => p.role === "admin").length;
  const payingCount = all.filter((p) => p.membership_tier !== "free").length;

  return (
    <div>
      <PageTitle
        title="Members"
        lead="Everyone with an account, their plan, and who can reach this dashboard."
        action={<ExportButton table="members" />}
      />

      <Flash notice={notice} error={error ?? rowsRes.error?.message} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={all.length.toLocaleString()} />
        <StatCard
          label="On a paid plan"
          value={payingCount.toLocaleString()}
          hint={`${all.length - payingCount} on Free`}
        />
        <StatCard
          label="Admins"
          value={adminCount.toLocaleString()}
          hint="can see this dashboard"
        />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/admin/members"
          current={filter}
          q={term || undefined}
          options={[
            { value: "", label: "All", count: all.length },
            { value: "admin", label: "Admins", count: adminCount },
            ...TIERS.map((tier) => ({
              value: tier.id,
              label: tier.name,
              count: all.filter((p) => p.membership_tier === tier.id).length,
            })),
          ]}
        />
      </div>

      <Card className="mt-4">
        <Table>
          <thead>
            <tr>
              <Th>Member</Th>
              <Th>Plan</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <EmptyRow
                colSpan={5}
                message={
                  term || filter
                    ? "No members match that search."
                    : "No members yet."
                }
              />
            )}
            {rows.map((row) => {
              const isSelf = row.id === user?.id;
              const name = row.full_name || row.email || "Member";

              const items: RowMenuItem[] = [
                ...TIERS.map((tier) => ({
                  group: "Change plan",
                  label: tier.name,
                  action: setMemberTier,
                  fields: { membership_tier: tier.id },
                })),
                {
                  group: "Access",
                  label: row.role === "admin" ? "Remove admin access" : "Make admin",
                  action: setMemberRole,
                  fields: { role: row.role === "admin" ? "member" : "admin" },
                },
              ];

              // Self-service demotion and deletion are blocked in the action
              // too; hiding them here just avoids offering a dead end.
              if (!isSelf) {
                items.push({
                  group: "Danger zone",
                  label: "Delete member",
                  action: deleteMember,
                  danger: true,
                  confirmLabel: "Click again to delete",
                });
              }

              return (
                <tr key={row.id} className="transition-colors hover:bg-white/[0.03]">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={name} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium text-white">
                          {name}
                          {isSelf && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                              You
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {row.email ?? "—"}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <p className="text-sm text-white">
                      {getTier(row.membership_tier).name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {getTier(row.membership_tier).price}/yr
                    </p>
                  </Td>
                  <Td>
                    {row.role === "admin" ? (
                      <Pill tone="violet">Admin</Pill>
                    ) : (
                      <Pill tone="slate">Member</Pill>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-[var(--muted)]">
                    {formatDate(row.created_at)}
                  </Td>
                  <Td className="text-right">
                    <RowMenu id={row.id} redirectTo="/admin/members" items={items} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
