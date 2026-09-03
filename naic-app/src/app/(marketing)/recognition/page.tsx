import type { Metadata } from "next";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  Card,
  CheckList,
  RelatedLinks,
} from "../../_components/content";
import { Seal } from "../../_components/Seal";
import { NominationForm } from "./NominationForm";
import {
  AWARD_CATEGORIES,
  LISTS,
  SUBMISSION_DEADLINE,
} from "./recognition";

export const metadata: Metadata = {
  title: "Recognition",
  description:
    "The AI Excellence Awards and the Consortium's honor lists — Top 50 Chief AI Officers, Top 100 Leaders in AI, and the AI Emerging 100.",
};

export default function RecognitionPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="Recognition"
        title="Honoring the people advancing AI."
        lead="The National AI Consortium recognizes outstanding contributions to artificial intelligence through its annual awards and honor lists."
      />

      <Section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle>AI Excellence Awards</SectionTitle>
          <p className="text-sm font-medium text-violet-600 dark:text-violet-300">
            Submission deadline · {SUBMISSION_DEADLINE}
          </p>
        </div>
        <Lead>
          These awards recognize individuals and organizations that have made
          significant strides in AI innovation, ethical AI practices, and the
          advancement of AI research — setting a standard for others to follow in
          the pursuit of innovative and responsible AI development.
        </Lead>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {AWARD_CATEGORIES.map((a) => (
            <Card key={a.name} title={a.name}>
              {a.body}
            </Card>
          ))}
        </div>
      </Section>

      {LISTS.map((list, i) => (
        <Section key={list.slug} tint={i % 2 === 0}>
          <div id={list.slug} className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
            <Seal
              id={list.slug}
              label={list.name}
              mark={list.emblem}
              className="h-40 w-40 shrink-0 self-center sm:h-44 sm:w-44 sm:self-start"
            />
            <div>
              <SectionTitle>{list.name}</SectionTitle>
              <Lead>{list.body}</Lead>
            </div>
          </div>

          <h3 className="font-display mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
            Selection criteria
          </h3>
          <CheckList items={list.criteria} />
        </Section>
      ))}

      <Section>
        <div id="nominate">
          <SectionTitle>Submit a nomination</SectionTitle>
          <Lead>
            Nominations are open to members and the wider AI community — you may
            nominate a colleague or yourself. Submissions close{" "}
            {SUBMISSION_DEADLINE}.
          </Lead>
          <NominationForm />
        </div>

        <RelatedLinks
          links={[
            { label: "Events", href: "/events" },
            { label: "Celebrations", href: "/celebrations" },
            { label: "About", href: "/about" },
          ]}
        />
      </Section>
    </>
  );
}
