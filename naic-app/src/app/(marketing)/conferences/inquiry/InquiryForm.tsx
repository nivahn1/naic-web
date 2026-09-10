"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry, type InquiryResult } from "./actions";
import { CONFERENCES } from "../conferences";

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
      {pending ? "Sending…" : "Send inquiry"}
    </button>
  );
}

export function InquiryForm() {
  const [state, formAction] = useActionState<InquiryResult, FormData>(
    submitInquiry,
    {},
  );

  if (state.ok) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-8 text-center">
        <p className="font-display text-lg font-semibold text-emerald-200">
          Request received.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Thanks for reaching out. We&rsquo;ll follow up at the email you
          gave us with nonprofit/government registration options.
        </p>
      </div>
    );
  }

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
          Conferences
        </legend>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Select the conference(s) you&rsquo;re asking about.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {CONFERENCES.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-3 text-sm text-slate-200 transition-colors hover:border-violet-400/50"
            >
              <input
                type="checkbox"
                name="conference_slugs"
                value={c.slug}
                className="h-4 w-4 shrink-0 accent-violet-600"
              />
              {c.name}
            </label>
          ))}
        </div>
        {fieldErrors.conference_slugs?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">
            {fieldErrors.conference_slugs[0]}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Organization
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            name="organization_name"
            label="Organization name"
            required
            autoComplete="organization"
            errors={fieldErrors.organization_name}
          />
          <div>
            <label
              htmlFor="organization_type"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Organization type
            </label>
            <select
              id="organization_type"
              name="organization_type"
              required
              defaultValue=""
              className={INPUT}
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="nonprofit">Nonprofit</option>
              <option value="government">Government</option>
            </select>
            {fieldErrors.organization_type?.[0] ? (
              <p className="mt-1.5 text-xs text-rose-500">
                {fieldErrors.organization_type[0]}
              </p>
            ) : null}
          </div>
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

      <div className="mt-10">
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Anything else we should know?
          <span className="ml-1.5 text-xs font-normal text-[var(--muted)]">
            optional
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={4000}
          placeholder="Tell us about your organization and who's attending."
          className={INPUT}
        />
        {fieldErrors.message?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">{fieldErrors.message[0]}</p>
        ) : null}
      </div>

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
