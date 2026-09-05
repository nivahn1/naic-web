import type { Metadata } from "next";
import Image from "next/image";
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
import { TRAININGS, getTraining } from "../training";

export function generateStaticParams() {
  return TRAININGS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const training = getTraining(slug);
  if (!training) return {};
  return { title: training.name, description: training.blurb };
}

const HEADING =
  "font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300";

export default async function TrainingDetailPage({
  params,
}: PageProps<"/training/[slug]">) {
  const { slug } = await params;
  const training = getTraining(slug);
  if (!training) notFound();

  const others = TRAININGS.filter((t) => t.slug !== training.slug);

  return (
    <>
      <section className="grain relative isolate overflow-hidden bg-[#00004d] text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-30 bg-[radial-gradient(120%_120%_at_50%_-20%,#3d1d7a_0%,#1a0f3e_45%,#00004d_80%)]"
        />
        <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-50" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 pb-16 pt-36 text-center sm:px-8 sm:pb-20 sm:pt-44">
          <Link
            href="/training"
            className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-violet-300 hover:text-white"
          >
            ← All training
          </Link>
          {training.logo ? (
            <div className="flex h-24 w-full max-w-[320px] items-center justify-center sm:h-28 sm:max-w-[380px]">
              <Image
                src={training.logo.src}
                alt={training.name}
                width={training.logo.width}
                height={training.logo.height}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <Seal
              id={training.slug}
              label={training.name}
              mark={training.emblem}
              tone="dark"
              className="h-44 w-44 sm:h-52 sm:w-52"
            />
          )}
          <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {training.name}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-300/85">
            {training.blurb}
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle>About this training</SectionTitle>
        <Lead>{training.overview}</Lead>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className={HEADING}>Key focus areas</h2>
            <CheckList items={training.focus} />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className={HEADING}>Who it is for</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {training.audience}
              </p>
            </div>
            {training.outcome ? (
              <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
                <h2 className={HEADING}>Outcome</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {training.outcome}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {training.groups?.map((group) => (
          <div key={group.title} className="mt-10">
            <h2 className={HEADING}>{group.title}</h2>
            <CheckList items={group.items} />
          </div>
        ))}
      </Section>

      <Section tint wide>
        <SectionTitle>Other training</SectionTitle>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/training/${t.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {t.logo ? (
                <div className="flex h-16 w-full max-w-[220px] items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
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
                  className="h-32 w-32 transition-transform duration-300 group-hover:-translate-y-1"
                />
              )}
              <h3 className="font-display mt-5 text-base font-semibold text-white dark:text-white">
                {t.name}
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
          text={`Bring ${training.name} in-house, or enroll your team in an upcoming cohort.`}
          actions={[
            {
              label: "Talk to the training team",
              href: "mailto:web@nationalaiconsortium.org?subject=AI%20training%20enquiry",
              primary: true,
            },
            { label: "All training", href: "/training" },
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
