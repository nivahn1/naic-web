export type Week = {
  slug: string;
  name: string;
  when: string;
  /** ISO date, UTC — kept in sync with `when` for chronological sorting. Omitted when undated. */
  start?: string;
  end?: string;
  body: string;
};

export const WEEKS: Week[] = [
  {
    slug: "national-ai-emerging-leaders-week",
    name: "National AI Emerging Leaders Week™",
    when: "April 20–24, 2026",
    start: "2026-04-20",
    end: "2026-04-24",
    body: "A nationwide initiative designed to empower the next generation of innovators, strategists, and professionals shaping the future of AI. Through panels, mentorship sessions, and interactive learning, students and early-career professionals develop skills in leadership, innovation, and responsible AI use — and connect with established leaders.",
  },
  {
    slug: "ai-leadership-week",
    name: "AI Leadership Week™",
    when: "May 11–14, 2026",
    start: "2026-05-11",
    end: "2026-05-14",
    body: "A focused initiative equipping current and future leaders with the vision, strategy, and skills to guide organizations in the age of AI. Executives, policymakers, entrepreneurs, and innovators explore responsible governance, ethical decision-making, and the practical integration of AI into enterprise strategy.",
  },
  {
    slug: "national-ai-womens-week",
    name: "National AI Women's Week™",
    when: "March 9–13, 2026",
    start: "2026-03-09",
    end: "2026-03-13",
    body: "Celebrates the leadership, achievements, and contributions of women shaping the future of artificial intelligence. Keynote sessions, workshops, and mentorship forums highlight women's impact and foster professional networks.",
  },
  {
    slug: "national-ai-week",
    name: "National AI Week™",
    when: "November 16–20, 2026",
    start: "2026-11-16",
    end: "2026-11-20",
    body: "A nationwide initiative to explore the impact, opportunities, and challenges of artificial intelligence. Designed to engage students, educators, businesses, and policymakers, it offers a platform for discussion, education, and inspiration around ethical and inclusive AI development.",
  },
  {
    slug: "national-multicultural-ai-week",
    name: "National Multicultural AI Week™",
    when: "2026",
    // No specific date announced yet — left undated (shows as "Date TBD").
    body: "Recognizes the global and cultural dimensions of artificial intelligence, emphasizing the need for systems that reflect diverse worldviews, languages, and experiences.",
  },
];
