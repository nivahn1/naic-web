import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { CERTIFICATIONS } from "../certification";

export const metadata: Metadata = {
  title: "Register for Certification",
  description:
    "Register for a National AI Certification Institute™ credential — AI-CP, AI-SCP, or AI-EP.",
};

export default async function CertificationRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ certification?: string; cancelled?: string }>;
}) {
  const { certification, cancelled } = await searchParams;
  const defaultCertificationSlug =
    CERTIFICATIONS.find((c) => c.slug === certification)?.slug ??
    CERTIFICATIONS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Certification"
        title="Register for certification"
        lead="Reserve your seat in an upcoming cohort. Pricing varies by certification tier."
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

        <RegistrationForm defaultCertificationSlug={defaultCertificationSlug} />

        <RelatedLinks
          links={[
            { label: "All certifications", href: "/certification" },
            { label: "Programs", href: "/programs" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
