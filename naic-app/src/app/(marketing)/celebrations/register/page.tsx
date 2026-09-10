import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { CELEBRATIONS } from "../celebrations";

export const metadata: Metadata = {
  title: "Register for a Celebration",
  description:
    "Register for a National AI Consortium celebration — $2,499 per celebration.",
};

export default async function CelebrationRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ celebration?: string; cancelled?: string }>;
}) {
  const { celebration, cancelled } = await searchParams;
  const defaultCelebrationSlug =
    CELEBRATIONS.find((c) => c.slug === celebration)?.slug ??
    CELEBRATIONS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Celebrations"
        title="Register for a celebration"
        lead="Bring your organization into a month-long celebration — $2,499 per celebration."
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

        <RegistrationForm defaultCelebrationSlug={defaultCelebrationSlug} />

        <RelatedLinks
          links={[
            { label: "All celebrations", href: "/celebrations" },
            { label: "AI Weeks", href: "/weeks" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
