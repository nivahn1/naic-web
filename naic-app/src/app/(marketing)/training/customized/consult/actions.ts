"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ConsultResult = {
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

const ConsultSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(120, { error: "That name is too long." }),
  email: z.email({ error: "Enter a valid email." }).max(254),
  phone: optionalText(40),
  company: z
    .string()
    .trim()
    .min(1, { error: "Enter your company or organization." })
    .max(160, { error: "That value is too long." }),
  format: optionalText(80),
  message: z
    .string()
    .trim()
    .min(20, { error: "Tell us a little more — at least 20 characters." })
    .max(4000, { error: "Please keep this under 4000 characters." }),
});

export async function submitConsultRequest(
  _prev: ConsultResult,
  formData: FormData,
): Promise<ConsultResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "This form isn’t wired up yet. Email web@nationalaiconsortium.org instead.",
    };
  }

  // Honeypot: a field only a bot would fill in.
  if (formData.get("website")) return { ok: true };

  const parsed = ConsultSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    format: formData.get("format"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("customized_training_consultations")
    .insert({ ...parsed.data, submitted_by: user?.id ?? null });

  if (error) {
    return { error: "That didn’t send. Please try again in a moment." };
  }

  return { ok: true };
}
