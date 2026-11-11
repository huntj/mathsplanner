// The path as a pupil sees it today: levels, skills due for review and reviews done.
import type { CourseSection } from "@mathsplanner/core";
import { buildPath } from "@mathsplanner/learning";
import { isDue, memoryOf } from "@mathsplanner/learning";
import { levelOf, type Progress } from "@mathsplanner/learning";
import { levelsOf } from "@mathsplanner/learning";

/** The path for a pupil's progress today. */
export const pathFor = (section: CourseSection, progress: Progress, today: string) =>
  buildPath(section, (s) => levelOf(progress, s), levelsOf, {
    dueOf: (s) => isDue(memoryOf(progress.skills[s], levelsOf(s).pathLevels), today),
    reviewed: (id) => id in progress.reviews,
    open: progress.settings.teacher,
  });
