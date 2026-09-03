import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ResetPasswordForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Set a new password",
};

export default async function ResetPasswordPage() {
  // Reaching this page means the recovery link in the email was followed and
  // /auth/confirm exchanged it for a session. No session → the link is stale.
  const { user } = isSupabaseConfigured
    ? await getCurrentProfile()
    : { user: null };

  if (!user) {
    return (
      <div className="gradient-border rounded-3xl bg-white/[0.04] p-8 text-center backdrop-blur-xl">
        <h1 className="font-display text-xl font-semibold tracking-tight">
          This reset link has expired
        </h1>
        <p className="mt-2 text-sm text-slate-300/80">
          Reset links are single-use and time-limited. Request a fresh one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm />;
}
