"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TIER_IDS } from "@/lib/tiers";

const NOT_CONFIGURED: FormResult = {
  error: "Authentication isn’t configured yet.",
};

export type FormResult = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const ProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(120, { error: "That name is too long." })
    .trim(),
});

const TierSchema = z.object({
  membership_tier: z.enum(TIER_IDS, { error: "Pick a valid plan." }),
});

export async function updateProfile(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = ProfileSchema.safeParse({
    full_name: formData.get("full_name"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please sign in again." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Keep the name in auth metadata in sync too.
  await supabase.auth.updateUser({
    data: { full_name: parsed.data.full_name },
  });

  revalidatePath("/portal", "layout");
  return { ok: true };
}

export async function updateMembership(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = TierSchema.safeParse({
    membership_tier: formData.get("membership_tier"),
  });
  if (!parsed.success) {
    return { error: "Pick a valid plan." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please sign in again." };

  const { error } = await supabase
    .from("profiles")
    .update({ membership_tier: parsed.data.membership_tier })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/portal", "layout");
  return { ok: true };
}
