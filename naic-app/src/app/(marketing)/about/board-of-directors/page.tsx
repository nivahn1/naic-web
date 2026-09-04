import type { Metadata } from "next";
import Image from "next/image";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  RelatedLinks,
} from "../../../_components/content";
import { BOARD, initials, type BoardMember } from "./board";

export const metadata: Metadata = {
  title: "Board of Directors",
  description:
    "The National AI Consortium's Board of Directors — leaders from industry, government, healthcare, and research providing governance and strategic direction.",
};

function Avatar({ member }: { member: BoardMember }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={member.name}
        width={480}
        height={480}
        sizes="80px"
        className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-white/15 dark:ring-white/15"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="font-display flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00004d] to-violet-600 text-xl font-semibold text-white ring-1 ring-white/15 dark:ring-white/15"
    >
      {initials(member.name)}
    </div>
  );
}

function DirectorCard({ member }: { member: BoardMember }) {
  return (
    <article className="flex flex-col rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
      <Avatar member={member} />
      <h3 className="font-display mt-4 text-lg font-semibold text-white dark:text-white">
        {member.name}
      </h3>
      <div className="mt-1.5 space-y-1">
        {member.roles.map((role) => (
          <p
            key={role}
            className="text-sm leading-5 text-violet-300"
          >
            {role}
          </p>
        ))}
      </div>
      {member.org ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{member.org}</p>
      ) : null}
    </article>
  );
}

export default function BoardOfDirectorsPage() {
  return (
    <>
      <PageHeader
        center
        eyebrow="About"
        title="Board of Directors"
        lead="The National AI Consortium's Board of Directors provides governance, strategic direction, and fiduciary oversight — bringing leadership from industry, government, healthcare, and research to guide the Consortium toward its 2026 national launch."
      />

      <Section wide>
        <SectionTitle>Our directors</SectionTitle>
        <Lead>
          Directors serve as stewards of the Consortium&rsquo;s mission,
          shaping its programs, partnerships, and standards for the responsible
          advancement of artificial intelligence.
        </Lead>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BOARD.map((member) => (
            <DirectorCard key={member.slug} member={member} />
          ))}
        </div>

        <RelatedLinks
          links={[
            { label: "About", href: "/about" },
            { label: "State Chapters", href: "/chapters" },
            { label: "Recognition", href: "/recognition" },
          ]}
        />
      </Section>
    </>
  );
}
