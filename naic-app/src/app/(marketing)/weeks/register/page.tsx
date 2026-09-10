import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { WEEKS } from "../weeks";

export const metadata: Metadata = {
  title: "Register for an AI Week",
  description: "Register for a National AI Consortium AI Week — $599 per week.",
};

export default async function WeekRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; cancelled?: string }>;
}) {
  const { week, cancelled } = await searchParams;
  const defaultWeekSlug =
    WEEKS.find((w) => w.slug === week)?.slug ?? WEEKS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="AI Weeks"
        title="Register for an AI Week"
        lead="Bring your organization into an upcoming AI Week — $599 per week."
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

        <RegistrationForm defaultWeekSlug={defaultWeekSlug} />

        <RelatedLinks
          links={[
            { label: "All AI Weeks", href: "/weeks" },
            { label: "Celebrations", href: "/celebrations" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
