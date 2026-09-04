import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Celebrations",
  description:
    "National AI Month and National AI Women's Month — month-long celebrations of innovation, responsibility, and leadership in AI.",
};

const CELEBRATIONS = [
  {
    name: "National AI Month™",
    when: "July 15 – August 15",
    theme: "Advancing Innovation, Responsibility, and Opportunity in Artificial Intelligence",
    body: "A nationwide initiative dedicated to exploring the evolving role of artificial intelligence in shaping the future of business, technology, and society. Throughout the month, professionals from all sectors come together to examine key trends in AI development, responsible use, and emerging career pathways. Through webinars, expert panels, and interactive sessions, participants gain insight into real-world applications, ethical considerations, and how to harness AI to drive innovation, productivity, and growth.",
  },
  {
    name: "National AI Women's Month™",
    when: "May 15 – June 15",
    theme: "Celebrating Leadership and Impact in Artificial Intelligence",
    body: "A nationwide initiative recognizing the achievements, leadership, and innovation of women in artificial intelligence — spotlighting women driving advancements in AI research, policy, entrepreneurship, and industry transformation. Through keynote sessions, panels, mentorship forums, and networking events, participants explore strategies for professional growth, leadership development, and innovation. The celebration amplifies women's contributions, highlights groundbreaking work across disciplines, and inspires continued participation in shaping the future of AI.",
  },
];

export default function CelebrationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Celebrations"
        title="Month-long celebrations of AI's people and progress."
        lead="Nationwide observances that bring professionals together around the ideas, the responsibility, and the people advancing artificial intelligence."
      />

      {CELEBRATIONS.map((c, i) => (
        <Section key={c.name} tint={i % 2 === 1}>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            {c.when}
          </span>
          <SectionTitle>{c.name}</SectionTitle>
          <p className="mt-3 font-medium text-slate-200 dark:text-slate-200">
            {c.theme}
          </p>
          <Lead>{c.body}</Lead>
        </Section>
      ))}

      <Section>
        <RelatedLinks
          links={[
            { label: "AI Weeks", href: "/weeks" },
            { label: "Events", href: "/events" },
            { label: "Recognition", href: "/recognition" },
          ]}
        />
      </Section>
    </>
  );
}
