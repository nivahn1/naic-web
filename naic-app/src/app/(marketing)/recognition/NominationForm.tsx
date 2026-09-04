"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitNomination, type NominationResult } from "./actions";
import { NOMINATION_AWARDS } from "./recognition";

const INPUT =
  "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-violet-400/70 dark:text-white";

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
        className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200"
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
      {pending ? "Sending…" : "Submit nomination"}
    </button>
  );
}

export function NominationForm() {
  const [state, formAction] = useActionState<NominationResult, FormData>(
    submitNomination,
    {},
  );

  if (state.ok) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-8 text-center">
        <p className="font-display text-lg font-semibold text-emerald-200 dark:text-emerald-200">
          Nomination received.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Thank you — the selection committee reviews every submission after the
          deadline closes. We will be in touch at the email you gave us.
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
        <div className="mb-6 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 dark:text-rose-200">
          {state.error}
        </div>
      ) : null}

      <fieldset>
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          The nominee
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            name="nominee_name"
            label="Full name"
            required
            errors={fieldErrors.nominee_name}
          />
          <Field
            name="nominee_title"
            label="Title"
            errors={fieldErrors.nominee_title}
          />
          <Field
            name="nominee_company"
            label="Company or organization"
            errors={fieldErrors.nominee_company}
          />
          <Field
            name="nominee_email"
            label="Email"
            type="email"
            required
            errors={fieldErrors.nominee_email}
          />
          <Field
            name="nominee_phone"
            label="Phone"
            type="tel"
            errors={fieldErrors.nominee_phone}
          />
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          About you
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            name="nominator_name"
            label="Full name"
            required
            autoComplete="name"
            errors={fieldErrors.nominator_name}
          />
          <Field
            name="nominator_title"
            label="Title"
            autoComplete="organization-title"
            errors={fieldErrors.nominator_title}
          />
          <Field
            name="nominator_company"
            label="Company or organization"
            autoComplete="organization"
            errors={fieldErrors.nominator_company}
          />
          <Field
            name="nominator_email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            errors={fieldErrors.nominator_email}
          />
          <Field
            name="nominator_phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            errors={fieldErrors.nominator_phone}
          />
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Award
        </legend>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Choose every award this nomination should be considered for.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {NOMINATION_AWARDS.map((award) => (
            <label
              key={award}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-3 text-sm text-slate-200 transition-colors hover:border-violet-400/50 dark:text-slate-200"
            >
              <input
                type="checkbox"
                name="awards"
                value={award}
                className="h-4 w-4 shrink-0 accent-violet-600"
              />
              {award}
            </label>
          ))}
        </div>
        {fieldErrors.awards?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">{fieldErrors.awards[0]}</p>
        ) : null}
      </fieldset>

      <div className="mt-10">
        <label
          htmlFor="rationale"
          className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200"
        >
          Why are you nominating them?
        </label>
        <textarea
          id="rationale"
          name="rationale"
          rows={6}
          required
          minLength={40}
          maxLength={4000}
          placeholder="Describe their contribution, its impact, and anything the committee should read or verify."
          className={INPUT}
        />
        {fieldErrors.rationale?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">
            {fieldErrors.rationale[0]}
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
