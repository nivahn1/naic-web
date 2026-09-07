import Link from "next/link";
import type { ReactNode } from "react";

/* --------------------------------------------------------------- surfaces */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--surface-border)] px-5 py-4">
      <h2 className="font-display text-base font-semibold text-white">{title}</h2>
      {action}
    </div>
  );
}

export function PageTitle({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{lead}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------- stat tiles */

export function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  /** Percentage change vs. the previous period. Omit when there's no baseline. */
  delta?: number | null;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="font-display mt-2 text-3xl font-semibold tracking-tight text-white tabular-nums">
        {value}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]">
        {typeof delta === "number" && (
          <span
            className={
              delta >= 0
                ? "inline-flex items-center gap-1 font-semibold text-emerald-300"
                : "inline-flex items-center gap-1 font-semibold text-rose-300"
            }
          >
            <svg
              viewBox="0 0 12 12"
              aria-hidden
              className={`h-3 w-3 ${delta >= 0 ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 8.5 4.5 5l2 2L10.5 3" />
              <path d="M10.5 6.5V3H7" />
            </svg>
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        {hint}
      </p>
    </Card>
  );
}

/* ----------------------------------------------------------------- tables */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-[var(--surface-border)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`border-b border-[var(--surface-border)] px-5 py-3.5 align-middle text-slate-200 ${className}`}
    >
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-14 text-center text-sm text-[var(--muted)]"
      >
        {message}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ pills */

const PILL_TONES = {
  green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  slate: "border-white/15 bg-white/5 text-slate-300",
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: PillTone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${PILL_TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ flash */

/** Result banner for the redirect-with-a-message pattern the actions use. */
export function Flash({
  notice,
  error,
}: {
  notice?: string;
  error?: string;
}) {
  if (!notice && !error) return null;
  return (
    <div
      role="status"
      className={
        error
          ? "mt-5 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
          : "mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
      }
    >
      {error ?? notice}
    </div>
  );
}

/* ----------------------------------------------------------------- export */

export function ExportButton({ table, label = "Export CSV" }: { table: string; label?: string }) {
  return (
    <Link
      href={`/admin/export?table=${table}`}
      prefetch={false}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] px-3.5 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-violet-400/50 hover:text-white"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="h-4 w-4"
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
    </Link>
  );
}

/* ------------------------------------------------------------- formatting */

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatMoney(cents: number) {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/* ---------------------------------------------------------------- filters */

/**
 * Status filter chips. Plain links, so filtering works without JavaScript and
 * every view is a shareable URL. The active search term is carried through.
 */
export function FilterTabs({
  basePath,
  param = "status",
  current,
  options,
  q,
}: {
  basePath: string;
  param?: string;
  current: string | null;
  options: { value: string; label: string; count?: number }[];
  q?: string;
}) {
  function hrefFor(value: string) {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (value) search.set(param, value);
    return search.size ? `${basePath}?${search}` : basePath;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = (current ?? "") === option.value;
        return (
          <Link
            key={option.value || "all"}
            href={hrefFor(option.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-violet-400/50 bg-violet-500/20 text-white"
                : "border-[var(--surface-border)] text-[var(--muted)] hover:border-violet-400/40 hover:text-white"
            }`}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className="tabular-nums opacity-70">{option.count}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/** Small avatar chip for name cells. */
export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/70 to-fuchsia-500/60 text-[11px] font-semibold text-white"
    >
      {initials || "?"}
    </span>
  );
}
