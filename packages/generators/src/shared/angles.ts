// Angle helpers shared by the angles and geometry generators. Kept here, not in a generator,
// because "anything used by two statements moves into shared code" (docs/design.md).
import { reject, type AnswerValue, type Numbers, type Rng } from "@mathsplanner/core";
import * as A from "@mathsplanner/archetypes";

/** LaTeX for a number of degrees. */
export const deg = (v: number) => `${v}^\\circ`;

/** Angles are multiples of this at each numbers setting. */
export function angleStep(numbers: Numbers): number {
  return { friendly: 10, standard: 5, stretch: 1 }[numbers];
}

/** An angle from min to max (inclusive) that is a multiple of the numbers setting's step. */
export function pickAngle(
  rng: Rng,
  numbers: Numbers,
  min: number,
  max: number,
  avoid: readonly number[] = [],
): number {
  const step = angleStep(numbers);
  const options: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step)
    if (!avoid.includes(v)) options.push(v);
  if (options.length === 0) return reject(`no angle from ${min}° to ${max}°`);
  return rng.pick(options);
}

/**
 * Splits `total` into `parts` angles, each at least `min` and a multiple of the step, with no
 * right angles (they would make the question too easy) unless allowed.
 */
export function splitAngles(
  rng: Rng,
  numbers: Numbers,
  total: number,
  parts: number,
  options: { min?: number; max?: number; allowRight?: boolean } = {},
): number[] {
  const step = angleStep(numbers);
  const min = options.min ?? Math.max(step, 20);
  const max = options.max ?? total - min * (parts - 1);
  for (let attempt = 0; attempt < 50; attempt++) {
    const angles: number[] = [];
    let left = total;
    for (let i = 0; i < parts - 1; i++) {
      const room = left - min * (parts - 1 - i);
      angles.push(pickAngle(rng, numbers, min, Math.min(max, room)));
      left -= angles[angles.length - 1] ?? 0;
    }
    angles.push(left);
    const ok = angles.every(
      (a) => a >= min && a <= max && a % step === 0 && (options.allowRight || a !== 90),
    );
    if (ok) return angles;
  }
  return reject(`could not split ${total}° into ${parts} angles`);
}

export const sum = (values: readonly number[]) => values.reduce((s, v) => s + v, 0);

/**
 * Keeps only wrong answers that differ from the answer and from each other, and are positive.
 * A misconception that happens to give the right answer is not a useful distractor.
 */
export function wrongs(answer: number, candidates: (A.Wrong | undefined)[]): A.Wrong[] {
  const seen = new Set([answer]);
  const out: A.Wrong[] = [];
  for (const w of candidates) {
    if (!w || w.value.kind !== "number") continue;
    const v = w.value.value;
    if (v <= 0 || seen.has(v)) continue;
    seen.add(v);
    out.push(w);
  }
  return out;
}

/** The numbers a student entered, for open-construction validators. */
export function numbersOf(values: readonly AnswerValue[]): number[] | undefined {
  const out = values.map((v) => (v.type === "number" ? v.value : Number.NaN));
  return out.every(Number.isFinite) ? out : undefined;
}

/** Joins items for prose: "47°, 60° and 35°". */
export function listOf(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Shared feedback for the totals students most often confuse. */
export const TOTALS = {
  line: { total: 180, reason: "Angles on a straight line add up to 180°." },
  point: { total: 360, reason: "Angles at a point add up to 360°." },
  triangle: { total: 180, reason: "The angles in a triangle add up to 180°." },
  quadrilateral: { total: 360, reason: "The angles in a quadrilateral add up to 360°." },
} as const;
