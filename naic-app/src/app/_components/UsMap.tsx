import { STATES, isLive } from "@/lib/chapters";
import { US_STATE_PATHS } from "@/lib/us-map-paths";

/**
 * Map of the 50 states, each shaded by chapter status. `id` must be unique
 * on the page — it namespaces the live-state gradient.
 */
export function UsMap({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 959 593"
      role="img"
      aria-label="Map of National AI Consortium chapters across the United States"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-live`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      {STATES.map((state) => (
        <path
          key={state.abbr}
          d={US_STATE_PATHS[state.abbr]}
          fill={isLive(state.abbr) ? `url(#${id}-live)` : "rgba(255,255,255,0.12)"}
          stroke="#00004d"
          strokeWidth={1.5}
          strokeLinejoin="round"
        >
          <title>{`${state.name} — chapter ${isLive(state.abbr) ? "live" : "forming"}`}</title>
        </path>
      ))}
    </svg>
  );
}
