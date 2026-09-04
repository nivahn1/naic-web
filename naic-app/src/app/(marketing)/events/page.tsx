import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { EVENTS, eventDateParts, splitEvents, type EventItem } from "./events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The National AI Convention, Forum, Symposium, and Multicultural Symposium — where the AI community meets.",
};

function hostname(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

/** One entry on the date rail: date column, then a dotted line and the detail. */
function TimelineItem({ event, past }: { event: EventItem; past?: boolean }) {
  const { day, year } = eventDateParts(event);

  return (
    <li className={`group flex gap-5 sm:gap-8 ${past ? "opacity-70" : ""}`}>
      <div className="w-20 shrink-0 pt-0.5 text-right sm:w-28">
        <time
          dateTime={event.start}
          className="font-display block text-sm font-semibold tracking-tight text-white sm:text-base dark:text-white"
        >
          {day}
        </time>
        <span className="text-xs text-[var(--muted)] tabular-nums">{year}</span>
      </div>

      <div className="relative border-l border-[var(--surface-border)] pb-14 pl-6 group-last:border-transparent group-last:pb-0 sm:pl-8">
        <span
          aria-hidden
          className={`absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-[var(--background)] ${
            past
              ? "bg-slate-400 dark:bg-slate-600"
              : "bg-gradient-to-br from-fuchsia-500 to-violet-500"
          }`}
        />
        <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl dark:text-white">
          {event.name}
        </h3>
        <p className="mt-1.5 font-medium text-slate-200 dark:text-slate-200">
          &ldquo;{event.theme}&rdquo;
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{event.body}</p>
        {event.href ? (
          <a
            href={event.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display mt-4 inline-block text-sm font-semibold text-violet-300 underline-offset-4 hover:underline dark:text-violet-300"
          >
            {hostname(event.href)} →
          </a>
        ) : null}
      </div>
    </li>
  );
}

export default function EventsPage() {
  const { upcoming, past } = splitEvents(new Date());

  return (
    <>
      <PageHeader
        center
        eyebrow="Events"
        title="Where the AI community meets."
        lead="A distinguished lineup of events designed to advance knowledge, collaboration, and innovation in artificial intelligence — each a platform for learning, connection, and strategic dialogue."
      />

      {upcoming.length ? (
        <Section>
          <SectionTitle>Upcoming</SectionTitle>
          <ol className="mt-10">
            {upcoming.map((e) => (
              <TimelineItem key={e.slug} event={e} />
            ))}
          </ol>
        </Section>
      ) : null}

      {past.length ? (
        <Section tint>
          <SectionTitle>Past events</SectionTitle>
          <Lead>
            Held earlier in the year. Dates for the next cycle are announced as
            they are confirmed.
          </Lead>
          <ol className="mt-10">
            {past.map((e) => (
              <TimelineItem key={e.slug} event={e} past />
            ))}
          </ol>
        </Section>
      ) : null}

      <Section>
        <CtaRow
          text="Join the Consortium for member registration rates and early access to agendas."
          actions={[
            { label: "Become a member", href: "/signup", primary: true },
            { label: "See conferences", href: "/conferences" },
          ]}
        />

        <div className="mt-14">
          <SectionTitle>More ways the community convenes</SectionTitle>
          <Lead>
            Beyond the {EVENTS.length} flagship events, the Consortium runs a
            full calendar of conferences, nationwide AI Weeks, and month-long
            celebrations throughout the year.
          </Lead>
          <RelatedLinks
            links={[
              { label: "Conferences", href: "/conferences" },
              { label: "AI Weeks", href: "/weeks" },
              { label: "Celebrations", href: "/celebrations" },
              { label: "Recognition", href: "/recognition" },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
