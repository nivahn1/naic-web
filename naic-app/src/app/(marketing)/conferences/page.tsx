import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  CheckList,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Conferences",
  description:
    "The Consortium's 2026 conference program — leadership, emerging talent, DEI, women in AI, and the flagship AI National Conference.",
};

const CONFERENCES = [
  {
    name: "AI Leadership Conference™",
    when: "January 20–21, 2026",
    body: "Brings together senior executives, industry pioneers, and thought leaders to explore the transformative impact of AI on business and innovation. Attendees gain insight into emerging technologies, ethical governance, and organizational strategies to future-proof their enterprises.",
    highlights: [
      "Executive-level keynotes and strategic panels",
      "Case studies on successful AI implementation",
      "Discussions on ethical, legal, and societal implications of AI",
      "Tools for fostering AI readiness and digital transformation",
    ],
  },
  {
    name: "National AI Women's Conference™",
    when: "March 24–25, 2026",
    body: "Celebrates and amplifies the contributions of women at the forefront of artificial intelligence, convening innovators, leaders, researchers, and entrepreneurs to spotlight the pivotal role women play in shaping AI's present and future.",
    highlights: [
      "Panels featuring women leaders advancing AI in research, entrepreneurship, and policy",
      "Leadership in AI — mentorship programs, career pathways, and inclusive opportunities",
      "Showcasing startups, projects, and initiatives led by women across AI sectors",
      "Discussions on breaking barriers and creating systemic change for greater representation",
    ],
  },
  {
    name: "National AI Emerging Leaders Conference™",
    when: "April 21–22, 2026",
    body: "A dynamic gathering for rising professionals, students, and early-career talent passionate about shaping the future of AI. Through mentorship, career development sessions, and exposure to cutting-edge innovation, it empowers the next generation of AI trailblazers.",
    highlights: [
      "Interactive workshops on AI skills and career pathways",
      "Speed networking with industry mentors",
      "Emerging trends in AI and innovation challenges",
      "Spotlight on student research and young innovators",
    ],
  },
  {
    name: "AI National Conference™",
    when: "September 15–17, 2026",
    body: "The flagship gathering for professionals, researchers, and innovators driving the future of artificial intelligence across industries — uniting leaders from business, government, academia, and technology to explore AI's most transformative applications and strategic opportunities.",
    highlights: [
      "Expert sessions and panels on AI strategy, innovation, and implementation across sectors",
      "Networking connecting executives, researchers, and entrepreneurs nationwide",
      "Showcases of emerging technologies, case studies, and industry best practices",
      "Discussions on the future of AI workforce development, governance, and innovation ecosystems",
    ],
  },
  {
    name: "AI Diversity, Equity & Inclusion Conference",
    when: "2026",
    body: "Addresses the critical need for fairness, representation, and accessibility in AI design, development, and deployment — spotlighting inclusive innovation, diverse voices in the field, and actionable solutions to prevent bias and build equitable AI systems.",
    highlights: [
      "Panels on algorithmic bias and ethical design",
      "Representation in AI — workforce and leadership",
      "Inclusive data practices and policy frameworks",
      "Voices from underrepresented communities in AI",
    ],
  },
];

export default function ConferencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conferences"
        title="The 2026 conference program."
        lead="From executive leadership to emerging talent, each conference is a platform for learning, connection, and strategic dialogue that drives progress across the AI landscape."
      />

      {CONFERENCES.map((c, i) => (
        <Section key={c.name} tint={i % 2 === 1}>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">
            {c.when}
          </span>
          <SectionTitle>{c.name}</SectionTitle>
          <p className="mt-4 leading-7 text-[var(--muted)]">{c.body}</p>
          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
            Key highlights
          </h3>
          <CheckList items={c.highlights} />
        </Section>
      ))}

      <Section>
        <RelatedLinks
          links={[
            { label: "Events", href: "/events" },
            { label: "AI Weeks", href: "/weeks" },
            { label: "Celebrations", href: "/celebrations" },
            { label: "Membership", href: "/#membership" },
          ]}
        />
      </Section>
    </>
  );
}
