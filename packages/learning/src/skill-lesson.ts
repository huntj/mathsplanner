// The next lesson on a skill, as both apps start it: its review questions come from the skills the
// pupil has finished in the year, and it skips its worked example when a unit lesson that teaches
// the skill is done, since that lesson already showed the idea.
import type { CourseSection } from "@mathsplanner/core";
import { unitOf } from "./course.ts";
import { planLesson, type LessonPlan } from "./lesson.ts";
import { levelOf, type Progress } from "./progress.ts";
import { levelsOf } from "./skills.ts";
import { lessonId, lessonsFor, lessonTeaches } from "./unit-lessons/index.ts";

/** Whether a unit lesson that teaches a skill is done. */
export function taughtByLesson(progress: Progress, skill: string): boolean {
  const unit = unitOf(skill);
  return (
    unit !== undefined &&
    lessonsFor(unit.id, true).some(
      (l) => lessonId(l) in progress.unitLessons && lessonTeaches(l, unit.skills).includes(skill),
    )
  );
}

/**
 * Plans a lesson on a skill: its next level, or the level a teacher picked (`level`, counting
 * from 1), which then counts as reached rather than as one step up.
 */
export function skillLessonPlan(
  progress: Progress,
  section: CourseSection,
  skill: string,
  seed: number,
  level?: number,
): LessonPlan {
  const reviewFrom = section.units
    .flatMap((u) => u.skills)
    .filter((s) => s !== skill && levelOf(progress, s) >= levelsOf(s).pathLevels)
    .map((s) => ({ skill: s, info: levelsOf(s) }));
  const done = level ? level - 1 : levelOf(progress, skill);
  const { example, ...plan } = planLesson(skill, levelsOf(skill), done, reviewFrom, seed);
  return {
    ...plan,
    ...(example && !taughtByLesson(progress, skill) ? { example } : {}),
    ...(level ? { picked: true as const } : {}),
  };
}
