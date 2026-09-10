"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitRegistration, type RegistrationResult } from "./actions";
import { CELEBRATIONS } from "../celebrations";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/countries";

const REGISTRATION_PRICE = 2499;

const INPUT =
  "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-violet-400/70";

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  errors,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  errors?: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-200"
      >
        {label}
        {required ? null : (
          <span className="ml-1.5 text-xs font-normal text-[var(--muted)]">
            optional
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={INPUT}
      />
      {errors?.[0] ? (
        <p className="mt-1.5 text-xs text-rose-500">{errors[0]}</p>
      ) : null}
    </div>
  );
}

function SubmitButton({ total }: { total: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || total === 0}
      className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending
        ? "Redirecting to payment…"
        : `Continue to payment — $${total.toLocaleString()}`}
    </button>
  );
}

export function RegistrationForm({
  defaultCelebrationSlug,
}: {
  defaultCelebrationSlug: string;
}) {
  const [state, formAction] = useActionState<RegistrationResult, FormData>(
    submitRegistration,
    {},
  );
  const [selected, setSelected] = useState<string[]>([defaultCelebrationSlug]);

  const fieldErrors = state.fieldErrors ?? {};
  const total = selected.length * REGISTRATION_PRICE;

  const toggle = (slug: string) => {
    setSelected((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
    );
  };

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8"
    >
      {state.error ? (
        <div className="mb-6 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      ) : null}

      <fieldset>
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Celebrations
        </legend>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Select one or more — $2,499 each. You&rsquo;ll pay for all of them
          in a single checkout.
        </p>
        <div className="mt-4 grid gap-2.5">
          {CELEBRATIONS.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-3 text-sm text-slate-200 transition-colors hover:border-violet-400/50"
            >
              <input
                type="checkbox"
                name="celebration_slugs"
                value={c.slug}
                checked={selected.includes(c.slug)}
                onChange={() => toggle(c.slug)}
                className="h-4 w-4 shrink-0 accent-violet-600"
              />
              <span className="flex-1">
                {c.name}
                <span className="ml-1.5 text-xs text-[var(--muted)]">
                  ({c.when})
                </span>
              </span>
            </label>
          ))}
        </div>
        {fieldErrors.celebration_slugs?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">
            {fieldErrors.celebration_slugs[0]}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-[var(--muted)]">
          Total:{" "}
          <span className="font-semibold text-white">
            ${total.toLocaleString()}
          </span>{" "}
          for {selected.length} celebration{selected.length === 1 ? "" : "s"}
        </p>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Your details
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            name="full_name"
            label="Full name"
            required
            autoComplete="name"
            errors={fieldErrors.full_name}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            errors={fieldErrors.email}
          />
          <Field
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            errors={fieldErrors.phone}
          />
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Billing address
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              name="billing_street"
              label="Street address"
              required
              autoComplete="address-line1"
              errors={fieldErrors.billing_street}
            />
          </div>
          <Field
            name="billing_city"
            label="City"
            required
            autoComplete="address-level2"
            errors={fieldErrors.billing_city}
          />
          <Field
            name="billing_state"
            label="State / Province"
            required
            autoComplete="address-level1"
            errors={fieldErrors.billing_state}
          />
          <Field
            name="billing_zip"
            label="ZIP / Postal code"
            required
            autoComplete="postal-code"
            errors={fieldErrors.billing_zip}
          />
          <div>
            <label
              htmlFor="billing_country"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Country
            </label>
            <select
              id="billing_country"
              name="billing_country"
              required
              autoComplete="country"
              defaultValue={DEFAULT_COUNTRY}
              className={INPUT}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldErrors.billing_country?.[0] ? (
              <p className="mt-1.5 text-xs text-rose-500">
                {fieldErrors.billing_country[0]}
              </p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <p className="mt-10 text-sm leading-6 text-[var(--muted)]">
        Next, you&rsquo;ll enter your card details on Stripe&rsquo;s secure
        checkout page — we never see or store your card number.
      </p>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} />
      </div>

      <div className="mt-8">
        <SubmitButton total={total} />
      </div>
    </form>
  );
}
