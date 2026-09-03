export type EventItem = {
  slug: string;
  name: string;
  /** ISO date, UTC. `end` only when the event runs more than one day. */
  start: string;
  end?: string;
  theme: string;
  body: string;
  /** The event's own site, where it has one. */
  href?: string;
};

export const EVENTS: EventItem[] = [
  {
    slug: "convention",
    name: "National AI Convention™",
    start: "2026-01-20",
    end: "2026-01-21",
    theme: "Strategic Minds, Intelligent Futures",
    body: "The premier annual gathering for AI professionals, leaders, and organizations. A dynamic agenda of workshops, expert panels, and networking events highlighting the latest advancements in AI technology and their impact across industries, with high-level discussions on strategy and future workforce trends.",
  },
  {
    slug: "symposium",
    name: "National AI Symposium™",
    start: "2026-02-11",
    theme: "Advancing Intelligence: Innovation, Impact & Infrastructure",
    body: "A signature event offering in-depth learning on AI trends, ethics, and transformative technologies. Keynote speakers, breakout sessions, and live demonstrations give a comprehensive look at the evolving AI landscape, with an emphasis on practical applications and strategic implementation in business and society.",
  },
  {
    slug: "forum",
    name: "National AI Forum™",
    start: "2026-10-14",
    theme: "Voices Shaping the Future of Artificial Intelligence",
    body: "Brings AI professionals, industry experts, and leaders together for focused discussions on the future of artificial intelligence. Panel discussions, expert roundtables, and networking explore responsible AI, innovation, and industry-specific applications.",
    href: "https://nationalaiforum.com",
  },
  {
    slug: "multicultural-symposium",
    name: "National AI Multicultural Symposium™",
    start: "2026-11-04",
    theme: "Innovation at the Frontiers of AI Research",
    body: "Celebrates the contributions and perspectives of professionals from various cultural backgrounds who are shaping the future of AI. Keynote sessions, panels, and workshops explore emerging technologies, leadership development, and cross-industry collaboration.",
    href: "https://aimulticultural.com",
  },
];

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

function utc(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

/** "Jan 20–21" / "Feb 11" / "Jan 30 – Feb 2", plus the year, for the date rail. */
export function eventDateParts(event: EventItem) {
  const start = utc(event.start);
  const end = event.end ? utc(event.end) : null;
  const startMonth = MONTH.format(start);

  const day =
    end && MONTH.format(end) !== startMonth
      ? `${startMonth} ${start.getUTCDate()} – ${MONTH.format(
          end,
        )} ${end.getUTCDate()}`
      : end
        ? `${startMonth} ${start.getUTCDate()}–${end.getUTCDate()}`
        : `${startMonth} ${start.getUTCDate()}`;

  return { day, year: String(start.getUTCFullYear()) };
}

/**
 * Split into upcoming and past, each in date order. `now` is passed in so the
 * page decides when "today" is rather than the module load time.
 */
export function splitEvents(now: Date) {
  const today = utc(now.toISOString().slice(0, 10)).getTime();
  const byDate = [...EVENTS].sort((a, b) => a.start.localeCompare(b.start));

  const isPast = (e: EventItem) => utc(e.end ?? e.start).getTime() < today;

  return {
    upcoming: byDate.filter((e) => !isPast(e)),
    past: byDate.filter(isPast).reverse(),
  };
}
