// The unit lessons, by unit. For now they are shown only in teacher mode, so a teacher can try
// them before pupils see them; set FOR_PUPILS to open them to everyone.
import type { Point, Rule, UnitLesson } from "./types.ts";
import { y8Graphs } from "./y8-graphs.ts";

export type * from "./types.ts";

export const UNIT_LESSONS: readonly UnitLesson[] = [y8Graphs];
export const FOR_PUPILS = false;

const byUnit = new Map(UNIT_LESSONS.map((l) => [l.unit, l]));

/** The lesson that opens a unit, if it has one and this pupil may see it. */
export const unitLessonFor = (unit: string, teacher: boolean): UnitLesson | undefined =>
  FOR_PUPILS || teacher ? byUnit.get(unit) : undefined;

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
