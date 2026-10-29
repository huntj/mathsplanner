// Example progress, to see the app part-way through a year: the first half of the units finished,
// some skills mastered or legendary, the next unit under way, and a two-week streak.
import type { CourseSection } from "@mathsplanner/core";
import type { SkillLevels } from "./course.ts";
import {
  addDays,
  emptyProgress,
  LESSON_XP,
  type Progress,
  type SkillProgress,
} from "./progress.ts";

export function exampleProgress(
  section: CourseSection,
  infoOf: (skill: string) => SkillLevels,
  today: string,
): Progress {
  const progress = emptyProgress();
  progress.settings = { ...progress.settings, stage: section.stage, dailyGoal: 2 };
  progress.example = true;

  const finished = Math.ceil(section.units.length / 2);
  const skills: Record<string, SkillProgress> = {};
  let lessons = 0;
  let i = 0;
  section.units.forEach((unit, u) => {
    unit.skills.forEach((skill, k) => {
      const info = infoOf(skill);
      let level = 0;
      if (u < finished) {
        // Every fifth skill legendary, every third mastered, the rest just finished.
        if (i % 5 === 0) level = info.levels.length;
        else if (i % 3 === 0) level = info.mastery ?? info.pathLevels;
        else level = info.pathLevels;
      } else if (u === finished) level = k === 0 ? info.pathLevels : k === 1 ? 1 : 0;
      if (level > 0) {
        const day = addDays(today, -Math.floor(i / 2) % 14);
        skills[skill] = { level, lessons: level, last: day };
        lessons += level;
      }
      i++;
    });
  });
  progress.skills = skills;
  progress.xp = lessons * LESSON_XP;
  // Two lessons a day for the last two weeks, and one so far today.
  for (let d = 1; d <= 14; d++) progress.days[addDays(today, -d)] = 2;
  progress.days[today] = 1;
  return progress;
}
