import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "../../../../_components/content";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Registration Confirmed",
  robots: { index: false },
};

type Registration = {
  id: string;
  certification_names: string[];
  full_name: string;
  email: string;
  status: string;
  amount_cents: number;
};

async function confirmPayment(registrationId: string, sessionId: string) {
  if (!isStripeConfigured || !stripe || !isSupabaseAdminConfigured) {
    return { ok: false as const };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // The session must actually belong to this registration — don't trust
  // the URL's registration_id on its own.
  if (session.metadata?.registration_id !== registrationId) {
    return { ok: false as const };
  }

  if (session.payment_status !== "paid") {
    return { ok: false as const };
  }

  const admin = createAdminClient();
  await admin
    .from("certification_registrations")
    .update({
      status: "paid",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    })
    .eq("id", registrationId);

  return { ok: true as const };
}

export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ registration_id?: string; session_id?: string }>;
}) {
  const { registration_id, session_id } = await searchParams;

  let paid = false;
  let confirmError = false;

  if (registration_id && session_id) {
    const result = await confirmPayment(registration_id, session_id);
    paid = result.ok;
    confirmError = !result.ok;
  }

  let registration: Registration | null = null;
  if (registration_id && isSupabaseAdminConfigured) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("certification_registrations")
      .select("id, certification_names, full_name, email, status, amount_cents")
      .eq("id", registration_id)
      .maybeSingle();
    registration = data;
  }

  return (
    <>
      <PageHeader
        center
        eyebrow="Certification"
        title={
          paid
            ? "Payment received"
            : confirmError
              ? "We couldn't confirm that payment"
              : "Registration received"
        }
      />

      <Section>
        <div className="mx-auto max-w-xl rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 text-center">
          {registration ? (
            <>
              <p className="font-display text-lg font-semibold text-white">
                {registration.certification_names.join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {paid ? (
                  <>
                    Thanks, {registration.full_name.split(" ")[0]} — your $
                    {(registration.amount_cents / 100).toLocaleString()}{" "}
                    payment went through and your seat
                    {registration.certification_names.length === 1 ? "" : "s"}{" "}
                    are confirmed. A receipt is on its way to{" "}
                    {registration.email}.
                  </>
                ) : confirmError ? (
                  <>
                    We received your registration but couldn&rsquo;t verify
                    the payment on our end. If you completed checkout,
                    contact us and we&rsquo;ll sort it out — no need to
                    register again.
                  </>
                ) : (
                  <>
                    Thanks, {registration.full_name.split(" ")[0]} — your
                    registration is recorded. Payment isn&rsquo;t connected
                    yet, so we&rsquo;ll follow up at {registration.email} to
                    collect the $
                    {(registration.amount_cents / 100).toLocaleString()}{" "}
                    securely.
                  </>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm leading-6 text-[var(--muted)]">
              We couldn&rsquo;t find that registration. If you just
              submitted the form, contact us and we&rsquo;ll confirm it
              manually.
            </p>
          )}

          <Link
            href="/certification"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Back to certifications
          </Link>
        </div>
      </Section>
    </>
  );
}
