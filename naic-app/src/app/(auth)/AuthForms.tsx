"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  login,
  requestPasswordReset,
  signup,
  updatePassword,
  type AuthState,
} from "../auth/actions";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition-colors focus:border-violet-400/70 focus:bg-white/[0.09]";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-xs text-rose-300">{errors[0]}</p>;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 w-full rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/25 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function Alert({ state }: { state: AuthState }) {
  if (state.message) {
    return (
      <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
        {state.message}
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
        {state.error}
      </div>
    );
  }
  return null;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-border rounded-3xl bg-white/[0.04] p-7 backdrop-blur-xl sm:p-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-sm text-slate-300/80">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo: string;
  initialError?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(login, {
    error: initialError,
  });

  return (
    <Card title="Welcome back" subtitle="Sign in to your member portal.">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirectTo} />
        <Alert state={state} />

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-violet-300 hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            placeholder="••••••••"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <SubmitButton label="Sign in" pendingLabel="Signing in…" />
      </form>

      <p className="mt-6 text-center text-sm text-slate-300/80">
        New to the Consortium?{" "}
        <Link href="/signup" className="font-semibold text-violet-300 hover:text-white">
          Create an account
        </Link>
      </p>
    </Card>
  );
}

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(signup, {});

  return (
    <Card
      title="Join the Consortium"
      subtitle="Create your account — it takes less than a minute."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirectTo} />
        <Alert state={state} />

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-200">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Ada Lovelace"
          />
          <FieldError errors={state.fieldErrors?.name} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
            placeholder="At least 8 characters"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <SubmitButton label="Create account" pendingLabel="Creating account…" />
      </form>

      <p className="mt-6 text-center text-sm text-slate-300/80">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-violet-300 hover:text-white">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {},
  );

  return (
    <Card
      title="Reset your password"
      subtitle="We’ll email you a link to set a new one."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <Alert state={state} />

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <SubmitButton label="Send reset link" pendingLabel="Sending…" />
      </form>

      <p className="mt-6 text-center text-sm text-slate-300/80">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-violet-300 hover:text-white">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    updatePassword,
    {},
  );

  return (
    <Card
      title="Choose a new password"
      subtitle="Enter it twice to confirm, then you’re back in."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <Alert state={state} />

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
            placeholder="At least 8 characters"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-slate-200">
            Confirm new password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
            placeholder="Re-enter your password"
          />
          <FieldError errors={state.fieldErrors?.confirm} />
        </div>

        <SubmitButton label="Update password" pendingLabel="Updating…" />
      </form>
    </Card>
  );
}
