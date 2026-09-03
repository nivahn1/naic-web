"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NOMINATION_AWARDS } from "./recognition";

export type NominationResult = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "That value is too long." })
    .optional()
    .transform((v) => (v ? v : null));

const NominationSchema = z.object({
  nominee_name: z
    .string()
    .trim()
    .min(2, { error: "Enter the nominee’s name." })
    .max(120, { error: "That name is too long." }),
  nominee_title: optionalText(160),
  nominee_company: optionalText(160),
  nominee_email: z
    .email({ error: "Enter a valid email for the nominee." })
    .max(254),
  nominee_phone: optionalText(40),
  nominator_name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(120, { error: "That name is too long." }),
  nominator_title: optionalText(160),
  nominator_company: optionalText(160),
  nominator_email: z.email({ error: "Enter a valid email." }).max(254),
  nominator_phone: optionalText(40),
  awards: z
    .array(z.enum(NOMINATION_AWARDS as [string, ...string[]]))
    .min(1, { error: "Pick at least one award." }),
  rationale: z
    .string()
    .trim()
    .min(40, { error: "Tell us a little more — at least 40 characters." })
    .max(4000, { error: "Please keep this under 4000 characters." }),
});

export async function submitNomination(
  _prev: NominationResult,
  formData: FormData,
): Promise<NominationResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Nominations aren’t wired up yet. Email web@nationalaiconsortium.org instead.",
    };
  }

  // Honeypot: a field only a bot would fill in.
  if (formData.get("website")) return { ok: true };

  const parsed = NominationSchema.safeParse({
    nominee_name: formData.get("nominee_name"),
    nominee_title: formData.get("nominee_title"),
    nominee_company: formData.get("nominee_company"),
    nominee_email: formData.get("nominee_email"),
    nominee_phone: formData.get("nominee_phone"),
    nominator_name: formData.get("nominator_name"),
    nominator_title: formData.get("nominator_title"),
    nominator_company: formData.get("nominator_company"),
    nominator_email: formData.get("nominator_email"),
    nominator_phone: formData.get("nominator_phone"),
    awards: formData.getAll("awards"),
    rationale: formData.get("rationale"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("nominations")
    .insert({ ...parsed.data, submitted_by: user?.id ?? null });

  if (error) {
    return { error: "That didn’t send. Please try again in a moment." };
  }

  return { ok: true };
}
