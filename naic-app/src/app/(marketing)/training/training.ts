import type { SealMark } from "../../_components/Seal";

export type Training = {
  slug: string;
  name: string;
  /** Curved lettering and center mark for the training seal — used as a
   *  fallback where there's no dedicated `logo` lockup. */
  emblem: SealMark;
  /** Program logo lockup — dark ink on a transparent PNG, needs a light card behind it. */
  logo?: { src: string; width: number; height: number };
  /** Short pitch shown under the seal on the index page. */
  blurb: string;
  overview: string;
  audience: string;
  focus: string[];
  outcome?: string;
  /** Extra grouped detail — used by the customized track. */
  groups?: { title: string; items: string[] }[];
};

export const TRAININGS: Training[] = [
  {
    slug: "business-transformation",
    name: "AI for Business Transformation™",
    logo: {
      src: "/brand/training/business-transformation.png",
      width: 364,
      height: 106,
    },
    emblem: {
      top: "AI FOR BUSINESS",
      bottom: "TRANSFORMATION",
      glyph: "business",
      color: {
        disc: "#155e75",
        discDark: "#22a2c4",
        ink: "#155e75",
        inkDark: "#a9dcec",
      },
    },
    blurb:
      "Practical training for executives, managers, and decision-makers on integrating AI into business strategy and operations.",
    overview:
      "Practical training for executives, managers, and decision-makers on integrating AI into business strategy and operations — pairing where AI creates value with what it takes to actually adopt it.",
    audience: "Executives, managers, and decision-makers",
    focus: [
      "Identifying opportunities for AI-driven efficiency and growth",
      "Building AI-ready organizational cultures",
      "Case studies in finance, healthcare, retail, and logistics",
    ],
    outcome:
      "Participants learn how to drive innovation and create measurable business impact with AI adoption.",
  },
  {
    slug: "policy-regulation-compliance",
    name: "AI Policy, Regulation & Compliance™",
    logo: {
      src: "/brand/training/policy-regulation-compliance.png",
      width: 616,
      height: 128,
    },
    emblem: {
      top: "AI POLICY",
      bottom: "& COMPLIANCE",
      glyph: "policy",
      color: {
        disc: "#92400e",
        discDark: "#d18327",
        ink: "#92400e",
        inkDark: "#f4cfa2",
      },
    },
    blurb:
      "A program for policymakers, legal teams, and compliance officers navigating the evolving landscape of AI regulation.",
    overview:
      "A program for policymakers, legal teams, and compliance officers navigating the evolving landscape of AI regulation — covering the frameworks now taking shape and the governance practices that satisfy them.",
    audience: "Policymakers, legal teams, and compliance officers",
    focus: [
      "Global AI policy trends and regulatory frameworks",
      "Risk management, data governance, and ethical compliance",
      "Building responsible AI adoption strategies",
    ],
    outcome:
      "Graduates understand how to align AI initiatives with legal requirements and societal expectations.",
  },
  {
    slug: "generative-ai",
    name: "Generative AI & Creative Innovation™",
    logo: {
      src: "/brand/training/generative-ai.png",
      width: 613,
      height: 249,
    },
    emblem: {
      top: "GENERATIVE AI",
      bottom: "& INNOVATION",
      glyph: "generative",
      color: {
        disc: "#3730a3",
        discDark: "#6366f1",
        ink: "#3730a3",
        inkDark: "#c3c6f7",
      },
    },
    blurb:
      "Training focused on using generative AI tools — LLMs, image models, and multimodal systems — for innovation across industries.",
    overview:
      "Training focused on using generative AI tools — LLMs, image models, and multimodal systems — for innovation across industries, from day-to-day workflow gains to new product and research directions.",
    audience:
      "Professionals across industries putting generative AI tools to work",
    focus: [
      "Prompt engineering and workflow optimization",
      "Generative AI in marketing, design, product development, and research",
      "Creative problem-solving using AI augmentation",
    ],
    outcome:
      "Participants develop skills to harness generative AI responsibly and creatively, enhancing productivity and innovation.",
  },
  {
    slug: "customized",
    name: "Customized AI Training",
    emblem: {
      top: "CUSTOMIZED AI",
      bottom: "TRAINING",
      glyph: "custom",
      color: {
        disc: "#831843",
        discDark: "#c53b78",
        ink: "#831843",
        inkDark: "#f3bcd4",
      },
    },
    blurb:
      "Tailored programs for organizations, teams, and individuals, built around your specific AI needs, industry requirements, and experience levels.",
    overview:
      "Tailored programs for organizations, teams, and individuals based on specific AI needs, industry requirements, and experience levels — scoped with you rather than taken off the shelf.",
    audience: "Organizations, teams, and individuals",
    focus: [
      "Organizational reskilling and upskilling strategies",
      "Team-focused technical workshops for data, engineering, and operations",
      "Personalized tracks for beginners, mid-career professionals, or advanced practitioners",
    ],
    groups: [
      {
        title: "Program formats",
        items: [
          "Organizational programs",
          "Team-focused modules",
          "Individual pathways",
        ],
      },
      {
        title: "How it is delivered",
        items: [
          "On-demand learning modules",
          "Hands-on projects",
          "Industry-specific tracks for healthcare, finance, retail, energy, and government",
        ],
      },
    ],
  },
];

export function getTraining(slug: string) {
  return TRAININGS.find((t) => t.slug === slug);
}
