// Each skill's levels, from the depths its generator supports.
import { generators } from "@mathsplanner/generators";
import { skillLevels, type SkillLevels } from "./course.ts";

const depths = new Map(generators.map((g) => [g.id, g.depths]));
const cache = new Map<string, SkillLevels>();

export function levelsOf(skill: string): SkillLevels {
  let info = cache.get(skill);
  if (!info) {
    info = skillLevels(depths.get(skill) ?? [1]);
    cache.set(skill, info);
  }
  return info;
}

export const hasGenerator = (skill: string) => depths.has(skill);
