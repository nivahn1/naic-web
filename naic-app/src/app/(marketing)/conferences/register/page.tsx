import type { Metadata } from "next";
import Link from "next/link";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { RegistrationForm } from "./RegistrationForm";
import { CONFERENCES } from "../conferences";

export const metadata: Metadata = {
  title: "Register for a Conference",
  description:
    "Register for a National AI Consortium conference — $1,199 Standard or $1,399 VIP.",
};

export default async function ConferenceRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ conference?: string; cancelled?: string }>;
}) {
  const { conference, cancelled } = await searchParams;
  const defaultConferenceSlug =
    CONFERENCES.find((c) => c.slug === conference)?.slug ??
    CONFERENCES[0].slug;

  return (
    <>
      <PageHeader
        center
        eyebrow="Conferences"
        title="Register for a conference"
        lead="Reserve your seat — $1,199 Standard or $1,399 VIP, per conference."
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

        <RegistrationForm defaultConferenceSlug={defaultConferenceSlug} />

        <div className="mt-6 text-sm text-[var(--muted)]">
          Registering on behalf of a nonprofit or government organization?{" "}
          <Link
            href="/conferences/inquiry"
            className="font-semibold text-violet-300 hover:underline"
          >
            Contact us
          </Link>{" "}
          instead.
        </div>

        <RelatedLinks
          links={[
            { label: "All conferences", href: "/conferences" },
            { label: "Events", href: "/events" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
