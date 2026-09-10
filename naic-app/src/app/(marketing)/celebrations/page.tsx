import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { CELEBRATIONS } from "./celebrations";

export const metadata: Metadata = {
  title: "Celebrations",
  description:
    "National AI Month and National AI Women's Month — month-long celebrations of innovation, responsibility, and leadership in AI.",
};

export default function CelebrationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Celebrations"
        title="Month-long celebrations of AI's people and progress."
        lead="Nationwide observances that bring professionals together around the ideas, the responsibility, and the people advancing artificial intelligence."
      />

      {CELEBRATIONS.map((c, i) => (
        <Section key={c.slug} tint={i % 2 === 1}>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            {c.when}
          </span>
          <SectionTitle>{c.name}</SectionTitle>
          <p className="mt-3 font-medium text-slate-200 dark:text-slate-200">
            {c.theme}
          </p>
          <Lead>{c.body}</Lead>
        </Section>
      ))}

      <Section>
        <CtaRow
          text="Register for a celebration — $2,499 per celebration."
          actions={[
            { label: "Register — $2,499", href: "/celebrations/register", primary: true },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "AI Weeks", href: "/weeks" },
            { label: "Events", href: "/events" },
            { label: "Recognition", href: "/recognition" },
          ]}
        />
      </Section>
    </>
  );
}
