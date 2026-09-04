import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { TierId } from "@/lib/tiers";

export type Role = "member" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  membership_tier: TierId;
  role: Role;
  created_at: string;
  updated_at: string;
};

/**
 * Returns the signed-in user and their profile row, or nulls if not signed in.
 * The profile row is created automatically by a DB trigger on sign-up
 * (see supabase/schema.sql).
 */
export async function getCurrentProfile() {
  if (!isSupabaseConfigured) return { user: null, profile: null };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { user, profile };
}
