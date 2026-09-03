import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  Card,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The National AI Convention, Forum, Symposium, and Multicultural Symposium — where the AI community meets.",
};

const EVENTS = [
  {
    name: "National AI Convention™",
    when: "January 20–21, 2026",
    theme: "“Strategic Minds, Intelligent Futures”",
    body: "The premier annual gathering for AI professionals, leaders, and organizations. A dynamic agenda of workshops, expert panels, and networking events highlighting the latest advancements in AI technology and their impact across industries, with high-level discussions on strategy and future workforce trends.",
  },
  {
    name: "National AI Symposium™",
    when: "February 11, 2026",
    theme: "“Advancing Intelligence: Innovation, Impact & Infrastructure”",
    body: "A signature event offering in-depth learning on AI trends, ethics, and transformative technologies. Keynote speakers, breakout sessions, and live demonstrations give a comprehensive look at the evolving AI landscape, with an emphasis on practical applications and strategic implementation in business and society.",
  },
  {
    name: "National AI Forum™",
    when: "October 14, 2026",
    theme: "“Voices Shaping the Future of Artificial Intelligence”",
    body: "Brings AI professionals, industry experts, and leaders together for focused discussions on the future of artificial intelligence. Panel discussions, expert roundtables, and networking explore responsible AI, innovation, and industry-specific applications.",
  },
  {
    name: "National AI Multicultural Symposium™",
    when: "November 4, 2026",
    theme: "“Innovation at the Frontiers of AI Research”",
    body: "Celebrates the contributions and perspectives of professionals from various cultural backgrounds who are shaping the future of AI. Keynote sessions, panels, and workshops explore emerging technologies, leadership development, and cross-industry collaboration.",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Where the AI community meets."
        lead="A distinguished lineup of events designed to advance knowledge, collaboration, and innovation in artificial intelligence — each a platform for learning, connection, and strategic dialogue."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {EVENTS.map((e) => (
            <Card key={e.name} eyebrow={e.when} title={e.name}>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                {e.theme}
              </p>
              <p className="mt-2">{e.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <SectionTitle>More ways the community convenes</SectionTitle>
          <Lead>
            Beyond the flagship events, the Consortium runs a full calendar of
            conferences, nationwide AI Weeks, and month-long celebrations
            throughout the year.
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
