import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { WEBINARS } from "../webinars";

export const metadata: Metadata = {
  title: "Register for a Webinar",
  description: "Register for a National AI Consortium webinar — $99 per session.",
};

export default async function WebinarRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ webinar?: string; cancelled?: string }>;
}) {
  const { webinar, cancelled } = await searchParams;
  const defaultWebinarSlug =
    WEBINARS.find((w) => w.slug === webinar)?.slug ?? WEBINARS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Webinars"
        title="Register for a webinar"
        lead="Reserve your seat in an upcoming session — $99 per webinar."
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

        <RegistrationForm defaultWebinarSlug={defaultWebinarSlug} />

        <RelatedLinks
          links={[
            { label: "All webinars", href: "/webinars" },
            { label: "Events", href: "/events" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
