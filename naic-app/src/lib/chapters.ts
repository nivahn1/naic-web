export type Region = "West" | "Midwest" | "South" | "Northeast";

export type State = {
  abbr: string;
  name: string;
  region: Region;
};

/** All 50 states, grouped by US Census region. */
export const STATES: State[] = [
  // West
  { abbr: "AK", name: "Alaska", region: "West" },
  { abbr: "AZ", name: "Arizona", region: "West" },
  { abbr: "CA", name: "California", region: "West" },
  { abbr: "CO", name: "Colorado", region: "West" },
  { abbr: "HI", name: "Hawaii", region: "West" },
  { abbr: "ID", name: "Idaho", region: "West" },
  { abbr: "MT", name: "Montana", region: "West" },
  { abbr: "NV", name: "Nevada", region: "West" },
  { abbr: "NM", name: "New Mexico", region: "West" },
  { abbr: "OR", name: "Oregon", region: "West" },
  { abbr: "UT", name: "Utah", region: "West" },
  { abbr: "WA", name: "Washington", region: "West" },
  { abbr: "WY", name: "Wyoming", region: "West" },
  // Midwest
  { abbr: "IL", name: "Illinois", region: "Midwest" },
  { abbr: "IN", name: "Indiana", region: "Midwest" },
  { abbr: "IA", name: "Iowa", region: "Midwest" },
  { abbr: "KS", name: "Kansas", region: "Midwest" },
  { abbr: "MI", name: "Michigan", region: "Midwest" },
  { abbr: "MN", name: "Minnesota", region: "Midwest" },
  { abbr: "MO", name: "Missouri", region: "Midwest" },
  { abbr: "NE", name: "Nebraska", region: "Midwest" },
  { abbr: "ND", name: "North Dakota", region: "Midwest" },
  { abbr: "OH", name: "Ohio", region: "Midwest" },
  { abbr: "SD", name: "South Dakota", region: "Midwest" },
  { abbr: "WI", name: "Wisconsin", region: "Midwest" },
  // South
  { abbr: "AL", name: "Alabama", region: "South" },
  { abbr: "AR", name: "Arkansas", region: "South" },
  { abbr: "DE", name: "Delaware", region: "South" },
  { abbr: "FL", name: "Florida", region: "South" },
  { abbr: "GA", name: "Georgia", region: "South" },
  { abbr: "KY", name: "Kentucky", region: "South" },
  { abbr: "LA", name: "Louisiana", region: "South" },
  { abbr: "MD", name: "Maryland", region: "South" },
  { abbr: "MS", name: "Mississippi", region: "South" },
  { abbr: "NC", name: "North Carolina", region: "South" },
  { abbr: "OK", name: "Oklahoma", region: "South" },
  { abbr: "SC", name: "South Carolina", region: "South" },
  { abbr: "TN", name: "Tennessee", region: "South" },
  { abbr: "TX", name: "Texas", region: "South" },
  { abbr: "VA", name: "Virginia", region: "South" },
  { abbr: "WV", name: "West Virginia", region: "South" },
  // Northeast
  { abbr: "CT", name: "Connecticut", region: "Northeast" },
  { abbr: "ME", name: "Maine", region: "Northeast" },
  { abbr: "MA", name: "Massachusetts", region: "Northeast" },
  { abbr: "NH", name: "New Hampshire", region: "Northeast" },
  { abbr: "NJ", name: "New Jersey", region: "Northeast" },
  { abbr: "NY", name: "New York", region: "Northeast" },
  { abbr: "PA", name: "Pennsylvania", region: "Northeast" },
  { abbr: "RI", name: "Rhode Island", region: "Northeast" },
  { abbr: "VT", name: "Vermont", region: "Northeast" },
];

/**
 * States with a chapter operating today. Everything else is shown as forming
 * ahead of the 2026 national launch — update this list as chapters go live.
 */
export const LIVE_CHAPTERS = new Set([
  "CA",
  "CO",
  "FL",
  "GA",
  "IL",
  "MI",
  "NJ",
  "NY",
  "OH",
  "PA",
  "TX",
  "VA",
  "WA",
]);

export const REGIONS: Region[] = ["West", "Midwest", "South", "Northeast"];

export const isLive = (abbr: string) => LIVE_CHAPTERS.has(abbr);

export const LIVE_COUNT = LIVE_CHAPTERS.size;
export const STATE_COUNT = STATES.length;
