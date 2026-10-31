// Each skill's levels, from the depths its generator supports, and the questions for a lesson.
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

export interface LessonQuestion {
  question: Question;
  validators: ReadonlyMap<number, Validator>;
}

/** Seeds to try before giving up on a question; a generator rarely rejects a seed outright. */
const TRIES = 5;

/** The question for a lesson item, trying the next seeds if a generator cannot make one. */
export function questionFor(item: LessonItem): LessonQuestion | undefined {
  const generator = byId.get(item.skill);
  if (!generator) return undefined;
  for (let i = 0; i < TRIES; i++) {
    try {
      return generator.generateFull({
        depth: item.depth,
        numbers: item.numbers,
        seed: item.seed + i,
      });
    } catch {
      // Try the next seed.
    }
  }
  return undefined;
}
