import Link from "next/link";
import { getCurrentProfile } from "@/lib/profile";
import { getTier } from "@/lib/tiers";

const RESOURCES = [
  {
    title: "2026 AI Webinar Series",
    body: "Six live sessions — AI Trends & Forecast, Responsible AI, Women Leading the Future of AI, and more.",
    href: "/#calendar",
    cta: "View schedule",
  },
  {
    title: "Corporate Member Toolkit",
    body: "Governance frameworks and standards: NIST AI RMF, OECD Principles, UNESCO AI Ethics, the EU AI Act.",
    href: "/#programs",
    cta: "Open toolkit",
  },
  {
    title: "Member Forum",
    body: "Networking groups and virtual meetups with practitioners, researchers, and leaders across every industry.",
    href: "/#events",
    cta: "Go to forum",
  },
  {
    title: "Recognition & Awards",
    body: "AI Excellence Awards, Top 50 Chief AI Officers, Top 100 Leaders in AI. Submissions close November 7, 2026.",
    href: "/#recognition",
    cta: "See categories",
  },
];

export default async function PortalDashboard() {
  const { user, profile } = await getCurrentProfile();
  const tier = getTier(profile?.membership_tier);
  const firstName = (profile?.full_name || "").trim().split(/\s+/)[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl dark:text-white">
        {firstName ? `Welcome, ${firstName}.` : "Welcome."}
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        You’re signed in as {user?.email}. Here’s what’s included with your
        membership.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
            Current plan
          </p>
          <p className="font-display mt-2 text-3xl font-semibold tracking-tight text-white dark:text-white">
            {tier.name}
            <span className="ml-2 text-base font-normal text-[var(--muted)]">
              {tier.price}/yr
            </span>
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{tier.tag}</p>
          <ul className="mt-4 space-y-1.5">
            {tier.features.map((f) => (
              <li key={f} className="text-sm text-[var(--muted)]">
                • {f}
              </li>
            ))}
          </ul>
          <Link
            href="/portal/membership"
            className="mt-5 inline-flex rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Manage membership
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
            Account
          </p>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-[var(--muted)]">Name</dt>
              <dd className="text-white dark:text-white">
                {profile?.full_name || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Email</dt>
              <dd className="text-white dark:text-white">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Member since</dt>
              <dd className="text-white dark:text-white">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
          <Link
            href="/portal/profile"
            className="mt-5 inline-flex rounded-xl border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-violet-400/50 dark:text-white"
          >
            Edit profile
          </Link>
        </div>
      </div>

      <h2 className="font-display mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-violet-300">
        Member resources
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {RESOURCES.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="group rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-violet-400/50"
          >
            <h3 className="font-display font-semibold text-white dark:text-white">
              {r.title}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{r.body}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-violet-300">
              {r.cta}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
