import { getNominations } from "@/lib/admin";
import { Badge, Card, EmptyState, formatDate } from "../_components/ui";

export const metadata = { title: "Nominations" };

export default async function NominationsPage() {
  const nominations = await getNominations();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Award nominations
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {nominations.length.toLocaleString()} submitted
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Everything submitted through the public Recognition form, newest first.
      </p>

      <div className="mt-6 space-y-4">
        {nominations.map((n) => (
          <Card key={n.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {n.nominee_name}
              </h2>
              <span className="text-xs text-[var(--muted)]">
                {formatDate(n.created_at)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {[n.nominee_title, n.nominee_company].filter(Boolean).join(" · ") ||
                "No title given"}
              {" — "}
              <a
                href={`mailto:${n.nominee_email}`}
                className="text-violet-600 hover:underline dark:text-violet-300"
              >
                {n.nominee_email}
              </a>
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {n.awards.map((award) => (
                <Badge key={award} tone="violet">
                  {award}
                </Badge>
              ))}
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
              {n.rationale}
            </p>

            <p className="mt-4 border-t border-[var(--surface-border)] pt-3 text-xs text-[var(--muted)]">
              Nominated by {n.nominator_name}
              {n.nominator_company ? `, ${n.nominator_company}` : ""} ·{" "}
              <a
                href={`mailto:${n.nominator_email}`}
                className="text-violet-600 hover:underline dark:text-violet-300"
              >
                {n.nominator_email}
              </a>
            </p>
          </Card>
        ))}

        {!nominations.length && (
          <EmptyState>
            No nominations yet. They’ll appear here as soon as the Recognition
            form is used.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
