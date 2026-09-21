import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { EVENTS } from "../events";

export const metadata: Metadata = {
  title: "Register for an Event",
  description: "Register for a National AI Consortium event — $149 per event.",
};

export default async function EventRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; cancelled?: string }>;
}) {
  const { event, cancelled } = await searchParams;
  const defaultEventSlug =
    EVENTS.find((e) => e.slug === event)?.slug ?? EVENTS[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Events"
        title="Register for an event"
        lead="Reserve your seat at an upcoming event — $149 per event."
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

        <RegistrationForm defaultEventSlug={defaultEventSlug} />

        <RelatedLinks
          links={[
            { label: "All events", href: "/events" },
            { label: "Conferences", href: "/conferences" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
