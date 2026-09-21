import type { NextRequest } from "next/server";
import { anthropic, isAnthropicConfigured } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTier } from "@/lib/tiers";
import { buildKnowledgeBase } from "@/lib/chatbot/knowledge";
import { getMemberRegistrationsSummary } from "@/lib/chatbot/member-context";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

function isValidMessages(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_MESSAGES &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
  );
}

async function buildPersonalization(): Promise<string> {
  if (!isSupabaseConfigured) return "The visitor is not signed in.";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "The visitor is not signed in.";

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, membership_tier")
    .eq("id", user.id)
    .single();

  const tier = getTier(profile?.membership_tier);
  const registrations = await getMemberRegistrationsSummary(user.id);

  return [
    `The visitor is signed in as ${profile?.full_name || user.email}.`,
    `Their membership tier is ${tier.name} (${tier.tag}): ${tier.features.join(", ")}.`,
    registrations.length > 0
      ? `Their registrations on file: ${registrations.join("; ")}.`
      : "They have no registrations on file yet.",
    "Use this to personalize answers (e.g. what their tier includes, or what they're already registered for) — don't recite this block back to them verbatim.",
  ].join(" ");
}

export async function POST(req: NextRequest) {
  if (!isAnthropicConfigured || !anthropic) {
    return new Response("The assistant isn't set up yet — email web@nationalaiconsortium.org instead.", {
      status: 503,
    });
  }

  const body = await req.json().catch(() => null);
  if (!body || !isValidMessages((body as { messages?: unknown }).messages)) {
    return new Response("Invalid request.", { status: 400 });
  }
  const messages = (body as { messages: ChatMessage[] }).messages;

  const personalization = await buildPersonalization();

  const stream = anthropic.messages.stream({
    // Cheapest current model ($1 / $5 per MTok) — revisit once usage picks up.
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: buildKnowledgeBase(),
        cache_control: { type: "ephemeral" },
      },
      { type: "text", text: personalization },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
