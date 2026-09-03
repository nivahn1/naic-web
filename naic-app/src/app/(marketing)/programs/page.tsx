import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, CtaRow, RelatedLinks } from "../../_components/content";
import { ProgramEmblem } from "./ProgramEmblem";
import { PROGRAMS } from "./programs";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "AI learning and leadership programs — from foundational literacy to ethics, leadership, and college pathways.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Programs"
        title="AI Learning & Leadership Programs"
        lead="Structured learning for every stage of an AI career — blending practical AI education with leadership, ethics, and personal growth."
      />

      <Section wide>
        <div className="grid gap-x-14 gap-y-20 sm:grid-cols-2">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <ProgramEmblem
                program={p}
                className="h-52 w-52 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-60 sm:w-60"
              />
              <h2 className="font-display mt-8 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {p.name}
              </h2>
              <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-[var(--muted)]">
                {p.blurb}
              </p>
              <span className="font-display mt-4 text-sm font-semibold text-violet-600 underline-offset-4 group-hover:underline dark:text-violet-300">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tint>
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
