"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type FormResult } from "../actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(
    updateProfile,
    {},
  );

  return (
    <form
      action={formAction}
      className="mt-6 max-w-md rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6"
    >
      {state.ok && (
        <div className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 dark:text-emerald-200">
          Profile updated.
        </div>
      )}
      {state.error && (
        <div className="mb-4 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 dark:text-rose-200">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="full_name"
          className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200"
        >
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={initialName}
          required
          minLength={2}
          className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--background)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-violet-400/70 dark:text-white"
        />
        {state.fieldErrors?.full_name && (
          <p className="mt-1.5 text-xs text-rose-500">
            {state.fieldErrors.full_name[0]}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-200 dark:text-slate-200">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-[var(--surface-border)] bg-white/10 px-4 py-2.5 text-sm text-[var(--muted)] dark:bg-white/5"
        />
        <p className="mt-1.5 text-xs text-[var(--muted)]">
          Contact the Consortium to change your email address.
        </p>
      </div>

      <div className="mt-6">
        <SaveButton />
      </div>
    </form>
  );
}
