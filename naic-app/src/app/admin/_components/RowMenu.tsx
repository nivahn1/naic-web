"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export type RowMenuItem = {
  label: string;
  /** A Server Action from ../actions.ts, passed down as a reference. */
  action: (formData: FormData) => Promise<void>;
  /** Extra hidden fields submitted alongside the row id. */
  fields?: Record<string, string>;
  danger?: boolean;
  /** Set to require a second click. The item's label becomes this first. */
  confirmLabel?: string;
  /** Optional heading; rendered once above the first item that carries it. */
  group?: string;
};

/**
 * The submit button lives in its own component so it can read useFormStatus,
 * which only reports the status of the form it is rendered inside.
 */
function MenuItemButton({
  item,
  confirming,
  onConfirmNeeded,
}: {
  item: RowMenuItem;
  confirming: boolean;
  onConfirmNeeded: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      role="menuitem"
      disabled={pending}
      onClick={(e) => {
        // First click on a destructive item only arms it.
        if (item.confirmLabel && !confirming) {
          e.preventDefault();
          onConfirmNeeded();
        }
      }}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:opacity-60 ${
        item.danger
          ? "text-rose-300 hover:bg-rose-500/15"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
      } ${confirming ? "bg-rose-500/20 font-semibold" : ""}`}
    >
      {pending ? "Working…" : confirming ? item.confirmLabel : item.label}
    </button>
  );
}

/**
 * The "…" menu on each table row.
 *
 * Two things here are load-bearing:
 *
 * 1. The panel is positioned `fixed` against the trigger's rect rather than
 *    absolutely inside the row. The tables scroll horizontally, and an
 *    `overflow-x-auto` ancestor clips absolutely-positioned children on both
 *    axes, which would cut the menu off.
 *
 * 2. Submitting must NOT close the menu. Closing unmounts the <form> while
 *    the submit event is still in flight, which cancels the Server Action
 *    before it is ever dispatched — the request never leaves the browser.
 *    The menu closes when the action's redirect lands instead.
 */
export function RowMenu({
  id,
  redirectTo,
  items,
  label = "Actions",
}: {
  id: string;
  redirectTo: string;
  items: RowMenuItem[];
  label?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [coords, setCoords] = useState<{
    left: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  }>({ left: 0, top: 0, maxHeight: 400 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Come back to the view the admin was actually looking at — same filter,
  // same search — rather than the bare section URL. Stale flash messages are
  // dropped so the old banner doesn't reappear.
  const carried = new URLSearchParams(searchParams);
  carried.delete("notice");
  carried.delete("error");
  const returnTo = carried.size
    ? `${pathname}?${carried}`
    : pathname || redirectTo;

  // The action redirects on completion, which changes the query string. That
  // is the signal the work is done, so close then. Adjusting state during
  // render (rather than in an effect) avoids a cascading re-render.
  const paramsKey = searchParams.toString();
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  if (paramsKey !== lastParamsKey) {
    setLastParamsKey(paramsKey);
    if (open) {
      setOpen(false);
      setConfirming(null);
    }
  }

  const close = useCallback(() => {
    setOpen(false);
    setConfirming(null);
  }, []);

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const width = 224;
    const margin = 12;
    const left = Math.max(
      8,
      Math.min(rect.right - width, window.innerWidth - width - 8),
    );

    // A long menu near the bottom of the window would otherwise run off the
    // screen, so flip above the trigger when there's more room there. Either
    // way the panel is capped to the space available and scrolls inside it.
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const flipUp = spaceBelow < 240 && spaceAbove > spaceBelow;

    setCoords(
      flipUp
        ? {
            left,
            bottom: window.innerHeight - rect.top + 6,
            maxHeight: Math.max(160, spaceAbove),
          }
        : {
            left,
            top: rect.bottom + 6,
            maxHeight: Math.max(160, spaceBelow),
          },
    );
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    // Capture phase so scrolling any ancestor (including the table) closes it.
    window.addEventListener("scroll", close, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => (open ? close() : setOpen(true))}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
          open
            ? "border-violet-400/50 bg-white/10 text-white"
            : "border-transparent text-[var(--muted)] hover:border-[var(--surface-border)] hover:bg-white/5 hover:text-white"
        }`}
      >
        <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="currentColor">
          <circle cx="3" cy="8" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="13" cy="8" r="1.4" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          style={{
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            width: 224,
            maxHeight: coords.maxHeight,
          }}
          className="fixed z-50 overflow-y-auto overscroll-contain rounded-xl border border-[var(--surface-border)] bg-[#0d0a26] p-1.5 shadow-2xl shadow-black/60"
        >
          {items.map((item, i) => {
            const newGroup = item.group && item.group !== items[i - 1]?.group;

            return (
              <form key={item.label} action={item.action}>
                {newGroup && (
                  <p className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {item.group}
                  </p>
                )}
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="redirect_to" value={returnTo} />
                {Object.entries(item.fields ?? {}).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <MenuItemButton
                  item={item}
                  confirming={confirming === i}
                  onConfirmNeeded={() => setConfirming(i)}
                />
              </form>
            );
          })}
        </div>
      )}
    </>
  );
}
