import { WEBINARS } from "../webinars/webinars";
import { EVENTS } from "../events/events";
import { CONFERENCES } from "../conferences/conferences";
import { WEEKS } from "../weeks/weeks";
import { CELEBRATIONS } from "../celebrations/celebrations";

export type ScheduleCategory =
  | "webinar"
  | "event"
  | "conference"
  | "week"
  | "celebration";

export const CATEGORY_LABELS: Record<ScheduleCategory, string> = {
  webinar: "Webinars",
  event: "Events",
  conference: "Conferences",
  week: "AI Weeks",
  celebration: "Celebrations",
};

/** Display order for both the filter chips and the "by category" grouping. */
export const CATEGORY_ORDER: ScheduleCategory[] = [
  "webinar",
  "event",
  "conference",
  "week",
  "celebration",
];

export type ScheduleItem = {
  category: ScheduleCategory;
  slug: string;
  name: string;
  /** ISO date, UTC. Undefined means the date hasn't been announced yet. */
  start?: string;
  end?: string;
  description: string;
  priceLabel: string;
  registerHref: string;
};

export function getScheduleItems(): ScheduleItem[] {
  const items: ScheduleItem[] = [
    ...WEBINARS.map((w): ScheduleItem => ({
      category: "webinar",
      slug: w.slug,
      name: w.title,
      start: w.date,
      description: w.body,
      priceLabel: "$99",
      registerHref: `/webinars/register?webinar=${w.slug}`,
    })),
    ...EVENTS.map((e): ScheduleItem => ({
      category: "event",
      slug: e.slug,
      name: e.name,
      start: e.start,
      end: e.end,
      description: e.body,
      priceLabel: "$149",
      registerHref: `/events/register?event=${e.slug}`,
    })),
    ...CONFERENCES.map((c): ScheduleItem => ({
      category: "conference",
      slug: c.slug,
      name: c.name,
      start: c.start,
      end: c.end,
      description: c.body,
      priceLabel: "$1,199–$1,399",
      registerHref: `/conferences/register?conference=${c.slug}`,
    })),
    ...WEEKS.map((w): ScheduleItem => ({
      category: "week",
      slug: w.slug,
      name: w.name,
      start: w.start,
      end: w.end,
      description: w.body,
      priceLabel: "$599",
      registerHref: `/weeks/register?week=${w.slug}`,
    })),
    ...CELEBRATIONS.map((c): ScheduleItem => ({
      category: "celebration",
      slug: c.slug,
      name: c.name,
      start: c.start,
      end: c.end,
      description: c.body,
      priceLabel: "$2,499",
      registerHref: `/celebrations/register?celebration=${c.slug}`,
    })),
  ];

  // Undated items ("Date TBD") sort to the end, in original order.
  return items.sort((a, b) => {
    if (!a.start && !b.start) return 0;
    if (!a.start) return 1;
    if (!b.start) return -1;
    return a.start.localeCompare(b.start);
  });
}

const MONTH = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const MONTH_DAY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const MONTH_DAY_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "Jan 20, 2026", "Jan 20–21, 2026", or "Apr 20 – May 2, 2026". */
export function scheduleDateLabel(item: ScheduleItem): string {
  if (!item.start) return "Date TBD";

  const start = new Date(`${item.start}T00:00:00Z`);
  if (!item.end || item.end === item.start) {
    return MONTH_DAY_YEAR.format(start);
  }

  const end = new Date(`${item.end}T00:00:00Z`);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();

  return sameMonth
    ? `${MONTH.format(start)} ${start.getUTCDate()}–${end.getUTCDate()}, ${end.getUTCFullYear()}`
    : `${MONTH_DAY.format(start)} – ${MONTH_DAY_YEAR.format(end)}`;
}
