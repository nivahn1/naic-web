import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

const PROTECTED_PREFIX = "/portal";
const ADMIN_PREFIX = "/admin";
const AUTH_ROUTES = ["/login", "/signup"];

function safeInternalPath(value: string | null, fallback: string) {
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : fallback;
}

/**
 * Refreshes the Supabase auth session on every request and enforces the
 * route guard: unauthenticated users are bounced from /portal and /admin,
 * members without the admin role are bounced from /admin, and authenticated
 * users are bounced away from /login and /signup.
 *
 * Called from the root `proxy.ts` (Next.js 16's renamed middleware).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Auth not wired up yet — let every request through untouched.
  if (!isSupabaseConfigured) return supabaseResponse;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith(PROTECTED_PREFIX) || pathname.startsWith(ADMIN_PREFIX);

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // /admin additionally needs the admin role. RLS lets a member read only
  // their own profile row, so this is a one-row lookup on their own record.
  if (user && pathname.startsWith(ADMIN_PREFIX)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      url.search = "?error=admin-only";
      return NextResponse.redirect(url);
    }
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    // Honour ?redirect= so an admin signing in from the admin link lands on
    // the dashboard rather than the member portal.
    const target = safeInternalPath(
      request.nextUrl.searchParams.get("redirect"),
      "/portal",
    );
    url.pathname = target.split("?")[0];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
