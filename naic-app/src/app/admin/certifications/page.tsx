import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  deleteCertificationRegistration,
  setCertificationStatus,
} from "../actions";
import { RowMenu } from "../_components/RowMenu";
import {
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
  formatDateTime,
  formatMoney,
  type PillTone,
} from "../_components/ui";
import { orIlike, pickFilter, sanitizeQuery, type AdminSearchParams } from "../query";

export const metadata: Metadata = { title: "Certifications" };

const STATUSES = ["pending", "paid", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const TONE: Record<Status, PillTone> = {
  paid: "green",
  pending: "amber",
  cancelled: "rose",
};

type CertificationRegistration = {
  id: string;
  /** These three arrays run in step: slug, display name, and per-item price. */
  certification_slugs: string[];
  certification_names: string[];
  price_cents: number[];
  full_name: string;
  email: string;
  phone: string | null;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  amount_cents: number;
  status: Status;
  stripe_checkout_session_id: string | null;
  created_at: string;
};

export default async function CertificationsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const { q, status, notice, error } = await searchParams;
  const term = sanitizeQuery(q);
  const filter = pickFilter(status, STATUSES);

  const supabase = await createClient();

  let query = supabase
    .from("certification_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter) query = query.eq("status", filter);
  if (term) {
    // certification_names is a text[]; PostgREST has no case-insensitive match
    // into an array, so search covers the registrant only.
    query = query.or(orIlike(["full_name", "email"], term));
  }

  const [rowsRes, allRes] = await Promise.all([
    query.limit(500),
    supabase.from("certification_registrations").select("status, amount_cents"),
  ]);

  const rows = (rowsRes.data ?? []) as CertificationRegistration[];
  const all = (allRes.data ?? []) as Pick<
    CertificationRegistration,
    "status" | "amount_cents"
  >[];

  const countBy = (s: Status) => all.filter((r) => r.status === s).length;
  const paidRevenue = all
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount_cents, 0);

  return (
    <div>
      <PageTitle
        title="Certifications"
        lead="Certification registrations, including those that never finished paying."
        action={<ExportButton table="certifications" />}
      />

      <Flash notice={notice} error={error ?? rowsRes.error?.message} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total registrations"
          value={all.length.toLocaleString()}
          hint="all time"
        />
        <StatCard
          label="Revenue collected"
          value={formatMoney(paidRevenue)}
          hint={`${countBy("paid")} paid`}
        />
        <StatCard
          label="Awaiting payment"
          value={countBy("pending").toLocaleString()}
          hint="started checkout, never confirmed"
        />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/admin/certifications"
          current={filter}
          q={term || undefined}
          options={[
            { value: "", label: "All", count: all.length },
            { value: "paid", label: "Paid", count: countBy("paid") },
            { value: "pending", label: "Pending", count: countBy("pending") },
            { value: "cancelled", label: "Cancelled", count: countBy("cancelled") },
          ]}
        />
      </div>

      <Card className="mt-4">
        <Table>
          <thead>
            <tr>
              <Th>Registrant</Th>
              <Th>Certifications</Th>
              <Th>Billing address</Th>
              <Th className="text-right">Amount</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
              <Th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <EmptyRow
                colSpan={7}
                message={
                  term || filter
                    ? "No certification registrations match that search."
                    : "No certification registrations yet."
                }
              />
            )}
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/[0.03]">
                <Td>
                  <p className="font-medium text-white">{row.full_name}</p>
                  <p className="text-xs text-[var(--muted)]">{row.email}</p>
                  {row.phone && (
                    <p className="text-xs text-[var(--muted)]">{row.phone}</p>
                  )}
                </Td>
                <Td>
                  {row.certification_names.length > 0 ? (
                    <ul className="space-y-0.5">
                      {row.certification_names.map((certName, i) => (
                        <li
                          key={row.certification_slugs[i] ?? certName}
                          className="flex gap-2 text-sm"
                        >
                          <span>{certName}</span>
                          {typeof row.price_cents[i] === "number" && (
                            <span className="text-xs text-[var(--muted)]">
                              {formatMoney(row.price_cents[i])}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">—</p>
                  )}
                  {row.stripe_checkout_session_id && (
                    <p
                      className="mt-0.5 text-xs text-[var(--muted)]"
                      title={row.stripe_checkout_session_id}
                    >
                      Stripe {row.stripe_checkout_session_id.slice(-8)}
                    </p>
                  )}
                </Td>
                <Td className="text-xs text-[var(--muted)]">
                  {row.billing_street}
                  <br />
                  {row.billing_city}, {row.billing_state} {row.billing_zip}
                  {row.billing_country && row.billing_country !== "US" && (
                    <>
                      <br />
                      {row.billing_country}
                    </>
                  )}
                </Td>
                <Td className="text-right font-medium tabular-nums text-white">
                  {formatMoney(row.amount_cents)}
                </Td>
                <Td>
                  <Pill tone={TONE[row.status] ?? "slate"}>{row.status}</Pill>
                </Td>
                <Td className="whitespace-nowrap text-xs text-[var(--muted)]">
                  {formatDateTime(row.created_at)}
                </Td>
                <Td className="text-right">
                  <RowMenu
                    id={row.id}
                    redirectTo="/admin/certifications"
                    items={[
                      {
                        group: "Set status",
                        label: "Mark paid",
                        action: setCertificationStatus,
                        fields: { status: "paid" },
                      },
                      {
                        group: "Set status",
                        label: "Mark pending",
                        action: setCertificationStatus,
                        fields: { status: "pending" },
                      },
                      {
                        group: "Set status",
                        label: "Mark cancelled",
                        action: setCertificationStatus,
                        fields: { status: "cancelled" },
                      },
                      {
                        group: "Danger zone",
                        label: "Delete registration",
                        action: deleteCertificationRegistration,
                        danger: true,
                        confirmLabel: "Click again to delete",
                      },
                    ]}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
