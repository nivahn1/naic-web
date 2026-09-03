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
  title: "Services",
  description:
    "What the National AI Consortium delivers — certification programs, customized training, and a full career pathway.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything you need to adopt AI with confidence."
        lead="The Consortium pairs industry-recognized credentials with hands-on training and job-board integration — a complete pathway from learning to leadership."
      />

      <Section>
        <SectionTitle>AI Certification Programs</SectionTitle>
        <Lead>
          Industry-recognized certifications designed to validate technical
          skills and leadership expertise in AI, endorsed by industry experts and
          aligned with current enterprise adoption needs. Delivered through a
          blend of virtual instruction, labs, and applied assessments.
        </Lead>
        <CheckList
          items={[
            "Core certifications: AI-CP, AI-SP, AI-EP",
            "Advanced tracks: AI for Cloud & Infrastructure, Responsible AI Governance, AI in Business Strategy",
          ]}
        />
      </Section>

      <Section tint>
        <SectionTitle>Customized AI Training</SectionTitle>
        <Lead>
          Tailored training programs for organizations, teams, and individuals
          based on specific AI needs, industry requirements, and experience
          levels.
        </Lead>
        <CheckList
          items={[
            "Organizational programs — reskilling and upskilling strategies to integrate AI across business functions",
            "Team-focused modules — technical workshops to accelerate projects in data, engineering, and operations",
            "Individual pathways — personalized tracks for beginners, mid-career professionals, or advanced practitioners",
          ]}
        />
      </Section>

      <Section>
        <SectionTitle>Key features</SectionTitle>
        <CheckList
          items={[
            "On-demand learning modules — flexible access to recorded sessions, reading materials, and technical labs",
            "Hands-on projects — real-world case studies and sandbox environments for applied learning",
            "Industry-specific training — healthcare, finance, retail, energy, and government-focused AI solutions",
          ]}
        />

        <div className="mt-12">
          <SectionTitle>Why choose our services</SectionTitle>
          <CheckList
            items={[
              "Practical application — move beyond theory with labs, case studies, and prototypes",
              "Industry alignment — content designed with direct input from consortium industry partners",
              "Career growth — training + certifications + job-board integration for a full career pathway",
            ]}
          />
        </div>

        <CtaRow
          text="Talk to us about certification, custom training, or a partnership."
          actions={[
            {
              label: "Contact the Consortium",
              href: "mailto:web@nationalaiconsortium.org?subject=Services%20enquiry",
              primary: true,
            },
            { label: "Become a member", href: "/signup" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Programs", href: "/programs" },
            { label: "Training", href: "/training" },
            { label: "Certification", href: "/#certification" },
          ]}
        />
      </Section>
    </>
  );
}
