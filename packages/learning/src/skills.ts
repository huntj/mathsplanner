// Each skill's levels, from the depths its generator supports, the misconceptions it can show, and
// the questions for a lesson.
import type { Question, Rich, Validator } from "@mathsplanner/core";
import { generators } from "@mathsplanner/generators";
import { skillLevels, type SkillLevels } from "./course.ts";
import type { LessonItem } from "./lesson.ts";

const byId = new Map(generators.map((g) => [g.id, g]));
const cache = new Map<string, SkillLevels>();

export function levelsOf(skill: string): SkillLevels {
  let info = cache.get(skill);
  if (!info) {
    info = skillLevels(byId.get(skill)?.depths ?? [1]);
    cache.set(skill, info);
  }
  return info;
}

export const hasGenerator = (skill: string) => byId.has(skill);

/** The misconception codes a skill's questions can offer as wrong answers. */
export const misconceptionsOf = (skill: string): readonly string[] =>
  byId.get(skill)?.misconceptions ?? [];

/** The skills among `among` whose questions can offer a misconception as a wrong answer. */
export const skillsShowing = (code: string, among: readonly string[]): string[] =>
  among.filter((s) => byId.get(s)?.misconceptions.includes(code));

export interface LessonQuestion {
  question: Question;
  validators: ReadonlyMap<number, Validator>;
}

/** Seeds to try before giving up on a question; a generator rarely rejects a seed outright. */
const TRIES = 5;
/** Seeds to try at each depth for a question that offers the misconception being aimed at. */
const TARGET_TRIES = 12;
/** Seeds to try for a question in the form the pupil saw longest ago. */
const FRESH_TRIES = 20;

const offers = (lq: LessonQuestion, code: string) =>
  lq.question.parts.some((p) => p.misconceptions.some((m) => m.code === code));

const text = (rich: Rich) =>
  rich.map((n) => (n.t === "text" ? n.v : n.t === "math" ? "M" : "")).join("");

/**
 * A question's form, as a short code: its archetype and wording with the numbers taken out. Two
 * questions with the same form differ only in their numbers.
 */
export function formOf(question: Question): string {
  const wording = [question.stem, ...question.parts.map((p) => p.prompt)]
    .map(text)
    .join("/")
    .replace(/-?\d+(\.\d+)?/g, "#");
  let hash = 5381;
  for (const ch of `${question.archetype}|${wording}`) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}

/**
 * The question for a lesson item, trying the next seeds if a generator cannot make one. For an
 * item aimed at a misconception, it looks for a question offering that wrong answer, at the
 * item's depth first and then the skill's other depths, and settles for any question if none does.
 * Otherwise it prefers the form the pupil saw longest ago: `lastSeen` gives each form seen a number,
 * higher for more recent, and a form not in it has not been seen at all. So a skill with several
 * kinds of question rotates through them rather than repeating one.
 */
export function questionFor(
  item: LessonItem,
  lastSeen: ReadonlyMap<string, number> = new Map(),
): LessonQuestion | undefined {
  const generator = byId.get(item.skill);
  if (!generator) return undefined;
  const make = (depth: typeof item.depth, seed: number) => {
    try {
      return generator.generateFull({ depth, numbers: item.numbers, seed });
    } catch {
      return undefined;
    }
  };
  const target = item.target;
  if (target) {
    const depths = [item.depth, ...generator.depths.filter((d) => d !== item.depth)];
    for (const depth of depths)
      for (let i = 0; i < TARGET_TRIES; i++) {
        const lq = make(depth, item.seed + i);
        if (lq && offers(lq, target)) return lq;
      }
  }
  let best: { lq: LessonQuestion; seen: number } | undefined;
  for (let i = 0; i < (lastSeen.size ? FRESH_TRIES : TRIES); i++) {
    const lq = make(item.depth, item.seed + i);
    if (!lq) continue;
    const seen = lastSeen.get(formOf(lq.question));
    if (seen === undefined) return lq;
    if (!best || seen < best.seen) best = { lq, seen };
  }
  return best?.lq;
}
