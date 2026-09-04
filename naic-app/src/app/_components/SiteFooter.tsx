import Link from "next/link";
import { Logo } from "./Logo";

const EXPLORE: [string, string][] = [
  ["About", "/about"],
  ["Board of Directors", "/about/board-of-directors"],
  ["State Chapters", "/chapters"],
  ["Programs", "/programs"],
  ["Training", "/training"],
  ["Services", "/services"],
  ["Certification", "/#certification"],
];

const CONVENE: [string, string][] = [
  ["Conferences", "/conferences"],
  ["Events", "/events"],
  ["AI Weeks", "/weeks"],
  ["Celebrations", "/celebrations"],
  ["Recognition", "/recognition"],
  ["Membership", "/#membership"],
];

const GET_IN_TOUCH: [string, string][] = [
  ["Member Login", "/login"],
  ["Become a Member", "/signup"],
  ["Contact Us", "mailto:web@nationalaiconsortium.org"],
  ["nationalaiconsortium.org", "/"],
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--surface-border)] bg-[var(--background)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center">
              <Logo className="h-9" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Advancing the understanding, development, and responsible
              application of artificial intelligence across industries.
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              In collaboration with the Society for AI Management (SAIM).
            </p>
          </div>
          <FooterCol title="Explore" links={EXPLORE} />
          <FooterCol title="Convene" links={CONVENE} />
          <FooterCol title="Get in touch" links={GET_IN_TOUCH} />
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--surface-border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} National AI Consortium. All rights
            reserved.
          </p>
          <p>Purposeful &middot; Transparent &middot; Beneficial to society</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-white dark:text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
        {links.map(([text, href]) => (
          <li key={text}>
            {href.startsWith("/") && !href.startsWith("/#") ? (
              <Link
                href={href}
                className="transition-colors hover:text-white"
              >
                {text}
              </Link>
            ) : (
              <a
                href={href}
                className="transition-colors hover:text-white"
              >
                {text}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
