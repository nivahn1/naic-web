import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  CtaRow,
  RelatedLinks,
} from "../../_components/content";
import {
  LIVE_COUNT,
  REGIONS,
  STATES,
  STATE_COUNT,
  isLive,
} from "@/lib/chapters";

export const metadata: Metadata = {
  title: "State Chapters",
  description:
    "National AI Consortium chapters bring the mission to life in all 50 states, building toward a 2026 national launch.",
};

function StateTile({ abbr, name }: { abbr: string; name: string }) {
  const live = isLive(abbr);

  return (
    <div
      className={`rounded-xl px-2 py-2.5 text-center ${
        live
          ? "bg-gradient-to-br from-[#00004d] to-violet-600 text-white shadow-sm shadow-violet-600/20"
          : "border border-[var(--surface-border)] bg-[var(--surface)]"
      }`}
    >
      <span
        className={`font-display block text-sm font-semibold tracking-tight ${
          live ? "text-white" : "text-white dark:text-white"
        }`}
      >
        {abbr}
      </span>
      <span
        className={`mt-0.5 block truncate text-[10px] leading-4 ${
          live ? "text-violet-100/90" : "text-[var(--muted)]"
        }`}
        title={name}
      >
        {name}
      </span>
      <span className="sr-only">
        {live ? " — chapter live" : " — chapter forming"}
      </span>
    </div>
  );
}

export default function ChaptersPage() {
  return (
    <>
      <PageHeader
        center
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
      </Section>

      <Section tint wide>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionTitle>Where we are today</SectionTitle>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              <span className="font-display font-semibold text-white dark:text-white">
                {LIVE_COUNT} of {STATE_COUNT}
              </span>{" "}
              chapters are live and driving local engagement. The remaining{" "}
              {STATE_COUNT - LIVE_COUNT} are forming ahead of the 2026 national
              launch.
            </p>
          </div>
          <div className="flex shrink-0 gap-5 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-gradient-to-br from-[#00004d] to-violet-600" />
              Live
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-[var(--surface-border)] bg-[var(--background)]" />
              Forming
            </span>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {REGIONS.map((region) => {
            const states = STATES.filter((s) => s.region === region);
            const live = states.filter((s) => isLive(s.abbr)).length;

            return (
              <div key={region}>
                <h3 className="font-display flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
                  {region}
                  <span className="text-xs font-normal normal-case tracking-normal text-[var(--muted)]">
                    {live} of {states.length} live
                  </span>
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
                  {states.map((s) => (
                    <StateTile key={s.abbr} abbr={s.abbr} name={s.name} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionTitle>Building toward 2026</SectionTitle>
        <Lead>
          If your state is still forming, there is room to lead it. Contact us to
          learn what starting a chapter involves as we build toward the national
          launch.
        </Lead>

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
