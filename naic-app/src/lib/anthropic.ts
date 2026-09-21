import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export const isAnthropicConfigured = Boolean(ANTHROPIC_API_KEY);

/** Server-only. Never import this from a Client Component. */
export const anthropic = ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  : null;
