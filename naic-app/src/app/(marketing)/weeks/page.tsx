import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  Card,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { WEEKS } from "./weeks";

export const metadata: Metadata = {
  title: "AI Weeks",
  description:
    "Nationwide week-long initiatives exploring leadership, emerging talent, inclusion, and the impact of artificial intelligence.",
};

export default function WeeksPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Weeks"
        title="A week at a time, a nationwide conversation."
        lead="Week-long initiatives that bring the future of AI to students, educators, businesses, and policymakers across the country."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {WEEKS.map((w) => (
            <Card key={w.slug} eyebrow={w.when} title={w.name}>
              {w.body}
            </Card>
          ))}
        </div>

        <CtaRow
          text="Register for an AI Week — $599 per week."
          actions={[
            { label: "Register — $599", href: "/weeks/register", primary: true },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Celebrations", href: "/celebrations" },
            { label: "Events", href: "/events" },
            { label: "Conferences", href: "/conferences" },
          ]}
        />
      </Section>
    </>
  );
}
