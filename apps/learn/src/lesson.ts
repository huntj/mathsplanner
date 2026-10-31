// A lesson: about eight questions on one skill at the level being worked on, with two review
// questions from skills finished earlier mixed in. A brand-new skill opens on a worked example. A
// question answered wrongly comes back at the end with new numbers (at most twice), so the lesson
// ends with every question put right or tried three times. Everything here is pure, so a lesson
// can be planned and played through in tests.
import type { Depth, Numbers } from "@mathsplanner/core";
import type { SkillLevels } from "./course.ts";
import { LESSON_XP, PERFECT_XP } from "./progress.ts";

/** Questions on the skill itself, and from earlier skills. */
export const SKILL_QUESTIONS = 6;
export const REVIEW_QUESTIONS = 2;
/** How many times a question answered wrongly comes back. */
export const RETRIES = 2;

export interface LessonItem {
  skill: string;
  depth: Depth;
  numbers: Numbers;
  seed: number;
  /** From an earlier skill, for review. */
  review: boolean;
  /** Which question of the plan this is, so a retry counts as the same one. */
  slot: number;
  /** 0 the first time, then 1 and 2 for retries. */
  attempt: number;
}

export interface LessonPlan {
  skill: string;
  /** The level being worked on, counting from 1. */
  level: number;
  items: LessonItem[];
  /** A worked example first, for a skill not started yet. */
  example?: LessonItem;
}

/** A seed for each question, spread out so that neighbouring questions differ. */
const seedFor = (seed: number, n: number) => (seed + n * 7919) % 2_147_483_647;

/**
 * Plans the next lesson on a skill: its next level (or the top one again once all are done), with
 * questions easiest first and review questions third and sixth.
 */
export function planLesson(
  skill: string,
  info: SkillLevels,
  levelDone: number,
  reviewFrom: readonly { skill: string; info: SkillLevels }[],
  seed: number,
): LessonPlan {
  const level = Math.min(levelDone + 1, info.levels.length);
  const spec = info.levels[level - 1] ?? info.levels[0];
  if (!spec) throw new Error(`${skill} has no levels`);

  const reviews = pickReviews(reviewFrom, seed);
  const own = SKILL_QUESTIONS + REVIEW_QUESTIONS - reviews.length;
  const depths = Array.from(
    { length: own },
    (_, i) => spec.depths[i % spec.depths.length] ?? 1,
  ).sort((a, b) => a - b);
  const items: LessonItem[] = depths.map((depth, i) => ({
    skill,
    depth,
    numbers: spec.numbers,
    seed: seedFor(seed, i + 1),
    review: false,
    slot: 0,
    attempt: 0,
  }));
  reviews.forEach((r, i) => {
    // A review question uses the deepest level that moves a pupil along the path.
    const top = r.info.levels[r.info.pathLevels - 1] ?? r.info.levels[0];
    const item: LessonItem = {
      skill: r.skill,
      depth: top?.depths.at(-1) ?? 1,
      numbers: "standard",
      seed: seedFor(seed, 100 + i),
      review: true,
      slot: 0,
      attempt: 0,
    };
    items.splice(Math.min(2 + i * 3, items.length), 0, item);
  });
  items.forEach((item, i) => (item.slot = i));

  const first = info.levels[0];
  return levelDone === 0 && first
    ? {
        skill,
        level,
        items,
        example: {
          skill,
          depth: first.depths[0] ?? 1,
          numbers: first.numbers,
          seed: seedFor(seed, 999),
          review: false,
          slot: -1,
          attempt: 0,
        },
      }
    : { skill, level, items };
}

/** Up to REVIEW_QUESTIONS different skills, picked by the seed. */
function pickReviews<T>(from: readonly T[], seed: number): T[] {
  const pool = [...from];
  const picked: T[] = [];
  let n = seed;
  while (picked.length < REVIEW_QUESTIONS && pool.length > 0) {
    n = (n * 1_103_515_245 + 12_345) % 2_147_483_648;
    picked.push(...pool.splice(n % pool.length, 1));
  }
  return picked;
}

export interface Answered {
  item: LessonItem;
  correct: boolean;
  /** The misconception the wrong answer matched. */
  misconception?: string;
}

/** A lesson being played: the questions still to come and what has been answered. */
export interface LessonState {
  plan: LessonPlan;
  queue: LessonItem[];
  answered: Answered[];
}

export const startLesson = (plan: LessonPlan): LessonState => ({
  plan,
  queue: [...plan.items],
  answered: [],
});

/** Records the answer to the question at the front; a wrong one comes back at the end, if it can. */
export function answer(state: LessonState, correct: boolean, misconception?: string): LessonState {
  const [item, ...rest] = state.queue;
  if (!item) return state;
  const queue =
    !correct && item.attempt < RETRIES
      ? [
          ...rest,
          { ...item, attempt: item.attempt + 1, seed: seedFor(item.seed, 31 + item.attempt) },
        ]
      : rest;
  const answered: Answered = misconception ? { item, correct, misconception } : { item, correct };
  return { ...state, queue, answered: [...state.answered, answered] };
}

/** Drops the question at the front, when no question can be made for it. */
export function drop(state: LessonState): LessonState {
  const [item, ...queue] = state.queue;
  if (!item) return state;
  const items = state.plan.items.filter((i) => i.slot !== item.slot);
  return { ...state, plan: { ...state.plan, items }, queue };
}

export const finished = (state: LessonState) => state.queue.length === 0;

/** How far through the lesson: questions put right or out of tries, out of those planned. */
export function lessonProgress(state: LessonState): number {
  const total = state.plan.items.length;
  const pending = new Set(state.queue.map((i) => i.slot));
  return total === 0 ? 1 : (total - pending.size) / total;
}

export interface LessonSummary {
  /** Questions right first time, out of those planned. */
  firstTime: number;
  total: number;
  perfect: boolean;
  xp: number;
  mistakes: string[];
}

export function summarise(state: LessonState): LessonSummary {
  const total = state.plan.items.length;
  const firstTime = state.answered.filter((a) => a.correct && a.item.attempt === 0).length;
  const perfect = firstTime === total;
  return {
    firstTime,
    total,
    perfect,
    xp: LESSON_XP + (perfect ? PERFECT_XP : 0),
    mistakes: state.answered.flatMap((a) => (a.misconception ? [a.misconception] : [])),
  };
}

/** What a lesson did for the skill, from its level before (`before`) and after. */
export function levelMessage(info: SkillLevels, before: number, after: number): string {
  const level = info.levels[after - 1];
  if (after <= before || !level)
    return "Extra practice done. Every level of this skill is finished.";
  if (level.name === "Legendary" && after === info.levels.length)
    return "Legendary! You have done every level of this skill.";
  if (info.mastery === after) return "Mastered! You can reason with this skill, not just do it.";
  if (after === info.pathLevels) return "Skill finished. The next skill on the path is open.";
  const left = info.pathLevels - after;
  return after < info.pathLevels
    ? `You reached ${level.name}. ${left} more ${left === 1 ? "lesson" : "lessons"} to finish this skill.`
    : `You reached ${level.name}.`;
}
