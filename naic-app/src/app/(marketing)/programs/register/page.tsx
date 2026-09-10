import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { PROGRAMS } from "../programs";
import { getCurrentProfile } from "@/lib/profile";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Register for a Program",
  description:
    "Register for a National AI Consortium learning and leadership program.",
};

export default async function ProgramRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; cancelled?: string }>;
}) {
  const { program, cancelled } = await searchParams;
  const defaultProgramSlug =
    PROGRAMS.find((p) => p.slug === program)?.slug ?? PROGRAMS[0].slug;
  const { profile } = await getCurrentProfile();
  const discountPercent = getTier(profile?.membership_tier).programDiscountPercent ?? 0;

  return (
    <>
      <PageHeader
        center
        eyebrow="Programs"
        title="Register for a program"
        lead="Reserve your seat in an upcoming cohort. Registration is $999 per program."
      />

      <Section>
        <SectionTitle>Registration details</SectionTitle>
        <Lead>
          Fill out the form below to register. You&rsquo;ll enter payment on
          Stripe&rsquo;s secure checkout page next.
        </Lead>

        {cancelled ? (
          <div className="mt-8 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            Checkout was cancelled — no payment was made. You can try again
            below.
          </div>
        ) : null}

        <RegistrationForm
          defaultProgramSlug={defaultProgramSlug}
          discountPercent={discountPercent}
        />

        <RelatedLinks
          links={[
            { label: "All programs", href: "/programs" },
            { label: "Training", href: "/training" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
