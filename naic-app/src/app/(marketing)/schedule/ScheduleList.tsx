"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  scheduleDateLabel,
  type ScheduleCategory,
  type ScheduleItem,
} from "./schedule";

type Filter = "all" | ScheduleCategory;
type View = "chronological" | "category";

const CATEGORY_BADGE_STYLE: Record<ScheduleCategory, string> = {
  webinar: "bg-fuchsia-500/15 text-fuchsia-300",
  event: "bg-violet-500/15 text-violet-300",
  conference: "bg-amber-500/15 text-amber-300",
  week: "bg-emerald-500/15 text-emerald-300",
  celebration: "bg-sky-500/15 text-sky-300",
};

function ItemRow({ item }: { item: ScheduleItem }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CATEGORY_BADGE_STYLE[item.category]}`}
          >
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="text-xs font-medium text-[var(--muted)]">
            {scheduleDateLabel(item)}
          </span>
        </div>
        <p className="mt-1.5 font-display font-semibold text-white dark:text-white">
          {item.name}
        </p>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {item.description}
        </p>
        <p className="mt-1.5 text-sm font-semibold text-white dark:text-white">
          {item.priceLabel}
        </p>
      </div>
      <Link
        href={item.registerHref}
        className="shrink-0 rounded-xl border border-[var(--surface-border)] px-4 py-2 text-center text-sm font-semibold text-slate-200 transition-colors hover:border-violet-400/50 hover:text-white dark:text-slate-200 dark:hover:text-white"
      >
        Register →
      </Link>
    </li>
  );
}

export function ScheduleList({ items }: { items: ScheduleItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("chronological");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const byCategory = useMemo(() => {
    const groups = new Map<ScheduleCategory, ScheduleItem[]>();
    for (const category of CATEGORY_ORDER) groups.set(category, []);
    for (const item of filtered) groups.get(item.category)!.push(item);
    return groups;
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              filter === "all"
                ? "bg-white text-[#00004d]"
                : "border border-[var(--surface-border)] text-slate-200 hover:border-violet-400/50"
            }`}
          >
            All
          </button>
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                filter === category
                  ? "bg-white text-[#00004d]"
                  : "border border-[var(--surface-border)] text-slate-200 hover:border-violet-400/50"
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 gap-1 rounded-full border border-[var(--surface-border)] p-1">
          {(
            [
              { id: "chronological", label: "Chronological" },
              { id: "category", label: "By type" },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                view === v.id
                  ? "bg-white text-[#00004d]"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--muted)]">
          Nothing in this category right now.
        </p>
      ) : view === "chronological" ? (
        <ul className="mt-8 space-y-3">
          {filtered.map((item) => (
            <ItemRow key={`${item.category}-${item.slug}`} item={item} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 space-y-10">
          {CATEGORY_ORDER.filter((c) => (byCategory.get(c) ?? []).length > 0).map(
            (category) => (
              <div key={category}>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
                  {CATEGORY_LABELS[category]}
                </h2>
                <ul className="mt-4 space-y-3">
                  {byCategory.get(category)!.map((item) => (
                    <ItemRow key={`${item.category}-${item.slug}`} item={item} />
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
