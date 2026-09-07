"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Pushes `?q=` onto the current route; the page re-renders on the server and
 * filters there. Keeps every other query param (status filters, sort) intact.
 */
export function SearchBar({ placeholder = "Search something…" }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("q") ?? "";
  const [value, setValue] = useState(current);
  const [lastFromUrl, setLastFromUrl] = useState(current);

  // Reflect back/forward navigation and filter-link clicks. Adjusting state
  // during render (rather than in an effect) is the documented pattern for
  // resetting local state when an external value changes.
  if (current !== lastFromUrl) {
    setLastFromUrl(current);
    setValue(current);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params);
    const trimmed = value.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    next.delete("notice");
    next.delete("error");
    router.push(next.size ? `${pathname}?${next}` : pathname);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] py-1.5 pl-4 pr-1.5">
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className="h-4 w-4 shrink-0 text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--muted)]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500/40"
        >
          Search
        </button>
      </div>
    </form>
  );
}
