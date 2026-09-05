import type { SealMark } from "../../_components/Seal";

export type Program = {
  slug: string;
  name: string;
  /** Curved lettering and center mark for the program seal — used as a
   *  fallback where there's no dedicated `logo` badge. */
  emblem: SealMark;
  /** Program logo badge (square, transparent outside the circle). */
  logo?: { src: string; width: number; height: number };
  /** Short pitch shown under the seal on the index page. */
  blurb: string;
  overview: string;
  structure: string[];
  modules?: string[];
  learn: string[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "emerging-leadership",
    name: "AI Emerging Leadership Program",
    logo: {
      src: "/brand/programs/emerging-leadership.png",
      width: 1254,
      height: 1254,
    },
    emblem: {
      top: "AI EMERGING",
      bottom: "LEADERSHIP PROGRAM",
      glyph: "leadership",
      color: {
        disc: "#1c3d6e",
        discDark: "#3b6db8",
        ink: "#1c3d6e",
        inkDark: "#b6ccea",
      },
    },
    blurb:
      "Develop both your leadership and AI literacy through a six-month interactive experience designed for early-career professionals. Learn how to confidently guide AI conversations and initiatives while growing your personal leadership style.",
    overview:
      "A structured six-month experience designed to build both foundational AI literacy and essential leadership capabilities, combining technical knowledge with leadership development so participants can guide AI conversations and projects early in their careers.",
    structure: [
      "Duration: 6 months — one half-day session per month",
      "Format: Interactive workshops, leadership exercises, applied case studies, and peer collaboration",
      "Certificate awarded upon successful completion of all sessions",
    ],
    modules: [
      "Foundations of AI & Leadership",
      "Machine Learning & Decision-Making",
      "Natural Language Processing & Communication Skills",
      "Generative AI & Creativity in Leadership",
      "Ethics, Collaboration & Responsible AI",
      "Capstone & Future Pathways",
    ],
    learn: [
      "Core AI concepts and their practical applications across industries",
      "Beginner-friendly exposure to machine learning, NLP, and generative AI",
      "Leadership skills — communication, collaboration, and ethical decision-making",
      "How to combine AI literacy with leadership strategies to impact organizations and communities",
    ],
  },
  {
    slug: "ai-ethics",
    name: "AI Ethics Program",
    logo: {
      src: "/brand/programs/ai-ethics.png",
      width: 1254,
      height: 1254,
    },
    emblem: {
      top: "AI ETHICS",
      bottom: "PROGRAM",
      glyph: "ethics",
      color: {
        disc: "#1f4634",
        discDark: "#2f7a56",
        ink: "#1f4634",
        inkDark: "#a9d8c2",
      },
    },
    blurb:
      "Gain practical expertise in responsible AI through a six-month applied learning program. Explore real-world case studies and frameworks to strengthen ethical decision-making and governance in AI systems.",
    overview:
      "A structured six-month learning experience dedicated to responsible and equitable AI adoption. Each month covers a different module through a half-day seminar, blending theory, case studies, and real-world application.",
    structure: [
      "Duration: 6 months — one half-day seminar per month",
      "Format: Expert-led seminars, interactive discussions, and applied exercises",
      "Certificate awarded upon completion",
    ],
    modules: [
      "Foundations of AI Ethics & Responsible Innovation",
      "Fairness & Bias Mitigation in Data and Models",
      "Transparency & Accountability in AI Systems",
      "AI Governance & Regulatory Compliance",
      "Privacy, Security, and Data Protection in AI",
      "Future of Ethical AI: Balancing Innovation with Social Good",
    ],
    learn: [
      "Practical ethical frameworks and policies for AI",
      "Skills to design, evaluate, and advocate for responsible AI",
      "Recognition as a certified professional in AI Ethics",
    ],
  },
  {
    slug: "literacy-essentials",
    name: "AI Literacy Essentials Program",
    logo: {
      src: "/brand/programs/literacy-essentials.png",
      width: 1254,
      height: 1254,
    },
    emblem: {
      top: "AI LITERACY",
      bottom: "ESSENTIALS PROGRAM",
      glyph: "literacy",
      color: {
        disc: "#5b21b6",
        discDark: "#8b5cf6",
        ink: "#5b21b6",
        inkDark: "#d3c2f7",
      },
    },
    blurb:
      "Start from zero in a single half-day session. Understand what AI is, how it works, and where it already shapes healthcare, finance, and education — no technical background required.",
    overview:
      "A beginner-friendly half-day program designed to make artificial intelligence understandable and approachable for everyone — offered monthly, with no prior technical experience required.",
    structure: [
      "Duration: a single half-day session, offered monthly",
      "Format: Presentations, demonstrations, and interactive Q&A",
      "Certificate awarded after completing a designated session",
    ],
    learn: [
      "What AI is, how it works, and why it matters",
      "Real-world AI applications across healthcare, finance, and education",
      "A basic understanding of machine learning and generative AI",
      "Ethical considerations and responsible AI use",
      "Pathways to explore AI tools and resources further",
    ],
  },
  {
    slug: "college-pathways",
    name: "AI College Pathways Program",
    logo: {
      src: "/brand/programs/college-pathways.png",
      width: 1254,
      height: 1254,
    },
    emblem: {
      top: "AI COLLEGE",
      bottom: "PATHWAYS PROGRAM",
      glyph: "pathways",
      color: {
        disc: "#86198f",
        discDark: "#c026d3",
        ink: "#86198f",
        inkDark: "#f0c4f5",
      },
    },
    blurb:
      "Open the door to an AI career with scholarships, mentorship, and internship placements that connect students to the researchers and companies building the field.",
    overview:
      "A program designed to cultivate the next generation of AI professionals through learning opportunities, mentorship, and hands-on experience that goes beyond technical training.",
    structure: [
      "Duration: an academic-year cycle with flexible participation",
      "Format: Scholarships, mentorship pairings, and internship placements",
    ],
    learn: [
      "Scholarship access for AI-focused education and research",
      "Mentorship from AI leaders, academics, and industry professionals",
      "Internship opportunities for practical experience",
      "Networking across academia, startups, and enterprises",
      "A platform to showcase research, projects, and leadership potential",
    ],
  },
];

export function getProgram(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}
