import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { AdvisoryForm } from "./AdvisoryForm";

export const metadata: Metadata = {
  title: "Advisory Board",
  description:
    "Apply to join the National AI Consortium's Advisory Board — distinguished leaders from academia, industry, government, and the nonprofit sector providing strategic guidance.",
};

export default function AdvisoryBoardPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="About"
        title="Join the Advisory Board"
        lead="The Advisory Board brings together distinguished leaders from academia, industry, government, and the nonprofit sector to provide strategic guidance and thought leadership — helping shape the Consortium's programs, partnerships, and long-term vision."
      />

      <Section>
        <SectionTitle>Apply to join</SectionTitle>
        <Lead>
          Tell us about yourself and your background below. Applications are
          reviewed on a rolling basis by the Founder and current Advisory
          Board members.
        </Lead>

        <AdvisoryForm />

        <RelatedLinks
          links={[
            { label: "About", href: "/about" },
            { label: "Board of Directors", href: "/about/board-of-directors" },
            { label: "Recognition", href: "/recognition" },
          ]}
        />
      </Section>
    </>
  );
}
