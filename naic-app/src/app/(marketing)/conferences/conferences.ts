export type Conference = {
  slug: string;
  name: string;
  when: string;
  /** ISO date, UTC — kept in sync with `when` for chronological sorting. */
  start: string;
  end?: string;
  body: string;
  highlights: string[];
};

export const CONFERENCES: Conference[] = [
  {
    slug: "ai-leadership-conference",
    name: "AI Leadership Conference™",
    when: "January 20–21, 2026",
    start: "2026-01-20",
    end: "2026-01-21",
    body: "Brings together senior executives, industry pioneers, and thought leaders to explore the transformative impact of AI on business and innovation. Attendees gain insight into emerging technologies, ethical governance, and organizational strategies to future-proof their enterprises.",
    highlights: [
      "Executive-level keynotes and strategic panels",
      "Case studies on successful AI implementation",
      "Discussions on ethical, legal, and societal implications of AI",
      "Tools for fostering AI readiness and digital transformation",
    ],
  },
  {
    slug: "national-ai-womens-conference",
    name: "National AI Women's Conference™",
    when: "March 24–25, 2026",
    start: "2026-03-24",
    end: "2026-03-25",
    body: "Celebrates and amplifies the contributions of women at the forefront of artificial intelligence, convening innovators, leaders, researchers, and entrepreneurs to spotlight the pivotal role women play in shaping AI's present and future.",
    highlights: [
      "Panels featuring women leaders advancing AI in research, entrepreneurship, and policy",
      "Leadership in AI — mentorship programs, career pathways, and inclusive opportunities",
      "Showcasing startups, projects, and initiatives led by women across AI sectors",
      "Discussions on breaking barriers and creating systemic change for greater representation",
    ],
  },
  {
    slug: "national-ai-emerging-leaders-conference",
    name: "National AI Emerging Leaders Conference™",
    when: "April 21–22, 2026",
    start: "2026-04-21",
    end: "2026-04-22",
    body: "A dynamic gathering for rising professionals, students, and early-career talent passionate about shaping the future of AI. Through mentorship, career development sessions, and exposure to cutting-edge innovation, it empowers the next generation of AI trailblazers.",
    highlights: [
      "Interactive workshops on AI skills and career pathways",
      "Speed networking with industry mentors",
      "Emerging trends in AI and innovation challenges",
      "Spotlight on student research and young innovators",
    ],
  },
  {
    slug: "ai-national-conference",
    name: "AI National Conference™",
    when: "September 15–17, 2026",
    start: "2026-09-15",
    end: "2026-09-17",
    body: "The flagship gathering for professionals, researchers, and innovators driving the future of artificial intelligence across industries — uniting leaders from business, government, academia, and technology to explore AI's most transformative applications and strategic opportunities.",
    highlights: [
      "Expert sessions and panels on AI strategy, innovation, and implementation across sectors",
      "Networking connecting executives, researchers, and entrepreneurs nationwide",
      "Showcases of emerging technologies, case studies, and industry best practices",
      "Discussions on the future of AI workforce development, governance, and innovation ecosystems",
    ],
  },
];
