import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CheckList,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "AI learning and leadership programs — from foundational literacy to ethics, leadership, and college pathways.",
};

type Program = {
  name: string;
  overview: string;
  structure: string[];
  modules?: string[];
  learn: string[];
};

const PROGRAMS: Program[] = [
  {
    name: "AI Emerging Leadership Program",
    overview:
      "A structured six-month experience designed to build both foundational AI literacy and essential leadership capabilities, combining technical knowledge with leadership development so participants can guide AI conversations and projects early in their careers.",
    structure: [
      "Duration: 6 months — one half-day session per month",
      "Format: Interactive workshops, leadership exercises, applied case studies, and peer collaboration",
      "Certificate awarded upon successful completion of all sessions",
    ],
    modules: [
      "Foundations of AI & Leadership",
      "Machine Learning & Decision-Making",
      "Natural Language Processing & Communication Skills",
      "Generative AI & Creativity in Leadership",
      "Ethics, Collaboration & Responsible AI",
      "Capstone & Future Pathways",
    ],
    learn: [
      "Core AI concepts and their practical applications across industries",
      "Beginner-friendly exposure to machine learning, NLP, and generative AI",
      "Leadership skills — communication, collaboration, and ethical decision-making",
      "How to combine AI literacy with leadership strategies to impact organizations and communities",
    ],
  },
  {
    name: "AI Ethics Program",
    overview:
      "A structured six-month learning experience dedicated to responsible and equitable AI adoption. Each month covers a different module through a half-day seminar, blending theory, case studies, and real-world application.",
    structure: [
      "Duration: 6 months — one half-day seminar per month",
      "Format: Expert-led seminars, interactive discussions, and applied exercises",
      "Certificate awarded upon completion",
    ],
    modules: [
      "Foundations of AI Ethics & Responsible Innovation",
      "Fairness & Bias Mitigation in Data and Models",
      "Transparency & Accountability in AI Systems",
      "AI Governance & Regulatory Compliance",
      "Privacy, Security, and Data Protection in AI",
      "Future of Ethical AI: Balancing Innovation with Social Good",
    ],
    learn: [
      "Practical ethical frameworks and policies for AI",
      "Skills to design, evaluate, and advocate for responsible AI",
      "Recognition as a certified professional in AI Ethics",
    ],
  },
  {
    name: "AI Literacy Essentials Program",
    overview:
      "A beginner-friendly half-day program designed to make artificial intelligence understandable and approachable for everyone — offered monthly, with no prior technical experience required.",
    structure: [
      "Duration: a single half-day session, offered monthly",
      "Format: Presentations, demonstrations, and interactive Q&A",
      "Certificate awarded after completing a designated session",
    ],
    learn: [
      "What AI is, how it works, and why it matters",
      "Real-world AI applications across healthcare, finance, and education",
      "A basic understanding of machine learning and generative AI",
      "Ethical considerations and responsible AI use",
      "Pathways to explore AI tools and resources further",
    ],
  },
  {
    name: "AI College Pathways Program",
    overview:
      "A program designed to cultivate the next generation of AI professionals through learning opportunities, mentorship, and hands-on experience that goes beyond technical training.",
    structure: [
      "Duration: an academic-year cycle with flexible participation",
      "Format: Scholarships, mentorship pairings, and internship placements",
    ],
    learn: [
      "Scholarship access for AI-focused education and research",
      "Mentorship from AI leaders, academics, and industry professionals",
      "Internship opportunities for practical experience",
      "Networking across academia, startups, and enterprises",
      "A platform to showcase research, projects, and leadership potential",
    ],
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="AI Learning & Leadership Programs"
        lead="Structured learning for every stage of an AI career — blending practical AI education with leadership, ethics, and personal growth."
      />

      {PROGRAMS.map((p, i) => (
        <Section key={p.name} tint={i % 2 === 1}>
          <SectionTitle>{p.name}</SectionTitle>
          <Lead>{p.overview}</Lead>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                Structure
              </h3>
              <CheckList items={p.structure} />
            </div>
            {p.modules ? (
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                  Modules
                </h3>
                <ol className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
                  {p.modules.map((m, idx) => (
                    <li key={m} className="flex gap-3">
                      <span className="font-display font-semibold text-slate-400 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
              Participants will gain
            </h3>
            <CheckList items={p.learn} />
          </div>
        </Section>
      ))}

      <Section>
        <CtaRow
          text="Join the Consortium to enroll in a program cohort and access member pricing."
          actions={[
            { label: "Become a member", href: "/signup", primary: true },
            { label: "See training options", href: "/training" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Training", href: "/training" },
            { label: "Services", href: "/services" },
            { label: "Certification", href: "/#certification" },
          ]}
        />
      </Section>
    </>
  );
}
