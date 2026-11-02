// Practice: building mixed lessons from a pupil's progress (a review of what is due, a unit or year
// review, fixing mistakes), and recording any finished lesson back into progress: levels, the
// review schedule, mistakes shown and put right, reviews done, XP and today's count. All pure.
import type { CourseSection, CourseUnit } from "@mathsplanner/core";
import type { SkillLevels } from "./course.ts";
import {
  levelMessage,
  planMixed,
  planSpeed,
  SPEED_COUNTS,
  type LessonPlan,
  type LessonSummary,
} from "./lesson.ts";
import { dueSkills, firstMemory, isDue, memoryOf, remember } from "./memory.ts";
import { lessonsOn, levelOf, type Progress, type SkillProgress } from "./progress.ts";
import { awardBadges, earnFreeze, type Badge, type LessonEvent } from "./rewards.ts";

type InfoOf = (skill: string) => SkillLevels;

/** Questions in a review of what is due and in a unit review, and in a year review. */
export const REVIEW_LENGTH = 8;
export const YEAR_LENGTH = 12;
/** Most skills in one review of what is due, and most mistakes worked on in one lesson. */
export const REVIEW_SKILLS = 4;
export const MISTAKES_AT_ONCE = 4;
/** Bonus XP the first time a unit review, or the year review, is done. */
export const UNIT_BONUS = 10;
export const YEAR_BONUS = 25;

export const yearReviewId = (section: CourseSection) => `year:${section.stage}`;

const sectionSkills = (section: CourseSection) => section.units.flatMap((u) => u.skills);

/** The skills in a year finished on the path. */
export const finishedSkills = (progress: Progress, section: CourseSection, infoOf: InfoOf) =>
  sectionSkills(section).filter((s) => levelOf(progress, s) >= infoOf(s).pathLevels);

/** The skills in a year whose review is due, most overdue first. */
export const dueIn = (progress: Progress, section: CourseSection, infoOf: InfoOf, today: string) =>
  dueSkills(progress, sectionSkills(section), (s) => infoOf(s).pathLevels, today);

/**
 * A review of the skills that are due; when none is, extra practice on the finished skills
 * practised longest ago. Undefined until a skill is finished.
 */
export function reviewPlan(
  progress: Progress,
  section: CourseSection,
  infoOf: InfoOf,
  today: string,
  seed: number,
): LessonPlan | undefined {
  const due = dueIn(progress, section, infoOf, today).slice(0, REVIEW_SKILLS);
  const skills = due.length
    ? due
    : finishedSkills(progress, section, infoOf)
        .sort((a, b) =>
          (progress.skills[a]?.last ?? "").localeCompare(progress.skills[b]?.last ?? ""),
        )
        .slice(0, REVIEW_SKILLS);
  if (skills.length === 0) return undefined;
  const title = due.length ? "Review what’s due" : "Extra practice";
  const sources = skills.map((skill) => ({ skill, info: infoOf(skill) }));
  return planMixed("review", title, sources, REVIEW_LENGTH, seed);
}

/** Questions in a refresh of one skill. */
export const REFRESH_LENGTH = 6;

/** A refresh of one finished skill, from its sheet on the path. */
/** A speed round on the finished skills of the year, or undefined before any is finished. */
export function speedPlan(
  progress: Progress,
  section: CourseSection,
  infoOf: InfoOf,
  seed: number,
) {
  const skills = finishedSkills(progress, section, infoOf);
  return skills.length
    ? planSpeed(
        skills.map((skill) => ({ skill, info: infoOf(skill) })),
        seed,
      )
    : undefined;
}

export const refreshPlan = (skill: string, title: string, infoOf: InfoOf, seed: number) =>
  planMixed("review", `Refresh: ${title}`, [{ skill, info: infoOf(skill) }], REFRESH_LENGTH, seed);

/** A unit review: questions from every skill in the unit. */
export const unitPlan = (unit: CourseUnit, infoOf: InfoOf, seed: number): LessonPlan =>
  planMixed(
    "unit",
    `${unit.name}: unit review`,
    unit.skills.map((skill) => ({ skill, info: infoOf(skill) })),
    REVIEW_LENGTH,
    seed,
    unit.id,
  );

/** A year review: questions from across the finished skills of the year. */
export function yearPlan(
  progress: Progress,
  section: CourseSection,
  infoOf: InfoOf,
  seed: number,
): LessonPlan | undefined {
  const skills = finishedSkills(progress, section, infoOf);
  if (skills.length === 0) return undefined;
  const sources = skills.map((skill) => ({ skill, info: infoOf(skill) }));
  return planMixed(
    "year",
    `${section.name} review`,
    sources,
    YEAR_LENGTH,
    seed,
    yearReviewId(section),
  );
}

export interface MistakeToFix {
  code: string;
  /** Times the pupil's answers have matched it, less the times they have put it right. */
  count: number;
  /** Started skills whose questions can offer it as a wrong answer. */
  skills: string[];
}

/**
 * The misconceptions to work on, most often shown first, each with the skills (ones the pupil has
 * started) whose questions can offer it. `showing` finds those skills among a list.
 */
export function mistakesToFix(
  progress: Progress,
  section: CourseSection,
  showing: (code: string, among: readonly string[]) => string[],
): MistakeToFix[] {
  const started = sectionSkills(section).filter((s) => levelOf(progress, s) > 0);
  return Object.entries(progress.mistakes)
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
    .map(([code, count]) => ({ code, count, skills: showing(code, started) }))
    .filter((m) => m.skills.length > 0);
}

/** A lesson aimed at the pupil's own mistakes: two questions on each of the commonest. */
export function mistakesPlan(
  mistakes: readonly MistakeToFix[],
  infoOf: InfoOf,
  seed: number,
): LessonPlan | undefined {
  const chosen = mistakes.slice(0, MISTAKES_AT_ONCE);
  if (chosen.length === 0) return undefined;
  const sources = chosen.map((m) => {
    const skill = m.skills[seed % m.skills.length] ?? m.skills[0] ?? "";
    return { skill, info: infoOf(skill), target: m.code };
  });
  return planMixed("mistakes", "Fix my mistakes", sources, sources.length * 2, seed);
}

const fresh = (today: string): SkillProgress => ({
  level: 0,
  lessons: 0,
  last: today,
  box: 0,
  due: "",
});
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** A lesson recorded in progress, with what to celebrate on the end screen. */
export interface Finished {
  progress: Progress;
  /** What the lesson did, in a line or two. */
  message: string;
  /** Badges earned by it. */
  badges: Badge[];
  /** Whether it earned a streak freeze. */
  freeze: boolean;
}

/** A finished lesson recorded in progress, with what it did for the end screen. */
export function finishLesson(
  progress: Progress,
  plan: LessonPlan,
  summary: LessonSummary,
  infoOf: InfoOf,
  today: string,
): Finished {
  const skills = { ...progress.skills };
  const messages: string[] = [];
  let justFinished: string | undefined;
  let reached: LessonEvent["reached"];

  if (plan.kind === "skill" && plan.skill) {
    const skill = plan.skill;
    const info = infoOf(skill);
    const was = skills[skill] ?? fresh(today);
    const level = Math.min(was.level + 1, info.levels.length);
    const now = { ...was, level, lessons: was.lessons + 1, last: today };
    if (was.level < info.pathLevels && level >= info.pathLevels) {
      Object.assign(now, firstMemory(today));
      justFinished = skill;
      reached = "finished";
    }
    if (level > was.level && level === info.mastery) reached = "mastered";
    if (
      level > was.level &&
      level === info.levels.length &&
      info.levels.at(-1)?.name === "Legendary"
    )
      reached = "legendary";
    skills[skill] = now;
    messages.push(levelMessage(info, was.level, level));
  }

  // Every skill asked about moves through the schedule, except one finished in this lesson.
  let stronger = 0;
  let again = 0;
  for (const [skill, right] of Object.entries(summary.skills)) {
    // A speed round is against the clock, which is no fair test of memory.
    if (skill === justFinished || plan.kind === "speed") continue;
    const now = skills[skill];
    const memory = memoryOf(now, infoOf(skill).pathLevels);
    if (!now || !memory) continue;
    const next = remember(memory, right, today);
    if (right && isDue(memory, today)) stronger++;
    if (!right) again++;
    skills[skill] = { ...now, ...next, last: today };
  }

  // Mistakes made count up; mistakes put right count down, and go at zero.
  const counts = { ...progress.mistakes };
  for (const code of summary.mistakes) counts[code] = (counts[code] ?? 0) + 1;
  for (const code of summary.fixed) counts[code] = (counts[code] ?? 0) - 1;
  const mistakes = Object.fromEntries(Object.entries(counts).filter(([, n]) => n > 0));

  let bonus = 0;
  const reviews = { ...progress.reviews };
  if (plan.reviewId) {
    if (!reviews[plan.reviewId]) bonus = plan.kind === "year" ? YEAR_BONUS : UNIT_BONUS;
    reviews[plan.reviewId] = today;
    const done = plan.kind === "year" ? "Year review done!" : "Unit review done!";
    messages.push(bonus ? `${done} +${bonus} bonus XP.` : done);
  }
  if (plan.kind === "mistakes") {
    const fixed = summary.fixed.length;
    messages.push(
      fixed
        ? `You put right ${plural(fixed, "mistake", "mistakes")} you used to make.`
        : "Those mistakes will come back until you have put them right.",
    );
  }
  let speedBest = progress.speedBest;
  if (plan.kind === "speed") {
    const right = summary.firstTime;
    messages.push(
      right > speedBest && speedBest > 0
        ? `${plural(right, "right answer", "right answers")}: a new best!`
        : `${plural(right, "right answer", "right answers")}.${speedBest > right ? ` Your best is ${speedBest}.` : ""}`,
    );
    speedBest = Math.max(speedBest, right);
  }
  if (summary.hearts) messages.push("You kept a heart, so the XP is doubled.");
  if (plan.kind !== "skill" && plan.kind !== "speed") {
    if (stronger)
      messages.push(`${plural(stronger, "skill is", "skills are")} stronger in your memory.`);
    if (again)
      messages.push(`${plural(again, "skill", "skills")} will come back tomorrow for another go.`);
  }

  const recorded: Progress = {
    ...progress,
    skills,
    mistakes,
    reviews,
    speedBest,
    xp: progress.xp + summary.xp + bonus,
    // A speed round counts towards the daily goal only with a few right answers.
    days:
      plan.kind === "speed" && summary.firstTime < SPEED_COUNTS
        ? progress.days
        : { ...progress.days, [today]: lessonsOn(progress, today) + 1 },
  };
  const freeze = earnFreeze(progress, recorded, today);
  const event: LessonEvent = {
    perfect: summary.perfect,
    challenge: (summary.hearts ?? 0) > 0,
    fixed: summary.fixed.length,
    ...(plan.kind === "speed" ? { speed: summary.firstTime } : {}),
    ...(plan.kind === "unit" || plan.kind === "year" ? { review: plan.kind } : {}),
    ...(reached ? { reached } : {}),
  };
  const awarded = awardBadges(freeze.progress, today, event);
  return {
    progress: awarded.progress,
    message: messages.join(" ") || "Practice done.",
    badges: awarded.earned,
    freeze: freeze.earned,
  };
}
