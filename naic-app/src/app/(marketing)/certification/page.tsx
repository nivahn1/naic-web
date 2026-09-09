import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, Section, CtaRow, RelatedLinks } from "../../_components/content";
import { Seal } from "../../_components/Seal";
import { CERTIFICATIONS } from "./certification";

export const metadata: Metadata = {
  title: "Certification",
  description:
    "AI professional certifications — AI Certified Professional, AI Senior Certified Professional, and AI Executive Professional.",
};

export default function CertificationPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Certification"
        title="Credentials that prove you can lead with AI."
        lead="Endorsed by industry experts and aligned with real enterprise adoption needs — delivered through a blend of virtual instruction, labs, and applied assessments through the National AI Certification Institute™ (NAICI)."
      />

      <Section wide>
        <div className="grid gap-x-14 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/certification/${c.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {c.logo ? (
                <div className="flex h-52 w-52 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-60 sm:w-60">
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
                  className="h-52 w-52 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-60 sm:w-60"
                />
              )}
              <h2 className="font-display mt-8 text-xl font-semibold tracking-tight text-white sm:text-2xl dark:text-white">
                {c.name}
              </h2>
              <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-[var(--muted)]">
                {c.blurb}
              </p>
              <span className="font-display mt-4 text-sm font-semibold text-violet-300 underline-offset-4 group-hover:underline dark:text-violet-300">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tint>
        <CtaRow
          text="Register for a certification — AI-CP $599, AI-SCP $999, AI-EP $1,599 — or join the Consortium for member pricing."
          actions={[
            { label: "Register", href: "/certification/register", primary: true },
            { label: "Become a member", href: "/signup" },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Programs", href: "/programs" },
            { label: "Training", href: "/training" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
