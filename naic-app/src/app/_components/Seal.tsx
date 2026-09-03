import type { CSSProperties } from "react";

export type SealGlyph =
  | "leadership"
  | "ethics"
  | "literacy"
  | "pathways"
  | "business"
  | "policy"
  | "generative"
  | "custom";

/** Disc + lettering colors, in light and dark mode. */
export type SealColor = {
  disc: string;
  discDark: string;
  ink: string;
  inkDark: string;
};

export type SealMark = {
  top: string;
  bottom: string;
  glyph: SealGlyph;
  color: SealColor;
};

/** White line-art marks that sit at the center of each seal. */
function Glyph({ glyph }: { glyph: SealGlyph }) {
  const line = {
    fill: "none",
    stroke: "#fff",
    strokeWidth: 7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  switch (glyph) {
    case "leadership":
      return (
        <g>
          <path {...line} d="M98 166 L98 128 L154 86" />
          <path {...line} d="M132 86 L154 86 L154 108" />
          <path {...line} d="M98 148 L124 148" />
          <circle cx="133" cy="148" r="7" fill="#fff" />
          <circle cx="98" cy="174" r="7" fill="#fff" />
        </g>
      );
    case "ethics":
      return (
        <g>
          <path
            {...line}
            d="M130 84 L172 100 V138 C172 160 152 176 130 186 C108 176 88 160 88 138 V100 Z"
            strokeWidth={6}
          />
          <path {...line} d="M130 104 V166" strokeWidth={6} />
          <path {...line} d="M108 118 H152" strokeWidth={6} />
          <path {...line} d="M114 168 H146" strokeWidth={6} />
          <path {...line} d="M97 122 A 14 14 0 0 0 119 122" strokeWidth={5} />
          <path {...line} d="M141 122 A 14 14 0 0 0 163 122" strokeWidth={5} />
          <circle cx="130" cy="102" r="6" fill="#fff" />
          <circle cx="108" cy="118" r="5" fill="#fff" />
          <circle cx="152" cy="118" r="5" fill="#fff" />
        </g>
      );
    case "literacy":
      return (
        <g>
          <path
            {...line}
            d="M130 78 L134 88 L144 92 L134 96 L130 106 L126 96 L116 92 L126 88 Z"
            fill="#fff"
            strokeWidth={4}
          />
          <path
            {...line}
            d="M130 128 C118 118 106 114 90 114 V166 C106 166 118 170 130 180 C142 170 154 166 170 166 V114 C154 114 142 118 130 128 Z"
            strokeWidth={6}
          />
          <path {...line} d="M130 128 V180" strokeWidth={6} />
        </g>
      );
    case "pathways":
      return (
        <g>
          <path {...line} d="M130 88 L184 114 L130 140 L76 114 Z" fill="#fff" />
          <path {...line} d="M99 128 V152 C110 164 150 164 161 152 V128" strokeWidth={6} />
          <path {...line} d="M184 114 V150" strokeWidth={6} />
          <circle cx="184" cy="160" r="8" fill="#fff" />
        </g>
      );
    case "business":
      return (
        <g>
          <rect x="92" y="150" width="17" height="30" rx="5" fill="#fff" />
          <rect x="121" y="136" width="17" height="44" rx="5" fill="#fff" />
          <rect x="150" y="118" width="17" height="62" rx="5" fill="#fff" />
          <path {...line} d="M90 124 L114 104 L134 120 L170 86" strokeWidth={6} />
          <path {...line} d="M150 86 H170 V106" strokeWidth={6} />
        </g>
      );
    case "policy":
      return (
        <g>
          <path {...line} d="M96 82 H142 L162 102 V162 H96 Z" strokeWidth={6} />
          <path {...line} d="M142 82 V102 H162" strokeWidth={6} />
          <path {...line} d="M112 120 H146" strokeWidth={6} />
          <path {...line} d="M112 138 H134" strokeWidth={6} />
          <path {...line} d="M134 158 L150 174 L178 140" strokeWidth={9} />
        </g>
      );
    case "generative":
      return (
        <g>
          <circle cx="130" cy="114" r="32" {...line} strokeWidth={6} />
          <path {...line} d="M120 116 L127 125 L134 110 L141 120" strokeWidth={5} />
          <path {...line} d="M115 142 V154" strokeWidth={6} />
          <path {...line} d="M145 142 V154" strokeWidth={6} />
          <path {...line} d="M112 158 H148" strokeWidth={6} />
          <path {...line} d="M118 172 H142" strokeWidth={6} />
          <path
            {...line}
            d="M172 74 L175 84 L185 87 L175 90 L172 100 L169 90 L159 87 L169 84 Z"
            fill="#fff"
            strokeWidth={4}
          />
        </g>
      );
    case "custom":
      return (
        <g>
          <path {...line} d="M92 106 H107" strokeWidth={6} />
          <path {...line} d="M133 106 H168" strokeWidth={6} />
          <circle cx="120" cy="106" r="12" fill="#fff" />
          <path {...line} d="M92 130 H137" strokeWidth={6} />
          <path {...line} d="M163 130 H168" strokeWidth={6} />
          <circle cx="150" cy="130" r="12" fill="#fff" />
          <path {...line} d="M92 154 H99" strokeWidth={6} />
          <path {...line} d="M125 154 H168" strokeWidth={6} />
          <circle cx="112" cy="154" r="12" fill="#fff" />
        </g>
      );
  }
}

/**
 * Circular seal: a filled disc with a white mark, wrapped by curved lettering
 * that arcs over the top and under the bottom.
 *
 * `id` must be unique on the page — it namespaces the two text-path arcs.
 */
export function Seal({
  id,
  label,
  mark,
  className,
  tone = "auto",
}: {
  id: string;
  label: string;
  mark: SealMark;
  className?: string;
  /**
   * "auto" follows the color scheme; "dark" pins the light-on-dark palette,
   * for the always-dark hero bands.
   */
  tone?: "auto" | "dark";
}) {
  const { color } = mark;
  const onDark = tone === "dark";

  return (
    <svg
      viewBox="0 0 260 260"
      role="img"
      aria-label={label}
      className={className}
      style={
        {
          "--disc": color.disc,
          "--disc-dark": color.discDark,
          "--ink": color.ink,
          "--ink-dark": color.inkDark,
        } as CSSProperties
      }
    >
      <defs>
        <path id={`${id}-arc-top`} d="M 38 130 A 92 92 0 0 1 222 130" fill="none" />
        <path id={`${id}-arc-bottom`} d="M 22 130 A 108 108 0 0 0 238 130" fill="none" />
      </defs>

      <circle
        cx="130"
        cy="130"
        r="78"
        className={
          onDark
            ? "fill-[var(--disc-dark)]"
            : "fill-[var(--disc)] dark:fill-[var(--disc-dark)]"
        }
      />
      <Glyph glyph={mark.glyph} />

      <g
        className={`font-display ${
          onDark ? "fill-[var(--ink-dark)]" : "fill-[var(--ink)] dark:fill-[var(--ink-dark)]"
        }`}
        fontSize="21"
        fontWeight="700"
        letterSpacing="1.4"
        textAnchor="middle"
      >
        <text>
          <textPath href={`#${id}-arc-top`} startOffset="50%">
            {mark.top}
          </textPath>
        </text>
        <text>
          <textPath href={`#${id}-arc-bottom`} startOffset="50%">
            {mark.bottom}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
