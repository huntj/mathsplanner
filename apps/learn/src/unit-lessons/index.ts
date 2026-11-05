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
import { y9Indices } from "./y9-indices.ts";
import { y9Similarity } from "./y9-similarity.ts";
import { y9Factorising } from "./y9-factorising.ts";
import { y9StraightLine } from "./y9-straight-line.ts";
import { y9Trigonometry } from "./y9-trigonometry.ts";
import { y9Simultaneous } from "./y9-simultaneous.ts";
import { y9Percentages } from "./y9-percentages.ts";
import { y9Graphs } from "./y9-graphs.ts";
import { y9Probability } from "./y9-probability.ts";

export type * from "./types.ts";

export const UNIT_LESSONS: readonly UnitLesson[] = [
  ...y7PlaceValue,
  ...y7Notation,
  ...y7Calculating,
  ...y7Lines,
  ...y7OrderOfOperations,
  ...y7Simplifying,
  ...y7Factors,
  ...y7Angles,
  ...y7Fdp,
  ...y7Equations,
  ...y7Powers,
  ...y7Ratio,
  ...y7Measures,
  ...y7Area,
  ...y7Rounding,
  ...y7Averages,
  ...y7Probability,
  y8StandardForm,
  y8Expressions,
  y8Area,
  y8Percentages,
  ...y8Equations,
  y8Shapes,
  y8Graphs,
  y8Ratio,
  y8Constructions,
  y8Rates,
  y8Transformations,
  y8Data,
  ...y9Indices,
  ...y9Similarity,
  ...y9Factorising,
  ...y9StraightLine,
  ...y9Trigonometry,
  ...y9Simultaneous,
  ...y9Percentages,
  ...y9Graphs,
  ...y9Probability,
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
  "y8-standard-form",
  "y8-expressions",
  "y8-area",
  "y8-percentages",
  "y8-equations",
  "y8-shapes",
  "y8-graphs",
  "y8-ratio",
  "y8-constructions",
  "y8-rates",
  "y8-transformations",
  "y8-data",
  "y9-indices",
  "y9-similarity",
  "y9-factorising",
  "y9-straight-line",
  "y9-trigonometry",
  "y9-simultaneous",
  "y9-percentages",
  "y9-graphs",
  "y9-probability",
]);

/** A lesson's id: its own, or its unit's when the unit has just one lesson. */
export const lessonId = (lesson: UnitLesson) => lesson.id ?? lesson.unit;

const byId = new Map(UNIT_LESSONS.map((l) => [lessonId(l), l]));

const mayShow = (unit: string, teacher: boolean) => teacher || OPEN_TO_PUPILS.has(unit);

/** A unit's lessons that this pupil may see, in path order. */
export const lessonsFor = (unit: string, teacher: boolean): UnitLesson[] =>
  mayShow(unit, teacher) ? UNIT_LESSONS.filter((l) => l.unit === unit) : [];

/** A lesson by its id, if this pupil may see it. */
export function lessonById(id: string, teacher: boolean): UnitLesson | undefined {
  const lesson = byId.get(id);
  return lesson && mayShow(lesson.unit, teacher) ? lesson : undefined;
}

/** The skills a lesson teaches, whose worked examples it replaces once it is done. */
export const lessonTeaches = (
  lesson: UnitLesson,
  unitSkills: readonly string[],
): readonly string[] => lesson.teaches ?? (lesson.before ? [lesson.before] : unitSkills);

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
