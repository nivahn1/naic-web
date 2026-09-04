export type BoardMember = {
  slug: string;
  name: string;
  /** Role / title lines, shown in violet under the name. */
  roles: string[];
  /** Employer or affiliation, shown muted beneath the roles. */
  org?: string;
  /** Path under /public if a headshot has been added; falls back to initials. */
  photo?: string;
};

/** Order mirrors the public site — the President leads. */
export const BOARD: BoardMember[] = [
  {
    slug: "miracle-johnson",
    name: "Miracle Johnson, Ph.D.",
    roles: [
      "President, Board of Directors, National AI Consortium",
      "Director, Finance and AI Strategy Transformation",
    ],
    org: "Hewlett Packard Enterprise",
    photo: "/people/miracle-johnson.jpg",
  },
  {
    slug: "himanshu-kalkar",
    name: "Himanshu Kalkar",
    roles: [
      "Senior Vice President and Head of AI Enablement and Shared Services",
    ],
    org: "Fidelity Investments",
    photo: "/people/himanshu-kalkar.jpg",
  },
  {
    slug: "jyotirmay-gadewadikar",
    name: "Jyotirmay Gadewadikar",
    roles: [
      "Chief of AI & Systems Engineering – Systems Engineering Innovation Center",
    ],
    org: "MITRE",
    photo: "/people/jyotirmay-gadewadikar.jpg",
  },
  {
    slug: "mark-brady",
    name: "Mark Brady, Ph.D.",
    roles: ["Chief Scientist"],
    org: "TRMC / KBR",
    photo: "/people/mark-brady.jpg",
  },
  {
    slug: "alan-debekker",
    name: "Alan DeBekker",
    roles: ["Principal, Technology Strategy, Cloud & AI Transformation"],
    org: "Incoming Tide Partners",
    photo: "/people/alan-debekker.jpg",
  },
  {
    slug: "jobi-martinez",
    name: "Jobi Martinez, PhD",
    roles: ["Vice President of Workforce and Community Connections"],
    org: "Harris Health System",
    photo: "/people/jobi-martinez.jpg",
  },
  {
    slug: "shane-portfolio",
    name: "Shane Portfolio, Ph.D.",
    roles: ["EVP Data Center Strategy and Growth"],
    org: "SRI Telecom",
    photo: "/people/shane-portfolio.jpg",
  },
  {
    slug: "carlos-ayala",
    name: "Carlos Ayala",
    roles: ["Founder, Managing Partner"],
    org: "MENTORA LLC.",
    photo: "/people/carlos-ayala.jpg",
  },
  {
    slug: "crystal-booker",
    name: "Dr. Crystal Booker",
    roles: ["MD"],
    photo: "/people/crystal-booker.jpg",
  },
  {
    slug: "tamika-baker",
    name: "Tamika Baker",
    roles: [
      "C-suite Leader & Speaker",
      "Enterprise Risk Management & Strategy",
    ],
    photo: "/people/tamika-baker.jpg",
  },
];

/** Two-letter monogram for the fallback avatar, honorifics stripped. */
export function initials(name: string): string {
  const cleaned = name
    .replace(/,.*$/, "")
    .replace(/\b(?:Dr|Mr|Mrs|Ms|Prof)\.?\s*/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
