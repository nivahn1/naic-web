import type { Metadata } from "next";
import { PageHeader, Section, RelatedLinks } from "../../_components/content";
import { ScheduleList } from "./ScheduleList";
import { getScheduleItems } from "./schedule";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Everything happening this year at the National AI Consortium — webinars, events, conferences, AI Weeks, and celebrations, in one place.",
};

export default function SchedulePage() {
  const items = getScheduleItems();

  return (
    <>
      <PageHeader
        center
        eyebrow="Schedule"
        title="Everything happening this year."
        lead="Webinars, events, conferences, AI Weeks, and celebrations — browse chronologically or by type, and register straight from here."
      />

      <Section wide>
        <ScheduleList items={items} />

        <RelatedLinks
          links={[
            { label: "Webinars", href: "/webinars" },
            { label: "Events", href: "/events" },
            { label: "Conferences", href: "/conferences" },
            { label: "AI Weeks", href: "/weeks" },
            { label: "Celebrations", href: "/celebrations" },
          ]}
        />
      </Section>
    </>
  );
}
