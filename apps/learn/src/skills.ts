// Each skill's levels, from the depths its generator supports, the misconceptions it can show, and
// the questions for a lesson.
import type { Question, Validator } from "@mathsplanner/core";
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

const offers = (lq: LessonQuestion, code: string) =>
  lq.question.parts.some((p) => p.misconceptions.some((m) => m.code === code));

/**
 * The question for a lesson item, trying the next seeds if a generator cannot make one. For an
 * item aimed at a misconception, it looks for a question offering that wrong answer, at the
 * item's depth first and then the skill's other depths, and settles for any question if none does.
 */
export function questionFor(item: LessonItem): LessonQuestion | undefined {
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
  for (let i = 0; i < TRIES; i++) {
    const lq = make(item.depth, item.seed + i);
    if (lq) return lq;
  }
  return undefined;
}
