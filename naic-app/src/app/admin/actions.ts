"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getAdmin } from "@/lib/admin";
import { ROLES } from "@/lib/profile";
import { TIER_IDS } from "@/lib/tiers";

/**
 * Every action re-verifies the caller against the database. Server Actions are
 * addressable endpoints — the fact that the UI is only rendered for admins
 * proves nothing about who is calling.
 *
 * RLS is the real backstop: an authenticated non-admin's update or delete
 * simply matches no rows. These checks exist so the UI can say why.
 */

const Id = z.uuid();

/** Where to return to. Internal paths only, so this can't become an open redirect. */
function safePath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/admin") && !path.startsWith("//") ? path : fallback;
}

function back(path: string, params: { notice?: string; error?: string }): never {
  // Keep whatever filter/search the admin was looking at, and replace any
  // flash message already in the URL rather than stacking a second one.
  const [base, existing = ""] = path.split("?");
  const search = new URLSearchParams(existing);
  search.delete("notice");
  search.delete("error");
  if (params.error) search.set("error", params.error);
  else if (params.notice) search.set("notice", params.notice);
  redirect(search.size ? `${base}?${search}` : base);
}

/* ----------------------------------------------------- program registrations */

const REGISTRATION_STATUSES = ["pending", "paid", "cancelled"] as const;

export async function setRegistrationStatus(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/registrations");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, status: z.enum(REGISTRATION_STATUSES) })
    .safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) back(path, { error: "That status isn’t valid." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("program_registrations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: `Registration marked ${parsed.data.status}.` });
}

export async function deleteRegistration(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/registrations");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = Id.safeParse(formData.get("id"));
  if (!parsed.success) back(path, { error: "Unknown registration." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("program_registrations")
    .delete()
    .eq("id", parsed.data);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: "Registration deleted." });
}

/* ------------------------------------------------ certification registrations */

export async function setCertificationStatus(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/certifications");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, status: z.enum(REGISTRATION_STATUSES) })
    .safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) back(path, { error: "That status isn’t valid." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("certification_registrations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: `Registration marked ${parsed.data.status}.` });
}

export async function deleteCertificationRegistration(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/certifications");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = Id.safeParse(formData.get("id"));
  if (!parsed.success) back(path, { error: "Unknown registration." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("certification_registrations")
    .delete()
    .eq("id", parsed.data);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: "Registration deleted." });
}

/* ------------------------------------------------------------------ members */

export async function setMemberTier(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/members");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, membership_tier: z.enum(TIER_IDS) })
    .safeParse({
      id: formData.get("id"),
      membership_tier: formData.get("membership_tier"),
    });
  if (!parsed.success) back(path, { error: "That plan isn’t valid." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ membership_tier: parsed.data.membership_tier })
    .eq("id", parsed.data.id);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
  back(path, { notice: `Plan changed to ${parsed.data.membership_tier}.` });
}

export async function setMemberRole(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/members");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, role: z.enum(ROLES as [string, ...string[]]) })
    .safeParse({ id: formData.get("id"), role: formData.get("role") });
  if (!parsed.success) back(path, { error: "That role isn’t valid." });

  // Guard against locking everyone out of the dashboard by demoting yourself.
  // The RPC below enforces this too; checking here just gives a better message.
  if (parsed.data.id === user.id && parsed.data.role !== "admin") {
    back(path, {
      error: "You can’t remove your own admin access — ask another admin.",
    });
  }

  const supabase = await createClient();

  // Not a direct UPDATE: `authenticated` deliberately has no write grant on
  // profiles.role, so that a member cannot PATCH themselves to admin over the
  // REST API (see section 13 of schema.sql). This RPC runs as its definer and
  // re-checks is_admin() itself.
  const { error } = await supabase.rpc("admin_set_member_role", {
    target: parsed.data.id,
    new_role: parsed.data.role,
  });

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, {
    notice:
      parsed.data.role === "admin"
        ? "Member promoted to admin."
        : "Admin access removed.",
  });
}

export async function deleteMember(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/members");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = Id.safeParse(formData.get("id"));
  if (!parsed.success) back(path, { error: "Unknown member." });

  if (parsed.data === user.id) {
    back(path, { error: "You can’t delete your own account from here." });
  }

  // Deleting the profile row alone would leave an orphaned login. The auth
  // record is only reachable with the service role; the FK cascade then
  // removes the profile.
  if (!isSupabaseAdminConfigured) {
    back(path, {
      error:
        "Deleting members needs SUPABASE_SERVICE_ROLE_KEY set on the server.",
    });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(parsed.data);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: "Member deleted." });
}

/* -------------------------------------------------------------- nominations */

const NOMINATION_STATUSES = ["new", "reviewed", "shortlisted", "archived"] as const;

export async function setNominationStatus(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/nominations");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, review_status: z.enum(NOMINATION_STATUSES) })
    .safeParse({
      id: formData.get("id"),
      review_status: formData.get("review_status"),
    });
  if (!parsed.success) back(path, { error: "That status isn’t valid." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("nominations")
    .update({ review_status: parsed.data.review_status })
    .eq("id", parsed.data.id);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: `Nomination marked ${parsed.data.review_status}.` });
}

export async function deleteNomination(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/nominations");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = Id.safeParse(formData.get("id"));
  if (!parsed.success) back(path, { error: "Unknown nomination." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("nominations")
    .delete()
    .eq("id", parsed.data);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: "Nomination deleted." });
}

/* ----------------------------------------------------- advisory applications */

const ADVISORY_STATUSES = ["new", "reviewed", "approved", "archived"] as const;

export async function setAdvisoryStatus(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/advisory");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = z
    .object({ id: Id, review_status: z.enum(ADVISORY_STATUSES) })
    .safeParse({
      id: formData.get("id"),
      review_status: formData.get("review_status"),
    });
  if (!parsed.success) back(path, { error: "That status isn’t valid." });

  const supabase = await createClient();
  const { error } = await supabase
    .from("advisory_applications")
    .update({ review_status: parsed.data.review_status })
    .eq("id", parsed.data.id);

  if (error) back(path, { error: error.message });

  revalidatePath("/admin", "layout");
  back(path, { notice: `Application marked ${parsed.data.review_status}.` });
}

export async function deleteAdvisoryApplication(formData: FormData) {
  const path = safePath(formData.get("redirect_to"), "/admin/advisory");
  const { user } = await getAdmin();
  if (!user) back(path, { error: "You’re not authorised to do that." });

  const parsed = Id.safeParse(formData.get("id"));
  if (!parsed.success) back(path, { error: "Unknown application." });

  const supabase = await createClient();

  // Read the file paths before the row goes, or the bucket keeps orphans.
  const { data: row } = await supabase
    .from("advisory_applications")
    .select("bio_path, headshot_path")
    .eq("id", parsed.data)
    .maybeSingle<{ bio_path: string; headshot_path: string }>();

  const { error } = await supabase
    .from("advisory_applications")
    .delete()
    .eq("id", parsed.data);

  if (error) back(path, { error: error.message });

  if (row) {
    await supabase.storage
      .from("advisory-applications")
      .remove([row.bio_path, row.headshot_path]);
  }

  revalidatePath("/admin", "layout");
  back(path, { notice: "Application and its files deleted." });
}
