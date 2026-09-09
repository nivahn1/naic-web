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
import { CERTIFICATIONS, getCertification } from "../certification";

export function generateStaticParams() {
  return CERTIFICATIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/certification/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertification(slug);
  if (!certification) return {};
  return { title: certification.name, description: certification.blurb };
}

const HEADING =
  "font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300";

export default async function CertificationDetailPage({
  params,
}: PageProps<"/certification/[slug]">) {
  const { slug } = await params;
  const certification = getCertification(slug);
  if (!certification) notFound();

  const others = CERTIFICATIONS.filter((c) => c.slug !== certification.slug);

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
            href="/certification"
            className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-violet-300 hover:text-white"
          >
            ← All certifications
          </Link>
          {certification.logo ? (
            <div className="flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
              <Image
                src={certification.logo.src}
                alt={certification.name}
                width={certification.logo.width}
                height={certification.logo.height}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <Seal
              id={certification.slug}
              label={certification.name}
              mark={certification.emblem}
              tone="dark"
              className="h-44 w-44 sm:h-52 sm:w-52"
            />
          )}
          <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {certification.name}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-300/85">
            {certification.blurb}
          </p>
        </div>
      </section>

      <Section>
        <SectionTitle>About this certification</SectionTitle>
        <Lead>{certification.audience}</Lead>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className={HEADING}>Duration</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {certification.duration}
            </p>
          </div>
          <div>
            <h2 className={HEADING}>Assessment</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {certification.assessment}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className={HEADING}>Curriculum</h2>
          <CheckList items={certification.curriculum} />
        </div>
      </Section>

      <Section tint wide>
        <SectionTitle>Other certifications</SectionTitle>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/certification/${c.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {c.logo ? (
                <div className="flex h-32 w-32 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                  <Image
                    src={c.logo.src}
                    alt={c.name}
                    width={c.logo.width}
                    height={c.logo.height}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <Seal
                  id={c.slug}
                  label={c.name}
                  mark={c.emblem}
                  tone="dark"
                  className="h-32 w-32 transition-transform duration-300 group-hover:-translate-y-1"
                />
              )}
              <h3 className="font-display mt-5 text-base font-semibold text-white dark:text-white">
                {c.name}
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
          text={`Register for ${certification.name} — $${(certification.priceCents / 100).toLocaleString()} — or join the Consortium for member pricing.`}
          actions={[
            {
              label: `Register — $${(certification.priceCents / 100).toLocaleString()}`,
              href: `/certification/register?certification=${certification.slug}`,
              primary: true,
            },
            { label: "Become a member", href: "/signup" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "All certifications", href: "/certification" },
            { label: "Programs", href: "/programs" },
            { label: "Training", href: "/training" },
          ]}
        />
      </Section>
    </>
  );
}
