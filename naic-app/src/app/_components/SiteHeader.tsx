"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV: {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}[] = [
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about#mission", label: "Mission & Vision" },
      { href: "/about#founder", label: "Welcome Letter" },
      { href: "/about/board-of-directors", label: "Board of Directors" },
      { href: "/about/advisory-board", label: "Advisory Board" },
    ],
  },
  { href: "/programs", label: "Programs" },
  { href: "/training", label: "Training" },
  { href: "/events", label: "Events" },
  { href: "/recognition", label: "Recognition" },
  { href: "/chapters", label: "Chapters" },
];

export function SiteHeader({ authed = false }: { authed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-300 sm:px-4 ${
          scrolled || open
            ? "border-white/15 bg-white/[0.06] shadow-lg shadow-black/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/40"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center pl-1">
          <Logo className="h-9" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {item.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                    className="mt-0.5 transition-transform group-hover:rotate-180"
                  >
                    <path
                      d="M2 3.5 5 6.5 8 3.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full z-10 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-[220px] rounded-xl border border-white/15 bg-[#00004d]/95 p-1.5 shadow-xl backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {authed ? (
            <Link
              href="/portal"
              className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-600/25 transition-transform hover:-translate-y-0.5"
            >
              Member portal
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white dark:text-slate-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-600/25 transition-transform hover:-translate-y-0.5"
              >
                Join
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-200 lg:hidden dark:border-white/15 dark:text-slate-200"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/15 bg-[#00004d]/95 p-3 shadow-xl backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#00004d]/95">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-200 hover:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 flex flex-col border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/15 pt-3 dark:border-white/10">
            {authed ? (
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="col-span-2 rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Member portal
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 dark:border-white/15 dark:text-slate-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-br from-[#00004d] to-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
