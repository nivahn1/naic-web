import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "State Chapters",
  description:
    "National AI Consortium chapters bring the mission to life in all 50 states, building toward a 2026 national launch.",
};

export default function ChaptersPage() {
  return (
    <>
      <PageHeader
        eyebrow="State Chapters"
        title="A presence in all 50 states."
        lead="The National AI Consortium Chapters bring our mission and vision to life in every state — local hubs for collaboration, innovation, and community engagement around artificial intelligence."
      />

      <Section>
        <SectionTitle>How chapters work</SectionTitle>
        <Lead>
          Each Chapter empowers local leaders, educators, professionals, and
          organizations to connect with the Consortium&rsquo;s national
          initiatives while addressing the unique needs and opportunities of
          their region. Through events, workshops, partnerships, and policy
          discussions, the state-based Chapters ensure that the transformative
          power of AI is accessible and responsibly advanced at the community
          level.
        </Lead>
        <Lead>
          Together, they form a nationwide network committed to shaping the
          future of AI through shared knowledge, ethical standards, and
          collective action.
        </Lead>

        <div className="mt-10 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
            {Array.from({ length: 50 }).map((_, i) => (
              <span
                key={i}
                className={`aspect-square rounded-lg ${
                  i % 7 === 0 || i % 11 === 0
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                    : "bg-black/5 dark:bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="mt-5 text-xs text-[var(--muted)]">
            Highlighted tiles represent chapters live today, actively operating
            and driving local engagement ahead of our full national launch.
          </p>
        </div>

        <div className="mt-10">
          <SectionTitle>Building toward 2026</SectionTitle>
          <Lead>
            A handful of chapters are already live. If you&rsquo;re interested in
            becoming part of our chapters, contact us to learn more as we build
            toward our 2026 launch.
          </Lead>
        </div>

        <CtaRow
          text="Bring a chapter to your state, or connect with the one nearest you."
          actions={[
            {
              label: "Contact the Consortium",
              href: "mailto:web@nationalaiconsortium.org?subject=State%20Chapter%20interest",
              primary: true,
            },
            { label: "Become a member", href: "/signup" },
          ]}
        />

        <RelatedLinks
          links={[
            { label: "About", href: "/about" },
            { label: "Events", href: "/events" },
            { label: "AI Weeks", href: "/weeks" },
          ]}
        />
      </Section>
    </>
  );
}
