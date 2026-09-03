import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  Card,
  CheckList,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Recognition",
  description:
    "The AI Excellence Awards and the Consortium's honor lists — Top 50 Chief AI Officers, Top 100 Leaders in AI, and the AI Emerging 100.",
};

const AWARD_CATEGORIES = [
  {
    name: "AI Innovation Award",
    body: "Celebrating individuals and organizations that have introduced groundbreaking AI technologies or applications that have transformed their industries.",
  },
  {
    name: "Ethical AI Leadership Award",
    body: "Honoring those who have demonstrated exceptional leadership in promoting and implementing ethical AI practices.",
  },
  {
    name: "AI Research Impact Award",
    body: "Recognizing significant contributions to AI research that have advanced our understanding of AI and its potential.",
  },
];

const LISTS = [
  {
    name: "Top 50 Chief AI Officers",
    body: "Visionary executives steering the strategic AI agendas of enterprises, startups, and public organizations — building AI centers of excellence, advancing enterprise-wide adoption frameworks, and driving global AI maturity.",
    criteria: [
      "A track record of advancing groundbreaking AI technologies, policies, or frameworks with measurable industry or global impact",
      "Proven leadership guiding organizations, teams, or initiatives that drive strategic AI adoption",
      "Expertise aligning AI programs with corporate goals, innovation pipelines, or public missions",
      "Commitment to ethical, transparent, and responsible AI implementation at scale",
      "Evidence of building sustainable AI practices that future-proof organizations and industries",
      "Recognized thought leadership through speaking, publishing, mentorship, or community contributions",
    ],
  },
  {
    name: "Top 100 Leaders in AI",
    body: "Researchers, practitioners, entrepreneurs, and executives shaping both technical advancement and AI business transformation, with measurable impact across diverse industries, sectors, and communities.",
    criteria: [
      "A track record of advancing impactful AI technologies, frameworks, or solutions with wide-scale influence",
      "Recognized leadership shaping teams, organizations, or industries through AI adoption and innovation",
      "Entrepreneurial drive or research excellence that sets benchmarks for others in the field",
      "Commitment to responsible AI practices ensuring ethical, inclusive, and sustainable deployment",
      "Success translating AI innovation into measurable organizational or societal benefits",
      "Active contributions to the broader AI ecosystem through collaboration, mentorship, or advocacy",
    ],
  },
  {
    name: "AI Emerging 100",
    body: "Early-career professionals and innovators shaping the next wave of AI — talent under 35 or within their first 10 years in the field, representing the entrepreneurial spirit and fresh perspectives redefining its future.",
    criteria: [
      "Early achievements that demonstrate significant promise in advancing AI innovation, research, or applications",
      "Creative, forward-thinking approaches that bring novel perspectives or breakthrough solutions",
      "Leadership potential shown through impactful projects, community engagement, or entrepreneurial ventures",
      "Active contributions to academic, open-source, or industry initiatives in AI",
      "Dedication to responsible and ethical AI practices even in early-stage projects",
      "Recognition by peers, mentors, or organizations as an emerging talent with long-term potential",
    ],
  },
];

export default function RecognitionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        title="Honoring the people advancing AI."
        lead="The National AI Consortium recognizes outstanding contributions to artificial intelligence through its annual awards and honor lists."
      />

      <Section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle>AI Excellence Awards</SectionTitle>
          <p className="text-sm font-medium text-violet-600 dark:text-violet-300">
            Submission deadline · November 7, 2026
          </p>
        </div>
        <Lead>
          These awards recognize individuals and organizations that have made
          significant strides in AI innovation, ethical AI practices, and the
          advancement of AI research — setting a standard for others to follow in
          the pursuit of innovative and responsible AI development.
        </Lead>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {AWARD_CATEGORIES.map((a) => (
            <Card key={a.name} title={a.name}>
              {a.body}
            </Card>
          ))}
        </div>
      </Section>

      {LISTS.map((list, i) => (
        <Section key={list.name} tint={i % 2 === 0}>
          <SectionTitle>{list.name}</SectionTitle>
          <Lead>{list.body}</Lead>
          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
            Selection criteria
          </h3>
          <CheckList items={list.criteria} />
        </Section>
      ))}

      <Section>
        <CtaRow
          text="Nominations and submissions open to members and the wider AI community."
          actions={[
            {
              label: "Submit a nomination",
              href: "mailto:web@nationalaiconsortium.org?subject=Recognition%20nomination",
              primary: true,
            },
            { label: "Become a member", href: "/signup" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Events", href: "/events" },
            { label: "Celebrations", href: "/celebrations" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
