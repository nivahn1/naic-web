import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/profile";
import type { TierId } from "@/lib/tiers";

/**
 * Everything the admin area reads comes from two security-definer functions
 * (`admin_metrics`, `admin_members`) plus RLS policies that only open up for
 * `role = 'admin'` — see sections 8 and 9 of supabase/schema.sql. There is no
 * service-role key in this app, so a non-admin session simply gets nothing
 * back, even if it reaches these code paths.
 */

export type AdminMetrics = {
  members: {
    total: number;
    new_7d: number;
    new_30d: number;
    prev_30d: number;
    paid: number;
    admins: number;
  };
  accounts: {
    confirmed: number;
    unconfirmed: number;
    active_30d: number;
    never_signed_in: number;
  };
  tiers: Partial<Record<TierId, number>>;
  signups: { month: string; count: number }[];
  nominations: {
    total: number;
    new_30d: number;
    awards: Record<string, number>;
  };
  advisory: { total: number; new_30d: number };
};

export type AdminMember = {
  id: string;
  full_name: string | null;
  email: string;
  membership_tier: TierId;
  role: "member" | "admin";
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  total_count: number;
};

export type Nomination = {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_company: string | null;
  nominee_email: string;
  nominator_name: string;
  nominator_company: string | null;
  nominator_email: string;
  awards: string[];
  rationale: string;
  created_at: string;
};

export type AdvisoryApplication = {
  id: string;
  full_name: string;
  title: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  expertise: string | null;
  message: string;
  bio_path: string;
  headshot_path: string;
  created_at: string;
};

/** The signed-in user's profile, or nulls — with the admin flag resolved. */
export async function getAdminSession() {
  const { user, profile } = await getCurrentProfile();
  return { user, profile, isAdmin: profile?.role === "admin" };
}

/**
 * Guard for every page under /admin. proxy.ts already turns non-admins away,
 * so this is the belt-and-braces check that runs at render time.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/login");

  const { user, profile } = await getAdminSession();
  if (!user) redirect("/login?redirect=/admin");
  if (profile?.role !== "admin") redirect("/portal?error=admin-only");

  return { user, profile };
}

export async function getMetrics(): Promise<AdminMetrics | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_metrics");
  if (error || !data) return null;
  return data as AdminMetrics;
}

export async function getMembers({
  search = "",
  limit = 25,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_members", {
    search,
    lim: limit,
    off: offset,
  });
  if (error || !data) return [];
  return data as AdminMember[];
}

export async function getNominations(limit = 100): Promise<Nomination[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("nominations")
    .select(
      "id, nominee_name, nominee_title, nominee_company, nominee_email, nominator_name, nominator_company, nominator_email, awards, rationale, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Nomination[]) ?? [];
}

export async function getAdvisoryApplications(
  limit = 100,
): Promise<AdvisoryApplication[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("advisory_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AdvisoryApplication[]) ?? [];
}

/**
 * Short-lived download links for the bio + headshot attached to an
 * application. The bucket is private; only the admin storage policy makes
 * these signable.
 */
export async function signApplicationFiles(paths: string[], expiresIn = 300) {
  if (!paths.length) return new Map<string, string>();

  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("advisory-applications")
    .createSignedUrls(paths, expiresIn);

  const urls = new Map<string, string>();
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
  }
  return urls;
}
