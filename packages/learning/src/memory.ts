// The review schedule, a Leitner system: a finished skill sits in a box from 1 to 6, and comes back
// for review 1, 3, 7, 14, 30 or 60 days after it was last put right. Getting it right when it is due
// moves it up a box; getting it wrong at any time moves it down two (to box 1 at the lowest), so it
// comes back the next day.
import { addDays, type Progress, type SkillProgress } from "./progress.ts";

/** Days until the next review, for boxes 1 to 6. */
export const GAPS = [1, 3, 7, 14, 30, 60] as const;
export const TOP_BOX = GAPS.length;

export interface Memory {
  box: number;
  /** YYYY-MM-DD; "" for due now. */
  due: string;
}

const gap = (box: number) => GAPS[Math.min(Math.max(box, 1), TOP_BOX) - 1] ?? 1;

/**
 * Where a skill is in the schedule, or undefined until it is finished on the path. A skill finished
 * before the schedule existed starts in box 1, due the day after its last lesson.
 */
export function memoryOf(skill: SkillProgress | undefined, pathLevels: number): Memory | undefined {
  if (!skill || skill.level < pathLevels) return undefined;
  if (skill.box > 0) return { box: skill.box, due: skill.due };
  return { box: 1, due: skill.last ? addDays(skill.last, 1) : "" };
}

export const isDue = (memory: Memory | undefined, today: string): boolean =>
  memory !== undefined && memory.due <= today;

/** A skill just finished on the path: box 1, back tomorrow. */
export const firstMemory = (today: string): Memory => ({ box: 1, due: addDays(today, gap(1)) });

/** The schedule after a skill has been practised: `right` if every question on it was right first time. */
export function remember(memory: Memory, right: boolean, today: string): Memory {
  if (!right) {
    const box = Math.max(1, memory.box - 2);
    return { box, due: addDays(today, 1) };
  }
  if (!isDue(memory, today)) return memory;
  const box = Math.min(memory.box + 1, TOP_BOX);
  return { box, due: addDays(today, gap(box)) };
}

export type Strength = "due" | "fresh" | "strong" | "solid";

/** How well a skill is remembered, for the pupil: due, freshly learnt (boxes 1–2), strong (3–4), rock solid (5–6). */
export function strengthOf(memory: Memory, today: string): Strength {
  if (isDue(memory, today)) return "due";
  if (memory.box <= 2) return "fresh";
  return memory.box <= 4 ? "strong" : "solid";
}

/** Skills whose review is due, most overdue first. */
export function dueSkills(
  progress: Progress,
  skills: readonly string[],
  pathLevelsOf: (skill: string) => number,
  today: string,
): string[] {
  return skills
    .map((skill) => ({ skill, memory: memoryOf(progress.skills[skill], pathLevelsOf(skill)) }))
    .filter((x) => isDue(x.memory, today))
    .sort((a, b) => (a.memory?.due ?? "").localeCompare(b.memory?.due ?? ""))
    .map((x) => x.skill);
}
