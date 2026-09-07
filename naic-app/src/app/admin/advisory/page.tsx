import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { deleteAdvisoryApplication, setAdvisoryStatus } from "../actions";
import { RowMenu } from "../_components/RowMenu";
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
  formatDateTime,
  type PillTone,
} from "../_components/ui";
import { orIlike, pickFilter, sanitizeQuery, type AdminSearchParams } from "../query";

export const metadata: Metadata = { title: "Advisory Board" };

const STATUSES = ["new", "reviewed", "approved", "archived"] as const;
type Status = (typeof STATUSES)[number];

const TONE: Record<Status, PillTone> = {
  new: "violet",
  reviewed: "slate",
  approved: "green",
  archived: "slate",
};

/** Signed links expire in 10 minutes — long enough to open, short enough not to leak. */
const SIGNED_URL_TTL = 600;

type Application = {
  id: string;
  full_name: string;
  title: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  expertise: string | null;
  message: string;
  bio_path: string;
  headshot_path: string;
  review_status: Status;
  created_at: string;
};

function FileLink({
  href,
  label,
}: {
  href: string | undefined;
  label: string;
}) {
  if (!href) {
    return (
      <span className="text-xs text-[var(--muted)]" title="File missing from storage">
        {label} unavailable
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--surface-border)] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-violet-400/50 hover:text-white"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v8m0 0L5 7m3 3 3-3" />
        <path d="M2.5 11v2A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5v-2" />
      </svg>
      {label}
    </a>
  );
}

export default async function AdvisoryPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const { q, status, notice, error } = await searchParams;
  const term = sanitizeQuery(q);
  const filter = pickFilter(status, STATUSES);

  const supabase = await createClient();

  let query = supabase
    .from("advisory_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter) query = query.eq("review_status", filter);
  if (term) {
    query = query.or(orIlike(["full_name", "email", "company", "expertise"], term));
  }

  const [rowsRes, allRes] = await Promise.all([
    query.limit(500),
    supabase.from("advisory_applications").select("review_status"),
  ]);

  const rows = (rowsRes.data ?? []) as Application[];
  const all = (allRes.data ?? []) as { review_status: Status }[];
  const countBy = (s: Status) => all.filter((r) => r.review_status === s).length;

  // One signed-URL round trip for every file on the page. The bucket is
  // private; these links are what make the bios and headshots readable, and
  // only an admin can mint them (see the storage policy in schema.sql).
  const paths = rows.flatMap((r) => [r.bio_path, r.headshot_path]);
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await supabase.storage
      .from("advisory-applications")
      .createSignedUrls(paths, SIGNED_URL_TTL);
    for (const entry of data ?? []) {
      if (entry.signedUrl && entry.path) signed.set(entry.path, entry.signedUrl);
    }
  }

  return (
    <div>
      <PageTitle
        title="Advisory Board"
        lead="Applications to join the Advisory Board, with their bio and headshot."
        action={<ExportButton table="advisory" />}
      />

      <Flash notice={notice} error={error ?? rowsRes.error?.message} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total applications" value={all.length.toLocaleString()} />
        <StatCard
          label="Awaiting review"
          value={countBy("new").toLocaleString()}
          hint="not yet triaged"
        />
        <StatCard label="Approved" value={countBy("approved").toLocaleString()} />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/admin/advisory"
          current={filter}
          q={term || undefined}
          options={[
            { value: "", label: "All", count: all.length },
            { value: "new", label: "New", count: countBy("new") },
            { value: "reviewed", label: "Reviewed", count: countBy("reviewed") },
            { value: "approved", label: "Approved", count: countBy("approved") },
            { value: "archived", label: "Archived", count: countBy("archived") },
          ]}
        />
      </div>

      <Card className="mt-4">
        <Table>
          <thead>
            <tr>
              <Th>Applicant</Th>
              <Th>Expertise</Th>
              <Th>Files</Th>
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
                    ? "No applications match that search."
                    : "No applications yet."
                }
              />
            )}
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-white/[0.03]">
                <Td>
                  <div className="flex items-start gap-3">
                    <Avatar name={row.full_name} />
                    <div className="min-w-0">
                      <p className="font-medium text-white">{row.full_name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {[row.title, row.company].filter(Boolean).join(" · ") || "—"}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{row.email}</p>
                      {row.phone && (
                        <p className="text-xs text-[var(--muted)]">{row.phone}</p>
                      )}
                      <details className="mt-2 max-w-md">
                        <summary className="cursor-pointer text-xs font-semibold text-violet-300 hover:text-violet-200">
                          Message
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[var(--muted)]">
                          {row.message}
                        </p>
                      </details>
                    </div>
                  </div>
                </Td>
                <Td className="max-w-[14rem] text-xs text-[var(--muted)]">
                  {row.expertise || "—"}
                </Td>
                <Td>
                  <div className="flex flex-col items-start gap-1.5">
                    <FileLink href={signed.get(row.bio_path)} label="Bio" />
                    <FileLink href={signed.get(row.headshot_path)} label="Headshot" />
                  </div>
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
                    redirectTo="/admin/advisory"
                    items={[
                      {
                        group: "Set status",
                        label: "Mark reviewed",
                        action: setAdvisoryStatus,
                        fields: { review_status: "reviewed" },
                      },
                      {
                        group: "Set status",
                        label: "Approve",
                        action: setAdvisoryStatus,
                        fields: { review_status: "approved" },
                      },
                      {
                        group: "Set status",
                        label: "Archive",
                        action: setAdvisoryStatus,
                        fields: { review_status: "archived" },
                      },
                      {
                        group: "Set status",
                        label: "Reset to new",
                        action: setAdvisoryStatus,
                        fields: { review_status: "new" },
                      },
                      {
                        group: "Danger zone",
                        label: "Delete application",
                        action: deleteAdvisoryApplication,
                        danger: true,
                        confirmLabel: "Deletes the files too",
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
