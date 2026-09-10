"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { CONFERENCES, type Conference } from "../conferences";
import { COUNTRIES } from "@/lib/countries";

export type RegistrationResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const COUNTRY_CODES = COUNTRIES.map((c) => c.code) as [string, ...string[]];
const STANDARD_PRICE_CENTS = 119900;
const VIP_PRICE_CENTS = 139900;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "That value is too long." })
    .optional()
    .transform((v) => (v ? v : null));

const DetailsSchema = z.object({
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
  billing_country: z.enum(COUNTRY_CODES, { error: "Choose a country." }),
});

function parseTier(value: FormDataEntryValue | null): "standard" | "vip" | null {
  return value === "standard" || value === "vip" ? value : null;
}

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

  const selections = CONFERENCES.map((conference) => ({
    conference,
    tier: parseTier(formData.get(`tier_${conference.slug}`)),
  })).filter(
    (s): s is { conference: Conference; tier: "standard" | "vip" } =>
      s.tier !== null,
  );

  const parsed = DetailsSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billing_street: formData.get("billing_street"),
    billing_city: formData.get("billing_city"),
    billing_state: formData.get("billing_state"),
    billing_zip: formData.get("billing_zip"),
    billing_country: formData.get("billing_country"),
  });

  if (selections.length === 0 || !parsed.success) {
    const fieldErrors = parsed.success
      ? {}
      : z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors:
        selections.length === 0
          ? { conferences: ["Choose at least one conference."], ...fieldErrors }
          : fieldErrors,
    };
  }

  const priceCents = selections.map((s) =>
    s.tier === "vip" ? VIP_PRICE_CENTS : STANDARD_PRICE_CENTS,
  );
  const totalCents = priceCents.reduce((sum, c) => sum + c, 0);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Generated up front rather than read back after insert: the table has
  // no SELECT policy for anon/authenticated (write-only by design), so
  // `.insert().select()` would fail to return the row even though the
  // insert itself succeeded.
  const registrationId = randomUUID();

  const { error } = await supabase.from("conference_registrations").insert({
    id: registrationId,
    conference_slugs: selections.map((s) => s.conference.slug),
    conference_names: selections.map((s) => s.conference.name),
    conference_tiers: selections.map((s) => s.tier),
    price_cents: priceCents,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    billing_street: parsed.data.billing_street,
    billing_city: parsed.data.billing_city,
    billing_state: parsed.data.billing_state,
    billing_zip: parsed.data.billing_zip,
    billing_country: parsed.data.billing_country,
    amount_cents: totalCents,
    submitted_by: user?.id ?? null,
  });

  if (error) {
    return { error: "That didn’t go through. Please try again in a moment." };
  }

  if (!isStripeConfigured || !stripe) {
    // No payment processor connected yet — the registration is recorded as
    // pending and we stop here rather than pretending to take payment.
    redirect(`/conferences/register/success?registration_id=${registrationId}`);
  }

  const origin = await siteOrigin();

  // Create the customer with the billing address from our form so Stripe's
  // AVS check runs against the same address we collected, instead of a
  // second, disconnected address entered on Stripe's own page.
  const customer = await stripe.customers.create({
    email: parsed.data.email,
    name: parsed.data.full_name,
    phone: parsed.data.phone ?? undefined,
    address: {
      line1: parsed.data.billing_street,
      city: parsed.data.billing_city,
      state: parsed.data.billing_state,
      postal_code: parsed.data.billing_zip,
      country: parsed.data.billing_country,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customer.id,
    line_items: selections.map((s, i) => ({
      price_data: {
        currency: "usd",
        unit_amount: priceCents[i],
        product_data: {
          name: `${s.conference.name} — ${s.tier === "vip" ? "VIP" : "Standard"} Registration`,
          description: "National AI Consortium conference registration",
        },
      },
      quantity: 1,
    })),
    billing_address_collection: "auto",
    success_url: `${origin}/conferences/register/success?registration_id=${registrationId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/conferences/register?conference=${selections[0].conference.slug}&cancelled=1`,
    metadata: {
      registration_id: registrationId,
      conference_slugs: selections.map((s) => s.conference.slug).join(","),
    },
  });

  redirect(session.url!);
}
