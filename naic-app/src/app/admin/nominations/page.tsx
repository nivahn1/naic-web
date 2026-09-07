import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { deleteNomination, setNominationStatus } from "../actions";
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
  type PillTone,
} from "../_components/ui";
import { orIlike, pickFilter, sanitizeQuery, type AdminSearchParams } from "../query";

export const metadata: Metadata = { title: "Nominations" };

const STATUSES = ["new", "reviewed", "shortlisted", "archived"] as const;
type Status = (typeof STATUSES)[number];

const TONE: Record<Status, PillTone> = {
  new: "violet",
  reviewed: "slate",
  shortlisted: "green",
  archived: "slate",
};

type Nomination = {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_company: string | null;
  nominee_email: string;
  nominee_phone: string | null;
  nominator_name: string;
  nominator_title: string | null;
  nominator_company: string | null;
  nominator_email: string;
  awards: string[];
  rationale: string;
  review_status: Status;
  created_at: string;
};

export default async function NominationsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const { q, status, notice, error } = await searchParams;
  const term = sanitizeQuery(q);
  const filter = pickFilter(status, STATUSES);

  const supabase = await createClient();

  let query = supabase
    .from("nominations")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter) query = query.eq("review_status", filter);
  if (term) {
    query = query.or(
      orIlike(
        ["nominee_name", "nominee_company", "nominee_email", "nominator_name"],
        term,
      ),
    );
  }

  const [rowsRes, allRes] = await Promise.all([
    query.limit(500),
    supabase.from("nominations").select("review_status"),
  ]);

  const rows = (rowsRes.data ?? []) as Nomination[];
  const all = (allRes.data ?? []) as { review_status: Status }[];
  const countBy = (s: Status) => all.filter((r) => r.review_status === s).length;

  return (
    <div>
      <PageTitle
        title="Nominations"
        lead="Award nominations submitted from the Recognition page."
        action={<ExportButton table="nominations" />}
      />

      <Flash notice={notice} error={error ?? rowsRes.error?.message} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total nominations" value={all.length.toLocaleString()} />
        <StatCard
          label="Awaiting review"
          value={countBy("new").toLocaleString()}
          hint="not yet triaged"
        />
        <StatCard
          label="Shortlisted"
          value={countBy("shortlisted").toLocaleString()}
        />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/admin/nominations"
          current={filter}
          q={term || undefined}
          options={[
            { value: "", label: "All", count: all.length },
            { value: "new", label: "New", count: countBy("new") },
            { value: "reviewed", label: "Reviewed", count: countBy("reviewed") },
            {
              value: "shortlisted",
              label: "Shortlisted",
              count: countBy("shortlisted"),
            },
            { value: "archived", label: "Archived", count: countBy("archived") },
          ]}
        />
      </div>

      <Card className="mt-4">
        <Table>
          <thead>
            <tr>
              <Th>Nominee</Th>
              <Th>Awards</Th>
              <Th>Nominated by</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
              <Th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <EmptyRow
                colSpan={6}
                message={
                  term || filter
                    ? "No nominations match that search."
                    : "No nominations yet."
                }
              />
            )}
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/[0.03]">
                <Td>
                  <p className="font-medium text-white">{row.nominee_name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {[row.nominee_title, row.nominee_company]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{row.nominee_email}</p>
                  <details className="mt-2 max-w-md">
                    <summary className="cursor-pointer text-xs font-semibold text-violet-300 hover:text-violet-200">
                      Rationale
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[var(--muted)]">
                      {row.rationale}
                    </p>
                  </details>
                </Td>
                <Td>
                  <div className="flex max-w-[16rem] flex-wrap gap-1.5">
                    {row.awards.map((award) => (
                      <span
                        key={award}
                        className="rounded-full border border-[var(--surface-border)] px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <p className="text-sm text-white">{row.nominator_name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {row.nominator_company || "—"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {row.nominator_email}
                  </p>
                </Td>
                <Td>
                  <Pill tone={TONE[row.review_status] ?? "slate"}>
                    {row.review_status}
                  </Pill>
                </Td>
                <Td className="whitespace-nowrap text-xs text-[var(--muted)]">
                  {formatDateTime(row.created_at)}
                </Td>
                <Td className="text-right">
                  <RowMenu
                    id={row.id}
                    redirectTo="/admin/nominations"
                    items={[
                      {
                        group: "Set status",
                        label: "Mark reviewed",
                        action: setNominationStatus,
                        fields: { review_status: "reviewed" },
                      },
                      {
                        group: "Set status",
                        label: "Shortlist",
                        action: setNominationStatus,
                        fields: { review_status: "shortlisted" },
                      },
                      {
                        group: "Set status",
                        label: "Archive",
                        action: setNominationStatus,
                        fields: { review_status: "archived" },
                      },
                      {
                        group: "Set status",
                        label: "Reset to new",
                        action: setNominationStatus,
                        fields: { review_status: "new" },
                      },
                      {
                        group: "Danger zone",
                        label: "Delete nomination",
                        action: deleteNomination,
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
