export type WebinarItem = {
  slug: string;
  title: string;
  /** ISO date, UTC. */
  date: string;
  body: string;
};

export const WEBINARS: WebinarItem[] = [
  {
    slug: "ai-trends-forecast-2026",
    title: "AI Trends & Forecast: What’s Ahead in 2026 and Beyond",
    date: "2026-01-29",
    body: "A forward-looking session on where AI is headed in 2026 and beyond, from emerging models to shifting enterprise priorities. Speakers unpack the trends worth tracking and what they mean for your organization's roadmap.",
  },
  {
    slug: "responsible-ai-transparent-trustworthy-systems",
    title: "Responsible AI: Building Transparent and Trustworthy Systems",
    date: "2026-03-19",
    body: "A practical look at designing AI systems that are transparent, explainable, and worthy of user trust. We'll cover frameworks and real-world practices for responsible AI development teams can put to use right away.",
  },
  {
    slug: "women-leading-the-future-of-ai",
    title: "Women Leading the Future of AI",
    date: "2026-05-14",
    body: "A conversation with women leading AI research, product, and policy work across industries. Hear how they're shaping the field and what it takes to build a career in AI today.",
  },
  {
    slug: "ai-in-healthcare-innovation-with-responsibility",
    title: "AI in Healthcare: Innovation with Responsibility",
    date: "2026-09-10",
    body: "An examination of how AI is transforming diagnostics, care delivery, and health outcomes — and the responsibility that comes with it. We'll discuss both the opportunities and the guardrails healthcare organizations need.",
  },
  {
    slug: "ai-climate-solutions-technology-for-sustainability",
    title: "AI & Climate Solutions: Technology for Sustainability",
    date: "2026-10-22",
    body: "A look at how AI is being applied to climate modeling, resource management, and sustainability initiatives. Speakers share case studies on measurable environmental impact.",
  },
  {
    slug: "ai-in-finance-risk-regulation-opportunity",
    title: "AI in Finance: Risk, Regulation & Opportunity",
    date: "2026-11-09",
    body: "A session on how financial institutions are using AI for risk management, fraud detection, and decision-making — and the regulatory landscape shaping that work. We'll cover both the opportunity and the compliance considerations.",
  },
];

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

/** "Jan 29, 2026" for display. */
export function webinarDateLabel(webinar: WebinarItem) {
  const d = new Date(`${webinar.date}T00:00:00Z`);
  return `${MONTH.format(d)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Jan 29" — no year, for compact display (e.g. the homepage calendar). */
export function webinarDateShortLabel(webinar: WebinarItem) {
  const d = new Date(`${webinar.date}T00:00:00Z`);
  return `${MONTH.format(d)} ${d.getUTCDate()}`;
}
