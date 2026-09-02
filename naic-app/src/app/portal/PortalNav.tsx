"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/membership", label: "Membership" },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {LINKS.map((link) => {
        const active =
          link.href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--surface)] text-slate-900 shadow-sm ring-1 ring-[var(--surface-border)] dark:text-white"
                : "text-[var(--muted)] hover:bg-black/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
