// Helpers for lessons rebuilt on the stepped template (docs/proposals/lesson-stepped.md): the rule
// and an Explore; a check of what the method needs; the method shown, then typed a line at a
// time; practice with the unknown moving; new looks and a spot-the-mistake; an exit check; a
// real-life problem where one fits; and a summary to copy into a book.
import type { NumberLinePic, RelationPic, Screen, UnitLesson, Variation, Words } from "./types.ts";

export const find = (list: readonly UnitLesson[], id: string) => list.find((l) => l.id === id);

/** A screen moved into a part of the lesson plan, by its tag. */
export const tagged = (tag: string, screen: Screen): Screen => ({ ...screen, tag });

/** A question that stays in words, with the reason: a number check, say. */
export const words = (screen: Screen, why: string): Screen => ({ ...screen, wordsOnly: why });

/**
 * A lesson on the stepped template, in place of its original: the same unit, id and skill, so a
 * pupil who finished it keeps their progress, with new screens.
 */
export function stepped(
  original: UnitLesson | undefined,
  plan: { method: string[]; variation: Variation; screens: Screen[] },
): UnitLesson {
  if (!original) throw new Error("No lesson to rebuild");
  return {
    unit: original.unit,
    ...(original.id ? { id: original.id } : {}),
    ...(original.before ? { before: original.before } : {}),
    ...(original.teaches ? { teaches: original.teaches } : {}),
    title: original.title,
    summary: original.summary,
    plan: "stepped",
    method: plan.method,
    variation: plan.variation,
    screens: plan.screens,
  };
}

/**
 * One of a lesson's own screens with some of its fields changed: its words without the numbers,
 * say, or a diagram added. `tag` picks it out where two screens share a title.
 */
export function reworded(
  list: readonly UnitLesson[],
  id: string,
  title: string,
  changes: Partial<
    Record<"title" | "text" | "picture" | "hint" | "bubble" | "tag" | "start", unknown>
  >,
  tag?: string,
): Screen {
  const screen = find(list, id)?.screens.find(
    (s) => s.title === title && (tag === undefined || s.tag === tag),
  );
  if (!screen) throw new Error(`No screen "${title}" in ${id}`);
  return { ...screen, ...changes } as Screen;
}

/** One of a lesson's own screens, by its tag: its Spot the mistake or exit check, say. */
export function own(list: readonly UnitLesson[], id: string, tag: string): Screen {
  const screen = find(list, id)?.screens.find((s) => s.tag === tag);
  if (!screen) throw new Error(`No "${tag}" screen in ${id}`);
  return screen;
}

export const relation = (cells: [string, Words][], joins: Words[], asks?: number): RelationPic => ({
  kind: "relation",
  cells: cells.map(([label, value]) => ({ label, value })),
  joins,
  ...(asks === undefined ? {} : { asks }),
});

/** A number line from min to max, a tick every `step`, with marks at the values given. */
export const numberLine = (
  min: number,
  max: number,
  step: number,
  marks: (number | [at: number, label: string])[] = [],
  e: Partial<Pick<NumberLinePic, "every" | "interval" | "jumps" | "denominator">> = {},
): NumberLinePic => ({
  kind: "number-line",
  min,
  max,
  step,
  ...e,
  marks: marks.map((m) => (typeof m === "number" ? { at: m } : { at: m[0], label: m[1] })),
});

/** All of a lesson's own screens with a tag, moved to a new one: its "Your turn" gap fills, say. */
export function owned(list: readonly UnitLesson[], id: string, tag: string, to: string): Screen[] {
  const screens = find(list, id)?.screens.filter((s) => s.tag === tag) ?? [];
  if (!screens.length) throw new Error(`No "${tag}" screens in ${id}`);
  return screens.map((s) => ({ ...s, tag: to }));
}
