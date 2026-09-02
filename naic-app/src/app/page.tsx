import type { Metadata } from "next";
import { SiteHeader } from "./_components/SiteHeader";
import { Logo } from "./_components/Logo";
import { Constellation } from "./_components/Constellation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Advancing AI Responsibly",
};

const FOCUS = [
  "Machine Learning",
  "AI Ethics",
  "Responsible AI Governance",
  "Generative AI",
  "Data Science",
  "Cloud & Infrastructure",
  "Policy & Compliance",
  "AI Leadership",
];

const STATS = [
  { value: "50", label: "State chapters" },
  { value: "3", label: "Pro certifications" },
  { value: "5", label: "Annual conferences" },
  { value: "6", label: "Webinars in 2026" },
];

const PILLARS = [
  {
    title: "Certification",
    body: "Industry-recognized credentials validating technical skill and leadership judgment across machine learning, data science, and AI ethics.",
    points: ["AI‑CP · Certified Professional", "AI‑SP · Senior Professional", "AI‑EP · Executive Professional"],
    wide: true,
  },
  {
    title: "Training & Programs",
    body: "Six-month cohort programs and customized training — from AI literacy and leadership to policy, governance, and generative AI.",
    points: ["AI Emerging Leadership Program", "AI Ethics Program", "Org reskilling & upskilling"],
  },
  {
    title: "Toolkit",
    body: "A curated library of governance frameworks and standards: NIST AI RMF, OECD Principles, UNESCO AI Ethics, the EU AI Act.",
    points: ["Governance & risk frameworks", "Industry AI use-case library", "Legal & compliance watch"],
  },
  {
    title: "Community & Forum",
    body: "Member forums, networking groups, and virtual meetups connecting practitioners, researchers, and leaders across every industry.",
    points: ["Member-only forum", "Networking groups", "Advisory board participation"],
    wide: true,
  },
];

const CERTS = [
  {
    code: "AI‑CP",
    name: "AI Certified Professional",
    body: "For individuals demonstrating proficiency in applying AI concepts and technologies effectively in real-world scenarios — machine learning, data analysis, and AI ethics.",
  },
  {
    code: "AI‑SP",
    name: "AI Senior Professional",
    body: "For experienced practitioners elevating their expertise — complex ML algorithms, AI system design, and strategic implementation of impactful AI projects.",
  },
  {
    code: "AI‑EP",
    name: "AI Executive Professional",
    body: "For senior leaders and executives mastering AI’s impact on business strategy, organizational change, and innovation at the highest levels.",
  },
];

const PROGRAMS = [
  {
    title: "AI Emerging Leadership Program",
    body: "A six-month cohort — one half-day session per month — blending AI literacy with leadership development, from ML and NLP to generative AI and responsible-AI ethics. Certificate on completion.",
  },
  {
    title: "AI Ethics Program",
    body: "A structured six-month learning experience dedicated to responsible and equitable AI adoption, blending theory, case studies, and real-world application through monthly half-day seminars.",
  },
  {
    title: "Customized AI Training",
    body: "Tailored programs for organizations, teams, and individuals: reskilling strategies, technical workshops for data and engineering, and personalized pathways for every experience level.",
  },
];

const TRAININGS = [
  "AI for Business Transformation",
  "AI Policy, Regulation & Compliance",
  "Generative AI & Creative Innovation",
  "Customized AI Training",
];

const INDIVIDUAL_TIERS = [
  { name: "Free", price: "$0", tag: "Free access", features: ["Toolkit access", "For students & early professionals"] },
  { name: "Bronze", price: "$199", tag: "Starter access", features: ["1 webinar / year", "1 event / year", "Networking lounge access", "10% off conferences & certifications"] },
  { name: "Silver", price: "$799", tag: "Growth member", features: ["3 webinars / year", "2 events / year", "1 conference pass", "15% off certifications", "Member community & job board"] },
  { name: "Gold", price: "$1,999", tag: "Professional member", featured: true, features: ["6 webinars / year", "4 events / year", "2 conference passes", "1 certification included", "20% off Programs"] },
  { name: "Platinum", price: "$3,499", tag: "Executive member", features: ["All 6 webinars & 4 events", "All 4 conferences", "1 celebration ticket", "1 certification", "VIP networking & roundtables"] },
  { name: "Diamond", price: "$5,999", tag: "Consortium Fellow", features: ["Everything in Platinum", "1 full Program included", "Recognition as Consortium Fellow", "Private leadership sessions"] },
];

const CONFERENCES = [
  { name: "AI Leadership Conference™", when: "Jan 20–21, 2026", body: "Senior executives, industry pioneers, and thought leaders on AI’s transformative impact — emerging technologies, ethical governance, and future-proofing the enterprise." },
  { name: "National AI Women’s Conference™", when: "Mar 24–25, 2026", body: "Amplifying the contributions of women at the forefront of AI through mentorship, networking, and strategic dialogue on advancing gender equity in the field." },
  { name: "National AI Emerging Conference™", when: "Apr 21–22, 2026", body: "A dynamic gathering for rising professionals, students, and early-career talent — mentorship, career development, and exposure to cutting-edge innovation." },
  { name: "AI National Conference™", when: "Sep 15–17, 2026", body: "The flagship gathering uniting leaders from business, government, academia, and technology to explore AI’s most transformative applications and strategic opportunities." },
  { name: "AI Diversity, Equity & Inclusion Conference", when: "2026", body: "Fairness, representation, and accessibility in AI design and deployment — algorithmic bias, inclusive data practices, and voices from underrepresented communities." },
];

const CALENDAR = [
  { date: "Jan 20–21", title: "National AI Convention™", note: "“Strategic Minds, Intelligent Futures”" },
  { date: "Feb 11", title: "National AI Symposium™", note: "“Advancing Intelligence: Innovation, Impact & Infrastructure”" },
  { date: "Mar 9–13", title: "National AI Women’s Week" },
  { date: "Apr 20–24", title: "National AI Emerging Week" },
  { date: "May 11–14", title: "National AI Leadership Week" },
  { date: "May 15 – Jun 15", title: "National AI Women’s Month™", note: "Celebrating leadership & impact in AI" },
  { date: "Jul 15 – Aug 15", title: "National AI Month™", note: "Innovation, responsibility & opportunity" },
  { date: "Oct 14", title: "National AI Forum™", note: "“Voices Shaping the Future of Artificial Intelligence”" },
  { date: "Nov 4", title: "National AI Multicultural Symposium™", note: "“Innovation at the Frontiers of AI Research”" },
  { date: "Nov 16–20", title: "National AI Week" },
];

const WEBINARS = [
  { date: "Jan 29", title: "AI Trends & Forecast: What’s Ahead in 2026 and Beyond" },
  { date: "Mar 19", title: "Responsible AI: Building Transparent and Trustworthy Systems" },
  { date: "May 14", title: "Women Leading the Future of AI" },
  { date: "Sep 10", title: "AI in Healthcare: Innovation with Responsibility" },
  { date: "Oct 22", title: "AI & Climate Solutions: Technology for Sustainability" },
  { date: "Nov 9", title: "AI in Finance: Risk, Regulation & Opportunity" },
];

const RECOGNITION = [
  {
    title: "AI Excellence Awards",
    body: "Our annual awards for outstanding contributions to AI.",
    points: ["AI Innovation Award", "Ethical AI Leadership Award", "AI Research Impact Award"],
  },
  {
    title: "Top 50 Chief AI Officers",
    body: "Visionary executives steering enterprise AI agendas — building centers of excellence and driving global AI maturity.",
    points: ["Measurable industry impact", "Strategic AI adoption leadership", "Ethical, responsible AI at scale"],
  },
  {
    title: "Top 100 Leaders in AI",
    body: "Researchers, practitioners, entrepreneurs, and executives whose leadership and influence are propelling the industry forward.",
    points: ["Wide-scale technical influence", "Cross-industry impact", "Ecosystem contribution"],
  },
  {
    title: "AI Emerging 100",
    body: "Early-career innovators — under 35 or within their first 10 years in AI — redefining the future of the field.",
    points: ["Early achievement & promise", "Novel, breakthrough approaches", "Leadership potential"],
  },
];

export default async function Home() {
  let authed = false;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = !!user;
  }

  return (
    <>
      <span id="top" />
      <SiteHeader authed={authed} />

      <main className="flex-1">
        {/* Hero */}
        <section className="grain relative isolate overflow-hidden bg-[#07060f] text-white">
          <div aria-hidden className="absolute inset-0 -z-30 bg-[radial-gradient(115%_90%_at_50%_-15%,#3d1d7a_0%,#1a0f3e_42%,#07060f_78%)]" />
          <div aria-hidden className="absolute -left-40 top-10 -z-20 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/25 blur-[130px]" />
          <div aria-hidden className="absolute -right-40 top-40 -z-20 h-[32rem] w-[32rem] rounded-full bg-indigo-500/25 blur-[130px]" />
          <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-60" />

          <div className="mx-auto max-w-6xl px-5 pb-24 pt-40 sm:px-8 sm:pb-28 sm:pt-48">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-violet-200 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                </span>
                National launch — 2026
              </span>

              <h1 className="font-display mt-7 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-[4.5rem]">
                Advancing artificial intelligence,{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-200 bg-clip-text text-transparent">
                  responsibly
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300/85">
                A nationwide community where professionals, researchers, and
                organizations share knowledge, drive innovation, and set the
                standard for AI that is purposeful, transparent, and beneficial to
                society.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#membership"
                  className="group w-full rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#1a0f3e] shadow-xl shadow-violet-950/40 transition-transform hover:-translate-y-0.5 sm:w-auto"
                >
                  Become a member
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <a
                  href="#certification"
                  className="w-full rounded-2xl border border-white/20 bg-white/[0.06] px-6 py-3.5 text-center text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.12] sm:w-auto"
                >
                  Explore certifications
                </a>
              </div>
            </div>

            {/* Focus marquee */}
            <div className="marquee relative mt-16 overflow-hidden">
              <div className="marquee__track flex w-max gap-3">
                {[...FOCUS, ...FOCUS].map((f, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center backdrop-blur"
                >
                  <dt className="font-display text-3xl font-semibold text-white">{s.value}</dt>
                  <dd className="mt-1 text-xs text-slate-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Mission & Vision */}
        <Section id="about" index="01" label="Mission & Vision">
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            A united community for the responsible advancement of AI.
          </h2>
          <div className="reveal mt-14 grid gap-5 md:grid-cols-2">
            {[
              { h: "Our Mission", p: "To advance the understanding, development, and practical application of AI across industries — equipping members with the tools and insights to harness its full potential while keeping implementation purposeful, transparent, and beneficial to society." },
              { h: "Our Vision", p: "To be the leading organization shaping the future of AI through innovation, collaboration, and responsible advancement — a world where AI solves complex challenges, enhances human potential, and creates meaningful opportunity across every industry." },
            ].map((c) => (
              <article
                key={c.h}
                className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-sm"
              >
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                  {c.h}
                </h3>
                <p className="mt-4 leading-7 text-[var(--muted)]">{c.p}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* Pillars — bento */}
        <Section index="02" label="What members get" tint>
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Four pillars, one membership.
          </h2>
          <div className="reveal mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className={`group flex flex-col rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/10 ${
                  p.wide ? "lg:col-span-1 sm:col-span-2 lg:col-auto" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-500 ring-1 ring-inset ring-violet-500/20 dark:text-violet-300">
                  <Spark />
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-6 text-[var(--muted)]">{p.body}</p>
                <ul className="mt-5 space-y-2 border-t border-[var(--surface-border)] pt-4">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs font-medium text-[var(--muted)]">
                      <Check />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        {/* Certification */}
        <Section id="certification" index="03" label="Certification">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="reveal">
              <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Credentials that prove you can lead with AI.
              </h2>
              <p className="mt-5 leading-7 text-[var(--muted)]">
                Endorsed by industry experts and aligned with real enterprise
                adoption needs. Each track is delivered through a blend of virtual
                instruction, labs, and applied assessments — with advanced tracks
                in AI for Cloud &amp; Infrastructure, Responsible AI Governance, and
                AI in Business Strategy.
              </p>
              <a
                href="#membership"
                className="mt-8 inline-flex rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-600/25 transition-transform hover:-translate-y-0.5"
              >
                Start your certification path
              </a>
            </div>
            <div className="reveal space-y-4">
              {CERTS.map((c) => (
                <div
                  key={c.code}
                  className="flex gap-5 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 transition-colors hover:border-violet-400/50"
                >
                  <div className="flex h-11 shrink-0 items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 px-3.5 font-display text-sm font-semibold text-white">
                    {c.code}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Programs */}
        <Section id="programs" index="04" label="Programs & Training" tint>
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Structured learning for every stage of an AI career.
          </h2>
          <div className="reveal mt-14 grid gap-5 md:grid-cols-3">
            {PROGRAMS.map((p) => (
              <article
                key={p.title}
                className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-7 transition-all hover:-translate-y-1 hover:border-violet-400/50"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{p.body}</p>
              </article>
            ))}
          </div>
          <div className="reveal mt-6 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-7">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
              AI Training tracks
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {TRAININGS.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--surface-border)] px-4 py-1.5 text-sm text-[var(--muted)]"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Industry-specific delivery for healthcare, finance, retail, energy, and government.
            </p>
          </div>
        </Section>

        {/* Membership */}
        <Section id="membership" index="05" label="Membership">
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Choose the membership that matches your ambition.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Direct access to the knowledge, resources, and networks shaping the
            future of AI. Individual tiers billed annually.
          </p>

          <div className="reveal mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDIVIDUAL_TIERS.map((t) => (
              <article
                key={t.name}
                className={`flex flex-col rounded-3xl p-6 ${
                  t.featured
                    ? "gradient-border bg-[var(--surface)]"
                    : "border border-[var(--surface-border)] bg-[var(--surface)]"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                  {t.featured && (
                    <span className="rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{t.tag}</p>
                <p className="font-display mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t.price}
                  <span className="text-sm font-normal text-[var(--muted)]"> / yr</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-[var(--surface-border)] pt-5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    t.featured
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                      : "border border-[var(--surface-border)] text-slate-800 dark:text-white"
                  }`}
                >
                  {t.price === "$0" ? "Join free" : "Select plan"}
                </a>
              </article>
            ))}
          </div>

          <div className="reveal mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_0%_0%,#7c3aed_0%,#5b21b6_45%,#2e1065_100%)] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Corporate Membership</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/80">
                Partnership levels from <span className="font-semibold text-white">$25,000</span> (Bronze,
                $40,000 program valuation) to <span className="font-semibold text-white">$50,000+</span>{" "}
                (Silver, $65,000 valuation) per year — allocated access to webinars, certifications,
                events, conferences, AI Weeks, and in-house training, with total benefit valuation that
                exceeds the investment.
              </p>
            </div>
            <a
              href="#contact"
              className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-violet-800 transition-transform hover:-translate-y-0.5"
            >
              Talk to partnerships
            </a>
          </div>
        </Section>

        {/* Convenings */}
        <Section id="events" index="06" label="Conferences & Convenings" tint>
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Where the AI community meets in 2026.
          </h2>
          <div className="reveal mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CONFERENCES.map((c) => (
              <article
                key={c.name}
                className="flex flex-col rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-7"
              >
                <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                  {c.when}
                </span>
                <h3 className="font-display mt-2 text-lg font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-6 text-[var(--muted)]">{c.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-[var(--muted)]">
            Plus the National AI Convention™, Forum™, Symposium™, and Multicultural Symposium™ —
            and nationwide AI Weeks, AI Women’s Month™, and AI Month™.
          </p>
        </Section>

        {/* 2026 Calendar */}
        <Section id="calendar" index="07" label="2026 Calendar">
          <h2 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            The year ahead, at a glance.
          </h2>
          <div className="reveal mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                Signature events & weeks
              </h3>
              <ul className="mt-5 divide-y divide-[var(--surface-border)] border-y border-[var(--surface-border)]">
                {CALENDAR.map((e) => (
                  <li key={e.title} className="flex gap-4 py-3.5">
                    <span className="w-28 shrink-0 font-display text-sm font-semibold text-slate-900 dark:text-white">
                      {e.date}
                    </span>
                    <span className="text-sm leading-6 text-[var(--muted)]">
                      <span className="text-slate-900 dark:text-white">{e.title}</span>
                      {e.note ? <span className="block text-xs">{e.note}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                2026 AI Webinar Series
              </h3>
              <ul className="mt-5 space-y-3">
                {WEBINARS.map((w) => (
                  <li
                    key={w.title}
                    className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4"
                  >
                    <span className="font-display text-xs font-semibold uppercase tracking-wide text-fuchsia-500 dark:text-fuchsia-400">
                      {w.date}
                    </span>
                    <p className="mt-1 text-sm leading-6 text-slate-900 dark:text-white">{w.title}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Quarterly AI Ethics Roundtables run alongside the series.
              </p>
            </div>
          </div>
        </Section>

        {/* Recognition */}
        <Section id="recognition" index="08" label="Recognition" tint>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Honoring the people advancing AI.
            </h2>
            <p className="text-sm font-medium text-violet-600 dark:text-violet-300">
              Submission deadline · November 7, 2026
            </p>
          </div>
          <div className="reveal mt-14 grid gap-5 sm:grid-cols-2">
            {RECOGNITION.map((r) => (
              <article
                key={r.title}
                className="flex flex-col rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-7"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{r.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-6 text-[var(--muted)]">{r.body}</p>
                <ul className="mt-5 space-y-2 border-t border-[var(--surface-border)] pt-4">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs font-medium text-[var(--muted)]">
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        {/* Chapters */}
        <Section id="chapters" index="09" label="State Chapters">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="reveal">
              <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                A presence in all 50 states.
              </h2>
              <p className="mt-5 leading-7 text-[var(--muted)]">
                Each Chapter is a local hub for collaboration and community
                engagement around AI — empowering leaders, educators,
                professionals, and organizations to connect national initiatives
                with the needs of their region through events, workshops,
                partnerships, and policy discussions.
              </p>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                Highlighted chapters are already live and driving local engagement
                ahead of our full national launch in{" "}
                <span className="font-semibold text-slate-900 dark:text-white">2026</span>.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex rounded-2xl border border-[var(--surface-border)] px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-violet-400/50 dark:text-white"
              >
                Bring a chapter to your state
              </a>
            </div>
            <div className="reveal gradient-border rounded-3xl bg-[var(--surface)] p-8">
              <div className="grid grid-cols-6 gap-2">
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
                Highlighted tiles represent chapters live today, driving local
                engagement ahead of the national launch.
              </p>
            </div>
          </div>
        </Section>

        {/* Founder */}
        <section className="grain relative isolate overflow-hidden bg-[#07060f] text-white">
          <div aria-hidden className="absolute inset-0 -z-30 bg-[radial-gradient(115%_120%_at_50%_0%,#331a66_0%,#150c3d_48%,#07060f_100%)]" />
          <div aria-hidden className="absolute left-1/2 top-0 -z-20 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[130px]" />
          <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-35" />
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
            <Logo className="mx-auto h-12 w-12" />
            <blockquote className="font-display mt-8 text-balance text-2xl font-medium leading-[1.35] sm:text-[2rem]">
              &ldquo;Our mission is to serve as a hub for learning, innovation, and
              collaboration in the rapidly evolving field of AI — bringing
              AI-focused organizations together into a united community dedicated
              to advancing AI knowledge, standards, and leadership.&rdquo;
            </blockquote>
            <div className="mt-8">
              <p className="font-display font-semibold">Dr. Miracle Johnson, PhD, MBA</p>
              <p className="text-sm text-violet-200/70">
                Founder &amp; Chairwoman, National AI Consortium · Professor, Honors College, LSU
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-xs text-violet-200/60">
              In collaboration with the Society for AI Management (SAIM) and partner
              organizations across the AI field.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section id="register" className="bg-[var(--background)] px-4 py-20 sm:py-28">
          <div className="grain relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[radial-gradient(120%_150%_at_0%_0%,#8b5cf6_0%,#6d28d9_38%,#3b0764_100%)] px-8 py-16 text-center sm:px-16 sm:py-20">
            <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-25" />
            <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Join the community shaping the future of AI.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-7 text-violet-100/90">
              Registration is simple and gives you access to the job board, event
              calendar, member-only content, and a network of AI professionals
              committed to innovation and ethical practice.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#membership"
                className="w-full rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-semibold text-violet-800 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                View membership plans
              </a>
              <a
                href="#contact"
                className="w-full rounded-2xl border border-white/40 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Contact the Consortium
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-[var(--surface-border)] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Logo className="h-8 w-8" />
                <span className="font-display text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
                  National AI Consortium
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
                Advancing the understanding, development, and responsible
                application of artificial intelligence across industries.
              </p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                In collaboration with the Society for AI Management (SAIM).
              </p>
            </div>
            <FooterCol
              title="Explore"
              links={[
                ["Mission & Vision", "#about"],
                ["Certification", "#certification"],
                ["Programs & Training", "#programs"],
                ["Membership", "#membership"],
                ["Conferences & Events", "#events"],
                ["2026 Calendar", "#calendar"],
                ["Recognition", "#recognition"],
                ["State Chapters", "#chapters"],
              ]}
            />
            <FooterCol
              title="Get in touch"
              links={[
                ["Member Login", "/login"],
                ["Become a Member", "/signup"],
                ["Contact Us", "mailto:web@nationalaiconsortium.org"],
                ["nationalaiconsortium.org", "#top"],
              ]}
            />
          </div>
          <div className="mt-14 flex flex-col gap-2 border-t border-[var(--surface-border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} National AI Consortium. All rights reserved.</p>
            <p>Purposeful &middot; Transparent &middot; Beneficial to society</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function Section({
  id,
  index,
  label,
  tint,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  tint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`border-t border-[var(--surface-border)] ${
        tint ? "bg-[var(--surface)]" : "bg-[var(--background)]"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <span className="inline-flex items-center gap-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
          <span className="tabular-nums text-[var(--muted)]">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-transparent" />
          {label}
        </span>
        {children}
      </div>
    </section>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string, string?][];
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
        {links.map(([text, href, anchorId]) => (
          <li key={text}>
            <a
              id={anchorId}
              href={href}
              className="transition-colors hover:text-violet-600 dark:hover:text-white"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-500 dark:text-fuchsia-400"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2l1.8 4.6L16.5 8l-4.7 1.4L10 14l-1.8-4.6L3.5 8l4.7-1.4z"
        fill="currentColor"
      />
    </svg>
  );
}
