import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  CheckList,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { CONFERENCES } from "./conferences";

export const metadata: Metadata = {
  title: "Conferences",
  description:
    "The Consortium's 2026 conference program — leadership, emerging talent, DEI, women in AI, and the flagship AI National Conference.",
};

export default function ConferencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conferences"
        title="The 2026 conference program."
        lead="From executive leadership to emerging talent, each conference is a platform for learning, connection, and strategic dialogue that drives progress across the AI landscape."
      />

      {CONFERENCES.map((c, i) => (
        <Section key={c.slug} tint={i % 2 === 1}>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
            {c.when}
          </span>
          <SectionTitle>{c.name}</SectionTitle>
          <p className="mt-4 leading-7 text-[var(--muted)]">{c.body}</p>
          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
            Key highlights
          </h3>
          <CheckList items={c.highlights} />
        </Section>
      ))}

      <Section>
        <CtaRow
          text="Register for a conference — $1,199 Standard or $1,399 VIP per conference."
          actions={[
            { label: "Register", href: "/conferences/register", primary: true },
            {
              label: "Nonprofit or government? Contact us",
              href: "/conferences/inquiry",
            },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Events", href: "/events" },
            { label: "AI Weeks", href: "/weeks" },
            { label: "Celebrations", href: "/celebrations" },
            { label: "Membership", href: "/#membership" },
          ]}
        />
      </Section>
    </>
  );
}
