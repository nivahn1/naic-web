import type { SealMark } from "../../_components/Seal";

export type Certification = {
  slug: string;
  code: string;
  name: string;
  /** Curved lettering and center mark for the certification seal — used as
   *  a fallback where there's no dedicated `logo` badge. */
  emblem: SealMark;
  /** Program logo lockup, if a real badge has been supplied. */
  logo?: { src: string; width: number; height: number };
  /** Short pitch shown under the seal on the index page. */
  blurb: string;
  /** Registration price, in cents. */
  priceCents: number;
  audience: string;
  duration: string;
  assessment: string;
  curriculum: string[];
};

export const CERTIFICATIONS: Certification[] = [
  {
    slug: "ai-certified-professional",
    code: "AI-CP",
    name: "AI Certified Professional",
    logo: {
      src: "/brand/certification/ai-certified-professional.png",
      width: 1096,
      height: 1096,
    },
    emblem: {
      top: "AI CERTIFIED",
      bottom: "PROFESSIONAL",
      glyph: "medal",
      color: {
        disc: "#1c3d6e",
        discDark: "#3b6db8",
        ink: "#1c3d6e",
        inkDark: "#b6ccea",
      },
    },
    blurb:
      "For entry to mid-level professionals, non-technical leaders, educators, and anyone new to AI.",
    priceCents: 59900,
    audience:
      "Entry to mid-level professionals, non-technical leaders, educators, and anyone new to AI",
    duration: "1.5 days of interactive training sessions",
    assessment: "Exit exam required for certification",
    curriculum: [
      "Fundamental AI concepts and terminology",
      "Machine learning, deep learning, and natural language processing overview",
      "Key AI tools and platforms",
      "Ethical considerations and responsible AI principles",
      "Current industry trends and real-world applications",
      "Organizational AI readiness strategies",
    ],
  },
  {
    slug: "ai-senior-certified-professional",
    code: "AI-SCP",
    name: "AI Senior Certified Professional",
    logo: {
      src: "/brand/certification/ai-senior-certified-professional.png",
      width: 1107,
      height: 1107,
    },
    emblem: {
      top: "AI SENIOR CERTIFIED",
      bottom: "PROFESSIONAL",
      glyph: "laurel",
      color: {
        disc: "#7f1d1d",
        discDark: "#b91c1c",
        ink: "#7f1d1d",
        inkDark: "#f3c2c2",
      },
    },
    blurb:
      "For senior professionals, engineers, project managers, consultants, and technical leaders overseeing AI development and implementation.",
    priceCents: 99900,
    audience:
      "Senior professionals, engineers, project managers, consultants, and technical leaders overseeing AI development and implementation",
    duration: "2 days of advanced workshops, case studies, and hands-on labs",
    assessment: "Capstone project and comprehensive technical exam required",
    curriculum: [
      "Advanced machine learning and deep learning architectures",
      "Natural language processing and generative AI applications",
      "AI system design, deployment, and performance scaling",
      "Governance, compliance, and risk management",
      "Ethical frameworks and accountability",
      "Business workflow integration strategies",
    ],
  },
  {
    slug: "ai-executive-professional",
    code: "AI-EP",
    name: "AI Executive Professional",
    logo: {
      src: "/brand/certification/ai-executive-professional.png",
      width: 1135,
      height: 1135,
    },
    emblem: {
      top: "AI EXECUTIVE",
      bottom: "PROFESSIONAL",
      glyph: "rising",
      color: {
        disc: "#0c4a6e",
        discDark: "#0284c7",
        ink: "#0c4a6e",
        inkDark: "#bae6fd",
      },
    },
    blurb:
      "For C-suite executives, board directors, policymakers, and senior program leaders responsible for strategic AI direction.",
    priceCents: 159900,
    audience:
      "C-suite executives, board directors, policymakers, and senior program leaders responsible for strategic AI direction",
    duration:
      "2 days of executive-level seminars, case studies, and strategic planning",
    assessment: "Strategic AI roadmap and executive evaluation required",
    curriculum: [
      "Global AI landscape and emerging economic trends",
      "Market and workforce impact analysis",
      "Enterprise-wide AI strategy and alignment",
      "Governance, risk management, and regulatory oversight",
      "Ethical leadership and stakeholder accountability",
      "Executive investment strategy (capstone)",
    ],
  },
];

export function getCertification(slug: string) {
  return CERTIFICATIONS.find((c) => c.slug === slug);
}
