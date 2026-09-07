"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { PROGRAMS } from "../programs";

export type RegistrationResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const PROGRAM_SLUGS = PROGRAMS.map((p) => p.slug) as [string, ...string[]];
const REGISTRATION_PRICE_CENTS = 99900;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "That value is too long." })
    .optional()
    .transform((v) => (v ? v : null));

const RegistrationSchema = z.object({
  program_slug: z.enum(PROGRAM_SLUGS, { error: "Choose a program." }),
  full_name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(120, { error: "That name is too long." }),
  email: z.email({ error: "Enter a valid email." }).max(254),
  phone: optionalText(40),
  billing_street: z
    .string()
    .trim()
    .min(2, { error: "Enter your billing street address." })
    .max(200, { error: "That address is too long." }),
  billing_city: z
    .string()
    .trim()
    .min(1, { error: "Enter your city." })
    .max(120, { error: "That city is too long." }),
  billing_state: z
    .string()
    .trim()
    .min(1, { error: "Enter your state or province." })
    .max(80, { error: "That's too long." }),
  billing_zip: z
    .string()
    .trim()
    .min(1, { error: "Enter your ZIP or postal code." })
    .max(20, { error: "That's too long." }),
});

async function siteOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "nationalaiconsortium.org";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : (h.get("x-forwarded-proto") ?? "https");
  return `${proto}://${host}`;
}

export async function submitRegistration(
  _prev: RegistrationResult,
  formData: FormData,
): Promise<RegistrationResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Registration isn’t wired up yet. Email web@nationalaiconsortium.org instead.",
    };
  }

  // Honeypot: a field only a bot would fill in.
  if (formData.get("website")) return {};

  const parsed = RegistrationSchema.safeParse({
    program_slug: formData.get("program_slug"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billing_street: formData.get("billing_street"),
    billing_city: formData.get("billing_city"),
    billing_state: formData.get("billing_state"),
    billing_zip: formData.get("billing_zip"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const program = PROGRAMS.find((p) => p.slug === parsed.data.program_slug);
  if (!program) {
    return { fieldErrors: { program_slug: ["Choose a program."] } };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: registration, error } = await supabase
    .from("program_registrations")
    .insert({
      program_slug: program.slug,
      program_name: program.name,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      billing_street: parsed.data.billing_street,
      billing_city: parsed.data.billing_city,
      billing_state: parsed.data.billing_state,
      billing_zip: parsed.data.billing_zip,
      amount_cents: REGISTRATION_PRICE_CENTS,
      submitted_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !registration) {
    return { error: "That didn’t go through. Please try again in a moment." };
  }

  if (!isStripeConfigured || !stripe) {
    // No payment processor connected yet — the registration is recorded as
    // pending and we stop here rather than pretending to take payment.
    redirect(`/programs/register/success?registration_id=${registration.id}`);
  }

  const origin = await siteOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: parsed.data.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: REGISTRATION_PRICE_CENTS,
          product_data: {
            name: `${program.name} — Registration`,
            description: "National AI Consortium program registration",
          },
        },
        quantity: 1,
      },
    ],
    billing_address_collection: "auto",
    success_url: `${origin}/programs/register/success?registration_id=${registration.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/programs/register?program=${program.slug}&cancelled=1`,
    metadata: {
      registration_id: registration.id,
      program_slug: program.slug,
    },
  });

  redirect(session.url!);
}
