import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  Card,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "AI Weeks",
  description:
    "Nationwide week-long initiatives exploring leadership, emerging talent, inclusion, and the impact of artificial intelligence.",
};

const WEEKS = [
  {
    name: "National AI Emerging Leaders Week™",
    when: "April 20–24, 2026",
    body: "A nationwide initiative designed to empower the next generation of innovators, strategists, and professionals shaping the future of AI. Through panels, mentorship sessions, and interactive learning, students and early-career professionals develop skills in leadership, innovation, and responsible AI use — and connect with established leaders.",
  },
  {
    name: "AI Leadership Week™",
    when: "May 11–14, 2026",
    body: "A focused initiative equipping current and future leaders with the vision, strategy, and skills to guide organizations in the age of AI. Executives, policymakers, entrepreneurs, and innovators explore responsible governance, ethical decision-making, and the practical integration of AI into enterprise strategy.",
  },
  {
    name: "National AI Women's Week™",
    when: "March 9–13, 2026",
    body: "Celebrates the leadership, achievements, and contributions of women shaping the future of artificial intelligence. Keynote sessions, workshops, and mentorship forums highlight women's impact and foster professional networks.",
  },
  {
    name: "National AI Week™",
    when: "November 16–20, 2026",
    body: "A nationwide initiative to explore the impact, opportunities, and challenges of artificial intelligence. Designed to engage students, educators, businesses, and policymakers, it offers a platform for discussion, education, and inspiration around ethical and inclusive AI development.",
  },
  {
    name: "National Multicultural AI Week™",
    when: "2026",
    body: "Recognizes the global and cultural dimensions of artificial intelligence, emphasizing the need for systems that reflect diverse worldviews, languages, and experiences.",
  },
];

export default function WeeksPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Weeks"
        title="A week at a time, a nationwide conversation."
        lead="Week-long initiatives that bring the future of AI to students, educators, businesses, and policymakers across the country."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {WEEKS.map((w) => (
            <Card key={w.name} eyebrow={w.when} title={w.name}>
              {w.body}
            </Card>
          ))}
        </div>

        <RelatedLinks
          links={[
            { label: "Celebrations", href: "/celebrations" },
            { label: "Events", href: "/events" },
            { label: "Conferences", href: "/conferences" },
          ]}
        />
      </Section>
    </>
  );
}
