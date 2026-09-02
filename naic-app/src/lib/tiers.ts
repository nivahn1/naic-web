// Individual membership tiers — mirrors the pricing on the landing page.
// Selecting a tier in the portal does NOT take payment; it records intent.

export type TierId =
  | "free"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond";

export type Tier = {
  id: TierId;
  name: string;
  price: string;
  priceValue: number;
  tag: string;
  features: string[];
};

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceValue: 0,
    tag: "Free access",
    features: ["Toolkit access", "Community updates"],
  },
  {
    id: "bronze",
    name: "Bronze",
    price: "$199",
    priceValue: 199,
    tag: "Starter access",
    features: [
      "1 webinar / year",
      "1 event / year",
      "Networking lounge access",
      "10% off conferences & certifications",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: "$799",
    priceValue: 799,
    tag: "Growth member",
    features: [
      "3 webinars / year",
      "2 events / year",
      "1 conference pass",
      "15% off certifications",
      "Member community & job board",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "$1,999",
    priceValue: 1999,
    tag: "Professional member",
    features: [
      "6 webinars / year",
      "4 events / year",
      "2 conference passes",
      "1 certification included",
      "20% off Programs",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$3,499",
    priceValue: 3499,
    tag: "Executive member",
    features: [
      "All 6 webinars & 4 events",
      "All 4 conferences",
      "1 celebration ticket",
      "1 certification",
      "VIP networking & roundtables",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    price: "$5,999",
    priceValue: 5999,
    tag: "Consortium Fellow",
    features: [
      "Everything in Platinum",
      "1 full Program included",
      "Recognition as Consortium Fellow",
      "Private leadership sessions",
    ],
  },
];

export const TIER_IDS = TIERS.map((t) => t.id) as [TierId, ...TierId[]];

export function getTier(id: string | null | undefined): Tier {
  return TIERS.find((t) => t.id === id) ?? TIERS[0];
}
