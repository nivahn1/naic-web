export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="National AI Consortium"
    >
      <defs>
        <linearGradient id="naic-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d946ef" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="12"
        fill="url(#naic-logo-g)"
      />
      <g
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
        fill="none"
      >
        <path d="M20 8.5 30 14v12l-10 5.5L10 26V14z" />
        <path d="M20 8.5v9m0 0 8.5-4.7M20 17.5 11.5 12.8M20 17.5V31" />
      </g>
      <g fill="#fff">
        <circle cx="20" cy="8.5" r="2.4" />
        <circle cx="30" cy="14" r="2.1" />
        <circle cx="30" cy="26" r="2.1" />
        <circle cx="20" cy="31.5" r="2.4" />
        <circle cx="10" cy="26" r="2.1" />
        <circle cx="10" cy="14" r="2.1" />
        <circle cx="20" cy="17.5" r="2.7" />
      </g>
    </svg>
  );
}
