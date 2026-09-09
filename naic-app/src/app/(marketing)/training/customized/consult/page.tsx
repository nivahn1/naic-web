import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../../_components/content";
import { ConsultForm } from "./ConsultForm";

export const metadata: Metadata = {
  title: "Book a Customized Training Consultation",
  description:
    "Tell us what you need from Customized AI Training and we'll follow up to schedule a consultation.",
};

export default function CustomizedConsultPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Training"
        title="Book a consultation"
        lead="Customized AI Training is scoped with you, not sold off the shelf. Tell us what you're looking for and we'll follow up to schedule a consultation."
      />

      <Section>
        <SectionTitle>Tell us about your needs</SectionTitle>
        <Lead>
          A few details about your team and goals help us prepare for the
          conversation.
        </Lead>

        <ConsultForm />

        <RelatedLinks
          links={[
            { label: "Customized AI Training", href: "/training/customized" },
            { label: "All training", href: "/training" },
            { label: "Programs", href: "/programs" },
          ]}
        />
      </Section>
    </>
  );
}
