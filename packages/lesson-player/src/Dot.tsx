// Dot, the mascot: a decimal point come to life, who takes the shape of the topic being practised,
// a triangle for geometry, a slice of pie for fractions, and so on, with the same face throughout.
// The face sits in the middle of every shape (eyes at x 38 and 62, y 50; cheeks at x 29 and 71,
// y 63), so each shape keeps those points inside it. Logo pairs Dot with the app's name.
import type { ReactNode } from "react";
import type { Family } from "@mathsplanner/learning";

export type Mood = "happy" | "cheer" | "oops";

/** Dot's body for each family, drawn in a 100 by 100 box, with where the shine sits. */
const SHAPES: Record<Family, { body: ReactNode; shine?: [number, number] }> = {
  number: { body: <circle cx="50" cy="52" r="38" />, shine: [36, 36] },
  calculation: {
    body: (
      <path d="M34 12h32a6 6 0 0 1 6 6v12h12a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H72v12a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V74H16a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6h12V18a6 6 0 0 1 6-6z" />
    ),
    shine: [40, 24],
  },
  // A pie with a slice taken out of the top right.
  fractions: {
    body: <path d="M50 52 L50 14 A38 38 0 1 0 79.1 27.6 Z" />,
    shine: [32, 38],
  },
  // A diamond: a rounded square on its point.
  algebra: {
    body: (
      <path d="M45 11.5a7 7 0 0 1 10 0l35.5 35.5a7 7 0 0 1 0 10L55 92.5a7 7 0 0 1-10 0L9.5 57a7 7 0 0 1 0-10z" />
    ),
    shine: [40, 28],
  },
  // A tall rounded bar, as in a ratio's parts.
  ratio: { body: <rect x="20" y="8" width="60" height="88" rx="24" />, shine: [34, 26] },
  // A ruler: a wide rounded bar.
  measures: { body: <rect x="8" y="24" width="84" height="56" rx="16" />, shine: [22, 36] },
  // A rounded triangle.
  geometry: {
    body: (
      <path d="M44.6 15.3a6.3 6.3 0 0 1 10.8 0l35 64.8A6.3 6.3 0 0 1 84.9 90H15.1a6.3 6.3 0 0 1-5.5-9.9z" />
    ),
    shine: [46, 30],
  },
  // Three bars of a bar chart, joined.
  statistics: {
    body: (
      <>
        <rect x="10" y="40" width="28" height="52" rx="8" />
        <rect x="34" y="12" width="32" height="80" rx="9" />
        <rect x="62" y="28" width="28" height="64" rx="8" />
      </>
    ),
    shine: [44, 26],
  },
  // A dice, with pips in two corners.
  probability: { body: <rect x="12" y="14" width="76" height="76" rx="18" />, shine: [26, 28] },
};

export function Dot({
  size = 64,
  mood = "happy",
  family = "number",
}: {
  size?: number;
  mood?: Mood;
  family?: Family;
}) {
  const shape = SHAPES[family];
  return (
    <svg
      className={`dot dot-${mood}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Dot"
    >
      <ellipse cx="50" cy="96" rx="26" ry="3.5" className="dot-shadow" />
      {/* Keyed on the shape, so a change of shape plays the pop. */}
      <g className="dot-body" key={family}>
        <g className="dot-fill">{shape.body}</g>
        {shape.shine && (
          <circle cx={shape.shine[0]} cy={shape.shine[1]} r="7" className="dot-shine" />
        )}
        {family === "probability" && (
          <>
            <circle cx="74" cy="28" r="4" className="dot-pip" />
            <circle cx="26" cy="76" r="4" className="dot-pip" />
          </>
        )}
        <ellipse cx="38" cy="50" rx="5" ry={mood === "oops" ? 5 : 7} className="dot-eye" />
        <ellipse cx="62" cy="50" rx="5" ry={mood === "oops" ? 5 : 7} className="dot-eye" />
        <circle cx="39.5" cy="47.5" r="1.8" className="dot-glint" />
        <circle cx="63.5" cy="47.5" r="1.8" className="dot-glint" />
        <circle cx="29" cy="63" r="5" className="dot-cheek" />
        <circle cx="71" cy="63" r="5" className="dot-cheek" />
        {mood === "cheer" ? (
          <path d="M39 62 Q50 76 61 62 Z" className="dot-mouth-open" />
        ) : mood === "oops" ? (
          <path d="M43 67 Q50 62 57 67" className="dot-mouth" />
        ) : (
          <path d="M41 63 Q50 71 59 63" className="dot-mouth" />
        )}
      </g>
    </svg>
  );
}

/** The app's logo: Dot and the name. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="logo">
      <Dot size={size} />
      <span className="logo-name">
        Learn <span>Maths</span>
      </span>
    </span>
  );
}
