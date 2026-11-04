// The unit lessons, by unit. A new lesson shows only in teacher mode, so a teacher can try it
// first; once it has been reviewed, its unit goes in OPEN_TO_PUPILS and everyone sees it.
import type { Point, Rule, UnitLesson } from "./types.ts";
import { y7PlaceValue } from "./y7-place-value.ts";
import { y7Notation } from "./y7-notation.ts";
import { y7Calculating } from "./y7-calculating.ts";
import { y7Lines } from "./y7-lines.ts";
import { y7OrderOfOperations } from "./y7-order-of-operations.ts";
import { y7Simplifying } from "./y7-simplifying.ts";
import { y7Factors } from "./y7-factors.ts";
import { y7Angles } from "./y7-angles.ts";
import { y7Fdp } from "./y7-fdp.ts";
import { y7Equations } from "./y7-equations.ts";
import { y7Powers } from "./y7-powers.ts";
import { y7Ratio } from "./y7-ratio.ts";
import { y7Measures } from "./y7-measures.ts";
import { y7Area } from "./y7-area.ts";
import { y7Rounding } from "./y7-rounding.ts";
import { y7Averages } from "./y7-averages.ts";
import { y7Probability } from "./y7-probability.ts";
import { y8StandardForm } from "./y8-standard-form.ts";
import { y8Expressions } from "./y8-expressions.ts";
import { y8Area } from "./y8-area.ts";
import { y8Percentages } from "./y8-percentages.ts";
import { y8Equations } from "./y8-equations.ts";
import { y8Shapes } from "./y8-shapes.ts";
import { y8Graphs } from "./y8-graphs.ts";
import { y8Ratio } from "./y8-ratio.ts";
import { y8Constructions } from "./y8-constructions.ts";
import { y8Rates } from "./y8-rates.ts";
import { y8Transformations } from "./y8-transformations.ts";
import { y8Data } from "./y8-data.ts";

export type * from "./types.ts";

export const UNIT_LESSONS: readonly UnitLesson[] = [
  y7PlaceValue,
  y7Notation,
  y7Calculating,
  y7Lines,
  y7OrderOfOperations,
  y7Simplifying,
  y7Factors,
  y7Angles,
  y7Fdp,
  y7Equations,
  y7Powers,
  y7Ratio,
  y7Measures,
  y7Area,
  y7Rounding,
  y7Averages,
  y7Probability,
  y8StandardForm,
  y8Expressions,
  y8Area,
  y8Percentages,
  y8Equations,
  y8Shapes,
  y8Graphs,
  y8Ratio,
  y8Constructions,
  y8Rates,
  y8Transformations,
  y8Data,
];
/** Units whose lessons have been reviewed and are open to pupils. */
export const OPEN_TO_PUPILS: ReadonlySet<string> = new Set([
  "y7-place-value",
  "y7-notation",
  "y7-calculating",
  "y7-lines",
  "y7-order-of-operations",
  "y7-simplifying",
  "y7-factors",
  "y7-angles",
  "y7-fdp",
  "y7-equations",
  "y7-powers",
  "y7-ratio",
  "y7-measures",
  "y7-area",
  "y7-rounding",
  "y7-averages",
  "y7-probability",
  "y8-graphs",
]);

const byUnit = new Map(UNIT_LESSONS.map((l) => [l.unit, l]));

/** The lesson that opens a unit, if it has one and this pupil may see it. */
export const unitLessonFor = (unit: string, teacher: boolean): UnitLesson | undefined =>
  teacher || OPEN_TO_PUPILS.has(unit) ? byUnit.get(unit) : undefined;

/** y for a given x on a line. */
export const yOn = (rule: Rule, x: number) => rule.m * x + rule.c;

export const onLine = (rule: Rule, p: Point) => Math.abs(yOn(rule, p.x) - p.y) < 1e-9;

/** Whether two different points fix this line. */
export function makesLine(rule: Rule, a: Point, b: Point): boolean {
  return (a.x !== b.x || a.y !== b.y) && onLine(rule, a) && onLine(rule, b);
}

export const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

/**
 * Writes y = mx + c as a pupil would: y = 2x + 1, y = −x + 3, y = 3x − 2, y = 4. With `minus`
 * set to "-", it is TeX, to put between dollar signs.
 */
export function ruleText(rule: Rule, minus = "−"): string {
  const { m, c } = rule;
  const mx =
    m === 0 ? "" : m === 1 ? "x" : m === -1 ? `${minus}x` : `${m < 0 ? minus : ""}${Math.abs(m)}x`;
  if (!mx) return `y = ${c < 0 ? minus : ""}${Math.abs(c)}`;
  if (c === 0) return `y = ${mx}`;
  return `y = ${mx} ${c < 0 ? minus : "+"} ${Math.abs(c)}`;
}

/** The line through two points, or undefined when it is upright (it has no rule y = mx + c). */
export function ruleThrough(a: Point, b: Point): Rule | undefined {
  if (a.x === b.x) return undefined;
  const m = (b.y - a.y) / (b.x - a.x);
  return { m, c: a.y - m * a.x };
}

export { regular, through } from "./geometry.ts";
