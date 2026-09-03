import type { SealMark } from "../../_components/Seal";

export const SUBMISSION_DEADLINE = "November 7, 2026";

export const AWARD_CATEGORIES = [
  {
    name: "AI Innovation Award",
    body: "Celebrating individuals and organizations that have introduced groundbreaking AI technologies or applications that have transformed their industries.",
  },
  {
    name: "Ethical AI Leadership Award",
    body: "Honoring those who have demonstrated exceptional leadership in promoting and implementing ethical AI practices.",
  },
  {
    name: "AI Research Impact Award",
    body: "Recognizing significant contributions to AI research that have advanced our understanding of AI and its potential.",
  },
];

export type HonorList = {
  slug: string;
  name: string;
  emblem: SealMark;
  body: string;
  criteria: string[];
};

export const LISTS: HonorList[] = [
  {
    slug: "top-50-chief-ai-officers",
    name: "Top 50 Chief AI Officers",
    emblem: {
      top: "TOP 50",
      bottom: "CHIEF AI OFFICERS",
      glyph: "laurel",
      color: {
        disc: "#a16207",
        discDark: "#d3a017",
        ink: "#a16207",
        inkDark: "#f6dd9c",
      },
    },
    body: "Visionary executives steering the strategic AI agendas of enterprises, startups, and public organizations — building AI centers of excellence, advancing enterprise-wide adoption frameworks, and driving global AI maturity.",
    criteria: [
      "A track record of advancing groundbreaking AI technologies, policies, or frameworks with measurable industry or global impact",
      "Proven leadership guiding organizations, teams, or initiatives that drive strategic AI adoption",
      "Expertise aligning AI programs with corporate goals, innovation pipelines, or public missions",
      "Commitment to ethical, transparent, and responsible AI implementation at scale",
      "Evidence of building sustainable AI practices that future-proof organizations and industries",
      "Recognized thought leadership through speaking, publishing, mentorship, or community contributions",
    ],
  },
  {
    slug: "top-100-leaders-in-ai",
    name: "Top 100 Leaders in AI™",
    emblem: {
      top: "TOP 100",
      bottom: "LEADERS IN AI",
      glyph: "medal",
      color: {
        disc: "#7e22ce",
        discDark: "#a855f7",
        ink: "#7e22ce",
        inkDark: "#e2c9fb",
      },
    },
    body: "Researchers, practitioners, entrepreneurs, and executives shaping both technical advancement and AI business transformation, with measurable impact across diverse industries, sectors, and communities.",
    criteria: [
      "A track record of advancing impactful AI technologies, frameworks, or solutions with wide-scale influence",
      "Recognized leadership shaping teams, organizations, or industries through AI adoption and innovation",
      "Entrepreneurial drive or research excellence that sets benchmarks for others in the field",
      "Commitment to responsible AI practices ensuring ethical, inclusive, and sustainable deployment",
      "Success translating AI innovation into measurable organizational or societal benefits",
      "Active contributions to the broader AI ecosystem through collaboration, mentorship, or advocacy",
    ],
  },
  {
    slug: "ai-emerging-100",
    name: "AI Emerging 100™",
    emblem: {
      top: "AI EMERGING",
      bottom: "100",
      glyph: "rising",
      color: {
        disc: "#0f766e",
        discDark: "#17a99d",
        ink: "#0f766e",
        inkDark: "#9de0d8",
      },
    },
    body: "Early-career professionals and innovators shaping the next wave of AI — talent under 35 or within their first 10 years in the field, representing the entrepreneurial spirit and fresh perspectives redefining its future.",
    criteria: [
      "Early achievements that demonstrate significant promise in advancing AI innovation, research, or applications",
      "Creative, forward-thinking approaches that bring novel perspectives or breakthrough solutions",
      "Leadership potential shown through impactful projects, community engagement, or entrepreneurial ventures",
      "Active contributions to academic, open-source, or industry initiatives in AI",
      "Dedication to responsible and ethical AI practices even in early-stage projects",
      "Recognition by peers, mentors, or organizations as an emerging talent with long-term potential",
    ],
  },
];

/** Award options offered on the nomination form, in the order they appear. */
export const NOMINATION_AWARDS = [
  ...LISTS.map((l) => l.name),
  ...AWARD_CATEGORIES.map((a) => a.name),
];
