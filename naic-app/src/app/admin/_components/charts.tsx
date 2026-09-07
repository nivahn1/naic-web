/**
 * Hand-rolled SVG charts. Server components — no chart library, no client
 * JavaScript. Hover detail comes from native <title> tooltips, and every
 * chart carries a text summary for screen readers.
 */

const GRADIENT_FROM = "#d946ef";
const GRADIENT_TO = "#7c3aed";

export type BarDatum = { label: string; value: number; sublabel?: string };

export function BarChart({
  data,
  height = 220,
  unit = "",
  id = "bars",
}: {
  data: BarDatum[];
  height?: number;
  /** Appended to tooltip values, e.g. " registrations". */
  unit?: string;
  /** Unique per chart on the page — SVG gradient ids are document-global. */
  id?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  // Round the axis up to something readable rather than to the raw max.
  const step = max <= 4 ? 1 : Math.ceil(max / 4);
  const top = step * 4;
  const ticks = [4, 3, 2, 1, 0].map((i) => i * step);

  return (
    <div>
      <div className="flex gap-3">
        <div
          className="flex flex-col justify-between py-0.5 text-right text-[11px] tabular-nums text-[var(--muted)]"
          style={{ height }}
          aria-hidden
        >
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            className="absolute inset-0 flex flex-col justify-between"
            aria-hidden
          >
            {ticks.map((t) => (
              <span key={t} className="h-px w-full bg-white/[0.07]" />
            ))}
          </div>

          <div
            className="relative flex items-end gap-[3%]"
            style={{ height }}
            role="img"
            aria-label={data
              .map((d) => `${d.label}: ${d.value}${unit}`)
              .join(", ")}
          >
            <svg width="0" height="0" aria-hidden className="absolute">
              <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GRADIENT_FROM} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={GRADIENT_TO} stopOpacity="0.75" />
                </linearGradient>
              </defs>
            </svg>

            {data.map((d, i) => {
              const pct = (d.value / top) * 100;
              return (
                <div
                  key={`${d.label}-${i}`}
                  className="group relative flex flex-1 items-end justify-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-b from-fuchsia-500/90 to-violet-600/70 transition-[filter] group-hover:brightness-125"
                    style={{ height: `${Math.max(pct, d.value > 0 ? 2 : 0)}%` }}
                    title={`${d.sublabel ?? d.label}: ${d.value}${unit}`}
                  />
                  {d.value === 0 && (
                    <span
                      className="absolute bottom-0 h-px w-full bg-white/10"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex gap-[3%] pl-8">
        {data.map((d, i) => (
          <span
            key={`${d.label}-label-${i}`}
            className="flex-1 text-center text-[11px] text-[var(--muted)]"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export type Segment = { label: string; value: number; color: string };

export function Donut({
  segments,
  total,
  caption,
  size = 200,
}: {
  segments: Segment[];
  total: number;
  caption: string;
  size?: number;
}) {
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const sum = segments.reduce((acc, s) => acc + s.value, 0);

  const arcLength = (value: number) =>
    (sum > 0 ? value / sum : 0) * circumference;

  const visible = segments.filter((s) => s.value > 0);
  const arcs = visible.map((s, i) => ({
    ...s,
    length: arcLength(s.value),
    // Prefix sum rather than a running accumulator: nothing to reassign, and
    // at six segments the extra passes cost nothing.
    offset: visible
      .slice(0, i)
      .reduce((acc, prev) => acc + arcLength(prev.value), 0),
  }));

  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={segments
            .map((s) => `${s.label}: ${s.value}`)
            .join(", ")}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          {arcs.map((a) => (
            <circle
              key={a.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${a.length} ${circumference - a.length}`}
              strokeDashoffset={-a.offset}
            >
              <title>{`${a.label}: ${a.value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold tabular-nums text-white">
            {total.toLocaleString()}
          </span>
          <span className="mt-0.5 text-xs text-[var(--muted)]">{caption}</span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
        {segments.map((s) => (
          <li key={s.label}>
            <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ background: s.color }}
                aria-hidden
              />
              {s.label}
            </span>
            <span className="font-display mt-1 block text-xl font-semibold tabular-nums text-white">
              {s.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
