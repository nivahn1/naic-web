import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  CheckList,
  Card,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Training",
  description:
    "AI training for professionals, executives, and teams — business transformation, policy and compliance, generative AI, and customized programs.",
};

const TRAININGS = [
  {
    name: "AI for Business Transformation",
    overview:
      "Practical training for executives, managers, and decision-makers on integrating AI into business strategy and operations.",
    focus: [
      "Identifying opportunities for AI-driven efficiency and growth",
      "Building AI-ready organizational cultures",
      "Case studies in finance, healthcare, retail, and logistics",
    ],
    outcome:
      "Participants learn how to drive innovation and create measurable business impact with AI adoption.",
  },
  {
    name: "AI Policy, Regulation & Compliance",
    overview:
      "A program for policymakers, legal teams, and compliance officers navigating the evolving landscape of AI regulation.",
    focus: [
      "Global AI policy trends and regulatory frameworks",
      "Risk management, data governance, and ethical compliance",
      "Building responsible AI adoption strategies",
    ],
    outcome:
      "Graduates understand how to align AI initiatives with legal requirements and societal expectations.",
  },
  {
    name: "Generative AI & Creative Innovation",
    overview:
      "Training focused on using generative AI tools — LLMs, image models, and multimodal systems — for innovation across industries.",
    focus: [
      "Prompt engineering and workflow optimization",
      "Generative AI in marketing, design, product development, and research",
      "Creative problem-solving using AI augmentation",
    ],
    outcome:
      "Participants develop skills to harness generative AI responsibly and creatively, enhancing productivity and innovation.",
  },
  {
    name: "Customized AI Training",
    overview:
      "Tailored programs for organizations, teams, and individuals based on specific AI needs, industry requirements, and experience levels.",
    focus: [
      "Organizational reskilling and upskilling strategies",
      "Team-focused technical workshops for data, engineering, and operations",
      "Personalized tracks for beginners, mid-career professionals, or advanced practitioners",
    ],
    outcome:
      "Delivered through on-demand modules, hands-on projects, and industry-specific tracks for healthcare, finance, retail, energy, and government.",
  },
];

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Apply AI effectively within your industry."
        lead="AI training designed to equip professionals, executives, and teams with the knowledge and tools to identify opportunities, manage change, and lead innovation — combining practical application with strategic insight."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {TRAININGS.map((t) => (
            <Card key={t.name} title={t.name}>
              <p>{t.overview}</p>
              <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                Key focus areas
              </p>
              <CheckList items={t.focus} />
              <p className="mt-4 border-t border-[var(--surface-border)] pt-3 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Outcome:{" "}
                </span>
                {t.outcome}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <SectionTitle>Why train with the Consortium</SectionTitle>
          <CheckList
            items={[
              "Practical application — labs, case studies, and prototypes over theory",
              "Industry alignment — content designed with direct input from consortium industry partners",
              "Career growth — training plus certifications plus job-board integration for a full career pathway",
            ]}
          />
        </div>

        <CtaRow
          text="Bring a program in-house, or enroll your team in an upcoming cohort."
          actions={[
            {
              label: "Talk to the training team",
              href: "mailto:web@nationalaiconsortium.org?subject=AI%20training%20enquiry",
              primary: true,
            },
            { label: "See programs", href: "/programs" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Programs", href: "/programs" },
            { label: "Services", href: "/services" },
            { label: "Certification", href: "/#certification" },
          ]}
        />
      </Section>
    </>
  );
}
