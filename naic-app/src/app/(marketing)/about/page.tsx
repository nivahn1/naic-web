import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PageHeader,
  Section,
  SectionTitle,
  Lead,
  Card,
  RelatedLinks,
} from "../../_components/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The National AI Consortium's mission, vision, founder, and advisory leadership.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A united community for the responsible advancement of AI."
        lead="The National AI Consortium brings AI-focused organizations together — including the Society for AI Management (SAIM) — into one community dedicated to advancing AI knowledge, standards, and leadership."
      />

      <Section>
        <div id="mission" className="grid gap-5 md:grid-cols-2">
          <Card eyebrow="Our Mission">
            To advance the understanding, development, and practical application
            of artificial intelligence across industries — creating a
            collaborative platform where professionals, researchers, and
            organizations share knowledge, drive innovation, and promote
            excellence in AI. We equip members with the tools and insights to
            harness AI&rsquo;s full potential while keeping its implementation
            purposeful, transparent, and beneficial to society.
          </Card>
          <Card eyebrow="Our Vision">
            To be the leading organization shaping the future of artificial
            intelligence through innovation, collaboration, and responsible
            advancement — a world where AI solves complex challenges, enhances
            human potential, and creates meaningful opportunity across every
            industry, developed and applied with transparency, purpose, and
            integrity.
          </Card>
        </div>
      </Section>

      <Section tint>
        <div id="founder">
          <SectionTitle>A letter from our founder</SectionTitle>
          <div className="mt-6 space-y-4 leading-7 text-[var(--muted)]">
            <p>Dear Friends and Colleagues,</p>
            <p>
              It is my honor to welcome you to the National AI Consortium. Our
              mission is to serve as a hub for learning, innovation, and
              collaboration in the rapidly evolving field of artificial
              intelligence. The Consortium brings together several AI-focused
              organizations, including the Society for AI Management (SAIM), to
              create a united community dedicated to advancing AI knowledge,
              standards, and leadership. We are committed to preparing,
              educating, and coaching AI professionals so they are well-equipped
              to navigate both the opportunities and challenges of this
              transformative technology.
            </p>
            <p>
              A central part of our work includes professional development
              through certifications such as the AI Certified Professional
              (AI-CP) and the AI Senior Professional (AI-SP). These programs
              provide both practical skills and strategic insight, enabling
              professionals to lead with confidence in their organizations and
              industries. By fostering continuous learning and professional
              growth, we aim to create a strong foundation for the responsible
              and ethical use of AI.
            </p>
            <p>
              As Founder and Chairwoman, I invite your organization to join us in
              shaping the future of AI. Together, we can ensure that artificial
              intelligence is developed responsibly, applied effectively, and
              leveraged to create lasting value for society.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Image
              src="/people/miracle-johnson.jpg"
              alt="Dr. Miracle Johnson"
              width={790}
              height={790}
              sizes="64px"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15"
            />
            <div>
              <p className="font-display font-semibold text-slate-900 dark:text-white">
                Dr. Miracle Johnson, PhD, MBA
              </p>
              <p className="text-sm text-[var(--muted)]">
                Founder &amp; Chairwoman · Professor, Honors College, LSU
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div id="advisory">
          <SectionTitle>Advisory Board</SectionTitle>
          <Lead>
            The Advisory Board brings together distinguished leaders from
            academia, industry, government, and the nonprofit sector to provide
            strategic guidance and thought leadership. Serving as trusted
            advisors, they help shape the Consortium&rsquo;s programs,
            partnerships, and long-term vision — with expertise spanning
            artificial intelligence, policy, business transformation, and
            workforce development.
          </Lead>
          <div className="mt-6">
            <a
              href="mailto:web@nationalaiconsortium.org?subject=Advisory%20Board%20interest"
              className="inline-flex rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Express interest in joining
            </a>
          </div>
        </div>

        <div id="board" className="mt-14">
          <SectionTitle>Board of Directors</SectionTitle>
          <Lead>
            The Consortium&rsquo;s Board of Directors brings together leaders from
            industry, government, healthcare, and research to provide governance
            and strategic direction ahead of the 2026 national launch.
          </Lead>
          <div className="mt-6">
            <Link
              href="/about/board-of-directors"
              className="inline-flex rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Meet the Board
            </Link>
          </div>
        </div>

        <RelatedLinks
          links={[
            { label: "State Chapters", href: "/chapters" },
            { label: "Programs", href: "/programs" },
            { label: "Recognition", href: "/recognition" },
          ]}
        />
      </Section>
    </>
  );
}
