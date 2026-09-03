"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NOT_CONFIGURED: AuthState = {
  error:
    "Authentication isn’t configured yet. Add your Supabase env vars to enable sign-in.",
};

export type AuthState = {
  error?: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "confirm", string[]>
  >;
  message?: string;
};

const SignupSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
});

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
});

const ResetRequestSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
});

const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." }),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    error: "Passwords don’t match.",
    path: ["confirm"],
  });

function safeRedirect(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  // Only allow internal absolute paths to avoid open redirects.
  return path.startsWith("/") && !path.startsWith("//") ? path : "/portal";
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation disabled → session is live immediately.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeRedirect(formData.get("redirect")));
  }

  // Email confirmation enabled → the user must click the link in their inbox,
  // which lands on /auth/confirm and establishes the session there.
  return {
    message:
      "Almost there — check your inbox for a confirmation link to finish creating your account.",
  };
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Please confirm your email first — check your inbox for the link we sent.",
      };
    }
    return { error: "Incorrect email or password." };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirect(formData.get("redirect")));
}

export async function signOut() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = ResetRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  // The link lands on /auth/confirm, which establishes a short-lived recovery
  // session and forwards to /reset-password.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  // Always the same response, so we don't reveal whether an account exists.
  return {
    message:
      "If an account exists for that email, a password-reset link is on its way.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const parsed = NewPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        "This reset link has expired. Request a new one from the sign-in page.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "That’s already your password — choose a new one."
          : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/portal");
}
