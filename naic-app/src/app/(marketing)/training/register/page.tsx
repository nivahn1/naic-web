import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { REGISTERABLE_TRAININGS } from "../training";

export const metadata: Metadata = {
  title: "Register for Training",
  description:
    "Register for a National AI Consortium training track.",
};

export default async function TrainingRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ training?: string; cancelled?: string }>;
}) {
  const { training, cancelled } = await searchParams;
  const defaultTrainingSlug =
    REGISTERABLE_TRAININGS.find((t) => t.slug === training)?.slug ??
    REGISTERABLE_TRAININGS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Training"
        title="Register for training"
        lead="Reserve your seat in an upcoming cohort. Registration is $999 per training."
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

        <RegistrationForm defaultTrainingSlug={defaultTrainingSlug} />

        <RelatedLinks
          links={[
            { label: "All training", href: "/training" },
            { label: "Programs", href: "/programs" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
