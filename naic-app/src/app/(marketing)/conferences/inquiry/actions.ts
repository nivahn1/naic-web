"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CONFERENCES } from "../conferences";

export type InquiryResult = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const CONFERENCE_SLUGS = CONFERENCES.map((c) => c.slug) as [string, ...string[]];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "That value is too long." })
    .optional()
    .transform((v) => (v ? v : null));

const InquirySchema = z.object({
  conference_slugs: z
    .array(z.enum(CONFERENCE_SLUGS))
    .min(1, { error: "Choose at least one conference." }),
  organization_name: z
    .string()
    .trim()
    .min(1, { error: "Enter your organization's name." })
    .max(160, { error: "That name is too long." }),
  organization_type: z.enum(["nonprofit", "government"], {
    error: "Choose an organization type.",
  }),
  full_name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(120, { error: "That name is too long." }),
  email: z.email({ error: "Enter a valid email." }).max(254),
  phone: optionalText(40),
  message: optionalText(4000),
});

export async function submitInquiry(
  _prev: InquiryResult,
  formData: FormData,
): Promise<InquiryResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "This form isn’t wired up yet. Email web@nationalaiconsortium.org instead.",
    };
  }

  // Honeypot: a field only a bot would fill in.
  if (formData.get("website")) return { ok: true };

  const parsed = InquirySchema.safeParse({
    conference_slugs: formData.getAll("conference_slugs"),
    organization_name: formData.get("organization_name"),
    organization_type: formData.get("organization_type"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const conferences = parsed.data.conference_slugs.map(
    (slug) => CONFERENCES.find((c) => c.slug === slug)!,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("conference_inquiries").insert({
    conference_slugs: conferences.map((c) => c.slug),
    organization_name: parsed.data.organization_name,
    organization_type: parsed.data.organization_type,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
    submitted_by: user?.id ?? null,
  });

  if (error) {
    return { error: "That didn’t send. Please try again in a moment." };
  }

  return { ok: true };
}
