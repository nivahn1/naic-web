"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Item = { href: string; label: string; icon: ReactNode; badge?: number };

function Icon({ d }: { d: string[] }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

const ICONS = {
  dashboard: ["M3 3h6v6H3z", "M11 3h6v4h-6z", "M11 9h6v8h-6z", "M3 11h6v6H3z"],
  members: [
    "M8 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M2.5 17c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5",
    "M14 4.2a2.8 2.8 0 0 1 0 5.4",
    "M15.5 12.8c1.4.5 2.5 1.6 2.5 3.4",
  ],
  registrations: [
    "M4 2.5h9l3 3V17a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 4 17Z",
    "M12.5 2.5v3.5H16",
    "M7 10.5h6",
    "M7 13.5h4",
  ],
  nominations: [
    "M10 2.5l2.2 4.5 5 .7-3.6 3.5.85 4.9L10 13.8l-4.45 2.3.85-4.9L2.8 7.7l5-.7z",
  ],
  advisory: [
    "M10 2.5 3 5.5v4.2c0 4 2.9 6.9 7 7.8 4.1-.9 7-3.8 7-7.8V5.5z",
    "M7.4 9.9 9.3 11.8 12.9 8.2",
  ],
  site: [
    "M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z",
    "M2.6 10h14.8",
    "M10 2.5c1.9 2 3 4.7 3 7.5s-1.1 5.5-3 7.5c-1.9-2-3-4.7-3-7.5s1.1-5.5 3-7.5Z",
  ],
  portal: [
    "M7.5 2.5H4a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 4 17.5h3.5",
    "M12.5 13.5 16.5 10l-4-3.5",
    "M16.5 10h-9",
  ],
} as const;

const MAIN: Item[] = [
  { href: "/admin", label: "Dashboard", icon: <Icon d={[...ICONS.dashboard]} /> },
  { href: "/admin/members", label: "Members", icon: <Icon d={[...ICONS.members]} /> },
  {
    href: "/admin/registrations",
    label: "Registrations",
    icon: <Icon d={[...ICONS.registrations]} />,
  },
];

const SUBMISSIONS: Item[] = [
  {
    href: "/admin/nominations",
    label: "Nominations",
    icon: <Icon d={[...ICONS.nominations]} />,
  },
  {
    href: "/admin/advisory",
    label: "Advisory Board",
    icon: <Icon d={[...ICONS.advisory]} />,
  },
];

const ELSEWHERE: Item[] = [
  { href: "/portal", label: "Member portal", icon: <Icon d={[...ICONS.portal]} /> },
  { href: "/", label: "Public site", icon: <Icon d={[...ICONS.site]} /> },
];

function NavGroup({
  title,
  items,
  pathname,
  counts,
}: {
  title: string;
  items: Item[];
  pathname: string;
  counts?: Record<string, number>;
}) {
  return (
    <div>
      <p className="px-3.5 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const badge = counts?.[item.href];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-white ring-1 ring-violet-400/30"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-violet-300" : ""}>{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {typeof badge === "number" && badge > 0 && (
                  <span className="rounded-full bg-fuchsia-500/25 px-2 py-0.5 text-[11px] font-semibold text-fuchsia-200 tabular-nums">
                    {badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** `counts` keys are hrefs — the number of unreviewed items in each section. */
export function AdminNav({ counts }: { counts?: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <nav className="pb-4">
      <NavGroup title="Main menu" items={MAIN} pathname={pathname} counts={counts} />
      <NavGroup
        title="Submissions"
        items={SUBMISSIONS}
        pathname={pathname}
        counts={counts}
      />
      <NavGroup title="Elsewhere" items={ELSEWHERE} pathname={pathname} />
    </nav>
  );
}
