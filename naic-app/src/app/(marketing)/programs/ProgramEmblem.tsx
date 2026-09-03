import type { CSSProperties } from "react";
import type { Program, ProgramGlyph } from "./programs";

/** White line-art marks that sit at the center of each seal. */
function Glyph({ glyph }: { glyph: ProgramGlyph }) {
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
  }
}

/**
 * Circular program seal: a filled disc with a white mark, wrapped by curved
 * lettering that arcs over the top and under the bottom.
 */
export function ProgramEmblem({
  program,
  className,
  tone = "auto",
}: {
  program: Program;
  className?: string;
  /**
   * "auto" follows the color scheme; "dark" pins the light-on-dark palette,
   * for the always-dark hero bands.
   */
  tone?: "auto" | "dark";
}) {
  const { emblem, slug } = program;
  const { color } = emblem;
  const onDark = tone === "dark";

  return (
    <svg
      viewBox="0 0 260 260"
      role="img"
      aria-label={program.name}
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
        <path id={`${slug}-arc-top`} d="M 38 130 A 92 92 0 0 1 222 130" fill="none" />
        <path
          id={`${slug}-arc-bottom`}
          d="M 22 130 A 108 108 0 0 0 238 130"
          fill="none"
        />
      </defs>

      <circle
        cx="130"
        cy="130"
        r="78"
        className={
          onDark ? "fill-[var(--disc-dark)]" : "fill-[var(--disc)] dark:fill-[var(--disc-dark)]"
        }
      />
      <Glyph glyph={emblem.glyph} />

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
          <textPath href={`#${slug}-arc-top`} startOffset="50%">
            {emblem.top}
          </textPath>
        </text>
        <text>
          <textPath href={`#${slug}-arc-bottom`} startOffset="50%">
            {emblem.bottom}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
