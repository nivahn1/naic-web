import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PageHeader,
  Section,
  SectionTitle,
  CheckList,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { Seal } from "../../_components/Seal";
import { TRAININGS } from "./training";

export const metadata: Metadata = {
  title: "Training",
  description:
    "AI training for professionals, executives, and teams — business transformation, policy and compliance, generative AI, and customized programs.",
};

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Training"
        title="Apply AI effectively within your industry."
        lead="AI training designed to equip professionals, executives, and teams with the knowledge and tools to identify opportunities, manage change, and lead innovation — combining practical application with strategic insight."
      />

      <Section wide>
        <div className="grid gap-x-14 gap-y-20 sm:grid-cols-2">
          {TRAININGS.map((t) => (
            <Link
              key={t.slug}
              href={`/training/${t.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {t.logo ? (
                <div className="flex h-28 w-full max-w-[320px] items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-32 sm:max-w-[380px]">
                  <Image
                    src={t.logo.src}
                    alt={t.name}
                    width={t.logo.width}
                    height={t.logo.height}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <Seal
                  id={t.slug}
                  label={t.name}
                  mark={t.emblem}
                  tone="dark"
                  className="h-52 w-52 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-60 sm:w-60"
                />
              )}
              <h2 className="font-display mt-8 text-xl font-semibold tracking-tight text-white sm:text-2xl dark:text-white">
                {t.name}
              </h2>
              <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-[var(--muted)]">
                {t.blurb}
              </p>
              <span className="font-display mt-4 text-sm font-semibold text-violet-300 underline-offset-4 group-hover:underline dark:text-violet-300">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tint>
        <SectionTitle>Why train with the Consortium</SectionTitle>
        <CheckList
          items={[
            "Practical application — labs, case studies, and prototypes over theory",
            "Industry alignment — content designed with direct input from consortium industry partners",
            "Career growth — training plus certifications plus job-board integration for a full career pathway",
          ]}
        />

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
