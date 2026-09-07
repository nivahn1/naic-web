/** Shared helpers for the admin list pages. */

/**
 * PostgREST parses `or=(...)` itself, so commas, parens and dots inside a
 * search term would corrupt the filter. Strip them rather than trying to
 * escape — a search box loses nothing by ignoring punctuation.
 */
export function sanitizeQuery(value: string | undefined) {
  return (value ?? "").replace(/[,().*"'\\]/g, " ").trim().slice(0, 80);
}

/** Builds `col.ilike.*term*,col2.ilike.*term*` for `.or()`. */
export function orIlike(columns: string[], term: string) {
  return columns.map((c) => `${c}.ilike.*${term}*`).join(",");
}

/** Narrows a raw search param to one of the allowed filter values. */
export function pickFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

export type AdminSearchParams = {
  q?: string;
  status?: string;
  notice?: string;
  error?: string;
};
