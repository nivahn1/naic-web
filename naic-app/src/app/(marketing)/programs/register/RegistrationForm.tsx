"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitRegistration, type RegistrationResult } from "./actions";
import { PROGRAMS } from "../programs";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? "Redirecting to payment…" : "Continue to payment — $999"}
    </button>
  );
}

export function RegistrationForm({
  defaultProgramSlug,
}: {
  defaultProgramSlug: string;
}) {
  const [state, formAction] = useActionState<RegistrationResult, FormData>(
    submitRegistration,
    {},
  );

  const fieldErrors = state.fieldErrors ?? {};

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
          Program
        </legend>
        <div className="mt-5">
          <label
            htmlFor="program_slug"
            className="mb-1.5 block text-sm font-medium text-slate-200"
          >
            Which program are you registering for?
          </label>
          <select
            id="program_slug"
            name="program_slug"
            required
            defaultValue={defaultProgramSlug}
            className={INPUT}
          >
            {PROGRAMS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          {fieldErrors.program_slug?.[0] ? (
            <p className="mt-1.5 text-xs text-rose-500">
              {fieldErrors.program_slug[0]}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-[var(--muted)]">
            Registration is{" "}
            <span className="font-semibold text-white">$999</span> per
            program.
          </p>
        </div>
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
        <SubmitButton />
      </div>
    </form>
  );
}
