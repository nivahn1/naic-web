import { getAdvisoryApplications, signApplicationFiles } from "@/lib/admin";
import { Card, EmptyState, formatDate } from "../_components/ui";

export const metadata = { title: "Advisory board" };

export default async function ApplicationsPage() {
  const applications = await getAdvisoryApplications();

  // One signing round-trip for every attachment on the page; the links are
  // good for five minutes, which is plenty to open or download them.
  const urls = await signApplicationFiles(
    applications.flatMap((a) => [a.bio_path, a.headshot_path]),
  );

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Advisory board applications
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {applications.length.toLocaleString()} received
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Submissions from the Advisory Board form, with the bio and headshot each
        applicant attached.
      </p>

      <div className="mt-6 space-y-4">
        {applications.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {a.full_name}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {formatDate(a.created_at)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {[a.title, a.company].filter(Boolean).join(" · ") || "No title given"}
            </p>

            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[var(--muted)]">Email</dt>
                <dd>
                  <a
                    href={`mailto:${a.email}`}
                    className="text-violet-600 hover:underline dark:text-violet-300"
                  >
                    {a.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted)]">Phone</dt>
                <dd className="text-slate-900 dark:text-white">
                  {a.phone || "—"}
                </dd>
              </div>
              {a.expertise && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[var(--muted)]">Expertise</dt>
                  <dd className="text-slate-900 dark:text-white">
                    {a.expertise}
                  </dd>
                </div>
              )}
            </dl>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
              {a.message}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--surface-border)] pt-3">
              <FileLink href={urls.get(a.bio_path)} label="Bio" />
              <FileLink href={urls.get(a.headshot_path)} label="Headshot" />
            </div>
          </Card>
        ))}

        {!applications.length && (
          <EmptyState>
            No applications yet. They’ll appear here as the Advisory Board form
            is used.
          </EmptyState>
        )}
      </div>
    </div>
  );
}

function FileLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return (
      <span className="rounded-xl border border-[var(--surface-border)] px-3 py-1.5 text-xs text-[var(--muted)]">
        {label} unavailable
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-xl border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
    >
      Open {label} ↗
    </a>
  );
}
