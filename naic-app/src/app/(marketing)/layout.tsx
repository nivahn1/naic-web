import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter } from "../_components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let authed = false;
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = !!user;
  }

  return (
    <>
      <SiteHeader authed={authed} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
