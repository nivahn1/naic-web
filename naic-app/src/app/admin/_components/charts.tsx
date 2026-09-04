/**
 * Two chart forms cover this dashboard, both plotting magnitude, so both use
 * the single violet ramp from globals.css — no categorical palette is needed.
 * They render as plain elements: hover comes from CSS, so there is no client
 * bundle and no chart library.
 */

const RAMP = [
  "var(--ramp-1)",
  "var(--ramp-2)",
  "var(--ramp-3)",
  "var(--ramp-4)",
  "var(--ramp-5)",
  "var(--ramp-6)",
];

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, 1));
  const short = date.toLocaleDateString(undefined, {
    month: "short",
    timeZone: "UTC",
  });
  return { short, year: String(y).slice(2), isJan: m === 1 };
}

/** Signups per calendar month. One series, so no legend — the title names it. */
export function SignupsChart({
  data,
}: {
  data: { month: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const peak = data.reduce(
    (best, d) => (d.count > best.count ? d : best),
    data[0] ?? { month: "", count: 0 },
  );
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          New members by month
        </p>
        <p className="text-xs text-[var(--muted)]">
          {total.toLocaleString()} in the last 13 months
        </p>
      </div>

      <div className="mt-5 flex h-40 items-end gap-1.5 border-b border-[var(--chart-axis)]">
        {data.map((d) => {
          const isPeak = d.count === peak.count && d.count > 0;
          const { short, year } = monthLabel(d.month);
          return (
            <div
              key={d.month}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--surface-border)] bg-[var(--background)] px-2 py-1 text-[11px] font-medium text-slate-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:text-white">
                {short} {year} · {d.count.toLocaleString()}
              </div>

              {isPeak && (
                <span className="mb-1 text-[11px] font-semibold tabular-nums text-slate-900 dark:text-white">
                  {d.count}
                </span>
              )}

              <div
                className="w-full max-w-6 rounded-t-[4px]"
                style={{
                  // A flat stub keeps an empty month visible and hoverable.
                  height: d.count === 0 ? "2px" : `${(d.count / max) * 100}%`,
                  background:
                    d.count === 0 ? "var(--chart-track)" : "var(--chart-bar)",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-1.5">
        {data.map((d, i) => {
          const { short, year, isJan } = monthLabel(d.month);
          return (
            <div
              key={d.month}
              className="flex-1 text-center text-[10px] leading-tight text-[var(--muted)]"
            >
              {short}
              {(isJan || i === 0) && (
                <span className="block text-[9px] opacity-70">’{year}</span>
              )}
            </div>
          );
        })}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-[var(--muted)] hover:text-slate-900 dark:hover:text-white">
          View as table
        </summary>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th className="py-1 font-medium">Month</th>
              <th className="py-1 text-right font-medium">New members</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.month} className="border-t border-[var(--surface-border)]">
                <td className="py-1">{d.month}</td>
                <td className="py-1 text-right tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

/**
 * Horizontal magnitude bars. `ordinal` walks the violet ramp for rows that
 * have a natural order (membership tiers); everything else gets one hue, so
 * bar length stays the only thing encoding the value.
 */
export function BarList({
  rows,
  ordinal = false,
  emptyLabel = "Nothing here yet.",
}: {
  rows: { label: string; value: number; note?: string }[];
  ordinal?: boolean;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (!rows.length) {
    return <p className="text-sm text-[var(--muted)]">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={row.label} className="group">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-slate-900 dark:text-white">{row.label}</span>
            <span className="shrink-0 tabular-nums text-[var(--muted)]">
              {row.note ? `${row.value} · ${row.note}` : row.value}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-[var(--chart-track)]">
            <div
              className="h-2 rounded-full transition-[width]"
              style={{
                width: `${Math.max(row.value === 0 ? 0 : 3, (row.value / max) * 100)}%`,
                background: ordinal
                  ? RAMP[Math.min(i, RAMP.length - 1)]
                  : "var(--chart-bar)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
