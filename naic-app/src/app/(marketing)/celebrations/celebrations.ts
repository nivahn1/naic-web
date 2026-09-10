export type Celebration = {
  slug: string;
  name: string;
  when: string;
  /** ISO date, UTC — kept in sync with `when` for chronological sorting. */
  start: string;
  end: string;
  theme: string;
  body: string;
};

export const CELEBRATIONS: Celebration[] = [
  {
    slug: "national-ai-month",
    name: "National AI Month™",
    when: "July 15 – August 15",
    start: "2026-07-15",
    end: "2026-08-15",
    theme: "Advancing Innovation, Responsibility, and Opportunity in Artificial Intelligence",
    body: "A nationwide initiative dedicated to exploring the evolving role of artificial intelligence in shaping the future of business, technology, and society. Throughout the month, professionals from all sectors come together to examine key trends in AI development, responsible use, and emerging career pathways. Through webinars, expert panels, and interactive sessions, participants gain insight into real-world applications, ethical considerations, and how to harness AI to drive innovation, productivity, and growth.",
  },
  {
    slug: "national-ai-womens-month",
    name: "National AI Women's Month™",
    when: "May 15 – June 15",
    start: "2026-05-15",
    end: "2026-06-15",
    theme: "Celebrating Leadership and Impact in Artificial Intelligence",
    body: "A nationwide initiative recognizing the achievements, leadership, and innovation of women in artificial intelligence — spotlighting women driving advancements in AI research, policy, entrepreneurship, and industry transformation. Through keynote sessions, panels, mentorship forums, and networking events, participants explore strategies for professional growth, leadership development, and innovation. The celebration amplifies women's contributions, highlights groundbreaking work across disciplines, and inspires continued participation in shaping the future of AI.",
  },
];
