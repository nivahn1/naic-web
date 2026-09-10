import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import { WEBINARS, webinarDateLabel } from "./webinars";

export const metadata: Metadata = {
  title: "Webinars",
  description:
    "The Consortium's 2026 webinar series — live sessions on AI trends, responsible AI, and industry-specific applications.",
};

export default function WebinarsPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Webinars"
        title="The 2026 webinar series."
        lead="Live sessions with practitioners and researchers on the trends, risks, and applications shaping AI today — $99 per session."
      />

      <Section wide>
        <SectionTitle>Upcoming sessions</SectionTitle>
        <Lead>Six live sessions throughout 2026. Register for one or more below.</Lead>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {WEBINARS.map((w) => (
            <article
              key={w.slug}
              className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
                {webinarDateLabel(w)}
              </p>
              <h3 className="font-display mt-2 text-lg font-semibold text-white dark:text-white">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{w.body}</p>
              <p className="mt-3 text-sm font-semibold text-white dark:text-white">
                $99
              </p>
            </article>
          ))}
        </div>

        <CtaRow
          text="Register for a webinar — $99 per session."
          actions={[
            { label: "Register — $99", href: "/webinars/register", primary: true },
          ]}
        />
        <RelatedLinks
          links={[
            { label: "Events", href: "/events" },
            { label: "Conferences", href: "/conferences" },
            { label: "Membership", href: "/#membership" },
          ]}
        />
      </Section>
    </>
  );
}
