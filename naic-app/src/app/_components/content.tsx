import Link from "next/link";
import { Constellation } from "./Constellation";

/** Dark constellation hero band for interior pages. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  center,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Center the column and add a rule under the title. */
  center?: boolean;
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-[#07060f] text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-[radial-gradient(120%_120%_at_50%_-20%,#3d1d7a_0%,#1a0f3e_45%,#07060f_80%)]"
      />
      <div
        aria-hidden
        className="absolute -left-40 -top-10 -z-20 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-[130px]"
      />
      <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-50" />
      <div
        className={`mx-auto max-w-4xl px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-44 ${
          center ? "text-center" : ""
        }`}
      >
        <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          {eyebrow}
        </span>
        <h1 className="font-display mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {center ? (
          <span
            aria-hidden
            className="mx-auto mt-6 block h-1 w-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
          />
        ) : null}
        {lead ? (
          <p
            className={`mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300/85 ${
              center ? "mx-auto" : ""
            }`}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** A vertically padded content band with a centered max-width column. */
export function Section({
  tint,
  wide,
  children,
}: {
  tint?: boolean;
  /** Roomier column, for grids that need more than the reading measure. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`border-t border-[var(--surface-border)] ${
        tint ? "bg-[var(--surface)]" : "bg-[var(--background)]"
      }`}
    >
      <div
        className={`mx-auto px-5 py-16 sm:px-8 sm:py-20 ${
          wide ? "max-w-6xl" : "max-w-4xl"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
      {children}
    </h2>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-pretty leading-7 text-[var(--muted)]">{children}</p>
  );
}

export function Card({
  title,
  eyebrow,
  children,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-7">
      {eyebrow ? (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h3 className="font-display mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      ) : null}
      <div className="mt-2.5 text-sm leading-6 text-[var(--muted)]">
        {children}
      </div>
    </article>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-sm leading-6 text-[var(--muted)]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaRow({
  text,
  actions,
}: {
  text: string;
  actions: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_0%_0%,#7c3aed_0%,#5b21b6_45%,#2e1065_100%)] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-xl text-sm leading-6 text-violet-100/85">{text}</p>
      <div className="flex shrink-0 flex-wrap gap-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={
              a.primary
                ? "rounded-xl bg-white px-5 py-2.5 text-center text-sm font-semibold text-violet-800 transition-transform hover:-translate-y-0.5"
                : "rounded-xl border border-white/40 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
            }
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Small inline links to sibling pages, shown at the foot of a page. */
export function RelatedLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-full border border-[var(--surface-border)] px-4 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-violet-400/50 hover:text-slate-900 dark:hover:text-white"
        >
          {l.label} →
        </Link>
      ))}
    </div>
  );
}
