import type { Metadata } from "next";
import { PageHeader, Section, SectionTitle, Lead, RelatedLinks } from "../../../_components/content";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Nonprofit & Government Conference Registration",
  description:
    "Nonprofit and government organizations — contact us for conference registration options.",
};

export default function ConferenceInquiryPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Conferences"
        title="Nonprofit & government registration"
        lead="Nonprofit and government organizations register through our team rather than the standard checkout. Tell us which conference(s) you're interested in and we'll follow up with options."
      />

      <Section>
        <SectionTitle>Contact us</SectionTitle>
        <Lead>
          Fill out the form below and we&rsquo;ll be in touch to complete
          your registration.
        </Lead>

        <InquiryForm />

        <RelatedLinks
          links={[
            { label: "All conferences", href: "/conferences" },
            { label: "Register — paid checkout", href: "/conferences/register" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
