"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitConsultRequest, type ConsultResult } from "./actions";

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
      {pending ? "Sending…" : "Request a consultation"}
    </button>
  );
}

const FORMATS = [
  "Organizational program",
  "Team-focused modules",
  "Individual pathway",
  "Not sure yet",
];

export function ConsultForm() {
  const [state, formAction] = useActionState<ConsultResult, FormData>(
    submitConsultRequest,
    {},
  );

  if (state.ok) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-8 text-center">
        <p className="font-display text-lg font-semibold text-emerald-200">
          Request received.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Thanks for reaching out about Customized AI Training. We&rsquo;ll
          review what you shared and follow up at the email you gave us to
          schedule a consultation.
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
          <Field
            name="company"
            label="Company or organization"
            required
            autoComplete="organization"
            errors={fieldErrors.company}
          />
        </div>
      </fieldset>

      <div className="mt-10">
        <label
          htmlFor="format"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Preferred format
          <span className="ml-1.5 text-xs font-normal text-[var(--muted)]">
            optional
          </span>
        </label>
        <select id="format" name="format" defaultValue="" className={INPUT}>
          <option value="" disabled>
            Choose one
          </option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10">
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          What are you looking to achieve with customized training?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={20}
          maxLength={4000}
          placeholder="Tell us about your team, timeline, industry, and what success looks like."
          className={INPUT}
        />
        {fieldErrors.message?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">
            {fieldErrors.message[0]}
          </p>
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
