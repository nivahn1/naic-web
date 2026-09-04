import Link from "next/link";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mt-10 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
        {children}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-300"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

/**
 * Stat tile: label · value · optional delta against a named period.
 * Growth is good here for every metric on this dashboard, so a rise is always
 * the positive colour.
 */
export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string | number;
  delta?: { value: number; period: string };
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
        {typeof value === "number" ? compact(value) : value}
      </p>
      {delta && <Delta {...delta} />}
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </Card>
  );
}

export function Delta({ value, period }: { value: number; period: string }) {
  if (value === 0) {
    return (
      <p className="mt-1 text-xs text-[var(--muted)]">No change {period}</p>
    );
  }
  const up = value > 0;
  return (
    <p
      className={`mt-1 text-xs font-medium ${
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-amber-600 dark:text-amber-400"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(value)} {period}
    </p>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "violet" | "good" | "warn";
}) {
  const tones = {
    neutral:
      "border-[var(--surface-border)] text-[var(--muted)]",
    violet:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    good: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <Card className="text-center">
      <p className="py-6 text-sm text-[var(--muted)]">{children}</p>
    </Card>
  );
}

/** 1,284 · 12.9K · 4.2M — the stat-tile number format. */
export function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function money(n: number): string {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelative(value: string | null): string {
  if (!value) return "Never";
  const days = Math.floor(
    (Date.now() - new Date(value).getTime()) / 86_400_000,
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;
  return `${Math.floor(days / 365)} yr ago`;
}
