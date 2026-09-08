import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/profile";

/**
 * The signed-in user together with their profile, but only when that profile
 * carries `role = 'admin'`. Returns nulls otherwise — never throws, so a
 * caller can decide between hiding a link and blocking a route.
 */
export async function getAdmin() {
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

  if (profile?.role !== "admin") return { user: null, profile: null };

  return { user, profile };
}

/**
 * Route guard for everything under /admin. Renders the 404 page rather than
 * redirecting: a signed-in member who guesses the URL learns nothing about
 * whether an admin area exists.
 *
 * The database enforces this independently — every admin query relies on an
 * RLS policy calling public.is_admin() — so this is the ergonomic layer, not
 * the security boundary.
 */
export async function requireAdmin() {
  const { user, profile } = await getAdmin();
  if (!user || !profile) notFound();
  return { user, profile };
}

/** Same check for Server Actions, which need a value back rather than a page. */
export async function assertAdmin() {
  const { user } = await getAdmin();
  if (!user) throw new Error("Not authorised.");
  return user;
}

/** True when the signed-in user is an admin. For conditionally showing links. */
export async function isCurrentUserAdmin() {
  const { user } = await getAdmin();
  return Boolean(user);
}
