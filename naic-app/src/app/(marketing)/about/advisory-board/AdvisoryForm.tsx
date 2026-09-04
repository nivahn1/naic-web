"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitAdvisoryApplication, type AdvisoryResult } from "./actions";

const INPUT =
  "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-violet-400/70 dark:text-white";

const FILE_INPUT =
  "block w-full text-sm text-[var(--muted)] file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-gradient-to-br file:from-[#00004d] file:to-violet-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:opacity-90";

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

function FileField({
  name,
  label,
  accept,
  hint,
  errors,
}: {
  name: string;
  label: string;
  accept: string;
  hint: string;
  errors?: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        required
        className={FILE_INPUT}
      />
      <p className="mt-1.5 text-xs text-[var(--muted)]">{hint}</p>
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
      {pending ? "Submitting…" : "Submit application"}
    </button>
  );
}

export function AdvisoryForm() {
  const [state, formAction] = useActionState<AdvisoryResult, FormData>(
    submitAdvisoryApplication,
    {},
  );

  if (state.ok) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-8 text-center">
        <p className="font-display text-lg font-semibold text-emerald-200 dark:text-emerald-200">
          Application received.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Thank you for your interest in the Advisory Board. We review every
          application and will be in touch at the email you gave us.
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
          About you
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
            name="title"
            label="Title"
            autoComplete="organization-title"
            errors={fieldErrors.title}
          />
          <Field
            name="company"
            label="Company or organization"
            autoComplete="organization"
            errors={fieldErrors.company}
          />
          <Field
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            errors={fieldErrors.phone}
          />
          <Field
            name="expertise"
            label="Areas of expertise"
            errors={fieldErrors.expertise}
          />
        </div>
      </fieldset>

      <div className="mt-10">
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200"
        >
          Why do you want to join the Advisory Board?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={40}
          maxLength={4000}
          placeholder="Tell us about your background and the perspective you'd bring."
          className={INPUT}
        />
        {fieldErrors.message?.[0] ? (
          <p className="mt-1.5 text-xs text-rose-500">
            {fieldErrors.message[0]}
          </p>
        ) : null}
      </div>

      <fieldset className="mt-10">
        <legend className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
          Documents
        </legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <FileField
            name="bio"
            label="Your bio"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hint="PDF or Word document, up to 10 MB."
            errors={fieldErrors.bio}
          />
          <FileField
            name="headshot"
            label="Professional headshot"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            hint="JPEG or PNG, up to 5 MB."
            errors={fieldErrors.headshot}
          />
        </div>
      </fieldset>

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
