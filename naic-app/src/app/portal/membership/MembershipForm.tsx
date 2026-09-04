"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateMembership, type FormResult } from "../actions";
import { TIERS, type TierId } from "@/lib/tiers";

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {pending ? "Updating…" : "Update plan"}
    </button>
  );
}

export function MembershipForm({ currentTier }: { currentTier: TierId }) {
  const [state, formAction] = useActionState<FormResult, FormData>(
    updateMembership,
    {},
  );
  const [selected, setSelected] = useState<TierId>(currentTier);

  return (
    <form action={formAction} className="mt-6">
      {state.ok && (
        <div className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 dark:text-emerald-200">
          Your plan has been updated.
        </div>
      )}
      {state.error && (
        <div className="mb-4 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 dark:text-rose-200">
          {state.error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const active = selected === tier.id;
          return (
            <label
              key={tier.id}
              className={`flex cursor-pointer flex-col rounded-2xl border p-5 transition-all ${
                active
                  ? "border-violet-500 bg-violet-500/[0.06] ring-1 ring-violet-500"
                  : "border-[var(--surface-border)] bg-[var(--surface)] hover:border-violet-400/50"
              }`}
            >
              <input
                type="radio"
                name="membership_tier"
                value={tier.id}
                checked={active}
                onChange={() => setSelected(tier.id)}
                className="sr-only"
              />
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-semibold text-white dark:text-white">
                  {tier.name}
                </span>
                {tier.id === currentTier && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] dark:bg-white/10">
                    Current
                  </span>
                )}
              </div>
              <span className="font-display mt-2 text-2xl font-semibold tracking-tight text-white dark:text-white">
                {tier.price}
                <span className="text-sm font-normal text-[var(--muted)]"> / yr</span>
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                {tier.tag}
              </span>
              <ul className="mt-3 space-y-1 border-t border-[var(--surface-border)] pt-3">
                {tier.features.map((f) => (
                  <li key={f} className="text-xs text-[var(--muted)]">
                    • {f}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <SaveButton disabled={selected === currentTier} />
        <p className="text-xs text-[var(--muted)]">
          No payment is taken here — this records your plan selection.
        </p>
      </div>
    </form>
  );
}
