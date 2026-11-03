// The path as a pupil sees it today: levels, skills due for review and reviews done.
import type { CourseSection } from "@mathsplanner/core";
import { buildPath } from "./course.ts";
import { isDue, memoryOf } from "./memory.ts";
import { levelOf, type Progress } from "./progress.ts";
import { levelsOf } from "./skills.ts";

/** The path for a pupil's progress today. */
export const pathFor = (section: CourseSection, progress: Progress, today: string) =>
  buildPath(section, (s) => levelOf(progress, s), levelsOf, {
    dueOf: (s) => isDue(memoryOf(progress.skills[s], levelsOf(s).pathLevels), today),
    reviewed: (id) => id in progress.reviews,
    open: progress.settings.teacher,
  });
