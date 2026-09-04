import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Section,
  SectionTitle,
  Lead,
  CheckList,
  CtaRow,
  RelatedLinks,
} from "../../../_components/content";
import { Constellation } from "../../../_components/Constellation";
import { Seal } from "../../../_components/Seal";
import { PROGRAMS, getProgram } from "../programs";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  return { title: program.name, description: program.blurb };
}

const HEADING =
  "font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300";

export default async function ProgramPage({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const others = PROGRAMS.filter((p) => p.slug !== program.slug);

  return (
    <>
      <section className="grain relative isolate overflow-hidden bg-[#04041c] text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-30 bg-[radial-gradient(120%_120%_at_50%_-20%,#3d1d7a_0%,#1a0f3e_45%,#04041c_80%)]"
        />
        <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-50" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 pb-16 pt-36 text-center sm:px-8 sm:pb-20 sm:pt-44">
          <Link
            href="/programs"
            className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-violet-300 hover:text-white"
          >
            ← All programs
          </Link>
          <Seal
            id={program.slug}
            label={program.name}
            mark={program.emblem}
            tone="dark"
            className="h-44 w-44 sm:h-52 sm:w-52"
          />
          <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {program.name}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-300/85">
            {program.blurb}
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle>Program overview</SectionTitle>
        <Lead>{program.overview}</Lead>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className={HEADING}>Structure</h2>
            <CheckList items={program.structure} />
          </div>
          {program.modules ? (
            <div>
              <h2 className={HEADING}>Modules</h2>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
                {program.modules.map((m, idx) => (
                  <li key={m} className="flex gap-3">
                    <span className="font-display font-semibold tabular-nums text-slate-400">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>

        <div className="mt-10">
          <h2 className={HEADING}>Participants will gain</h2>
          <CheckList items={program.learn} />
        </div>
      </Section>

      <Section tint wide>
        <SectionTitle>Other programs</SectionTitle>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/programs/${p.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <Seal
                id={p.slug}
                label={p.name}
                mark={p.emblem}
                className="h-32 w-32 transition-transform duration-300 group-hover:-translate-y-1"
              />
              <h3 className="font-display mt-5 text-base font-semibold text-white dark:text-white">
                {p.name}
              </h3>
              <span className="font-display mt-2 text-sm font-semibold text-violet-300 underline-offset-4 group-hover:underline dark:text-violet-300">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <CtaRow
          text={`Join the Consortium to enroll in the next ${program.name} cohort and access member pricing.`}
          actions={[
            { label: "Become a member", href: "/signup", primary: true },
            { label: "Contact us", href: "/about" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "All programs", href: "/programs" },
            { label: "Training", href: "/training" },
            { label: "Certification", href: "/#certification" },
          ]}
        />
      </Section>
    </>
  );
}
