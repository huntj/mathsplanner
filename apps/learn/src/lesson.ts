// A lesson. A skill lesson is about eight questions on one skill at the level being worked on, with
// two review questions from skills finished earlier mixed in; a brand-new skill opens on a worked
// example. A mixed lesson (a review of what is due, a unit or year review, or fixing mistakes) takes
// its questions in turn from several skills. A question answered wrongly comes back at the end with
// new numbers (at most twice), so the lesson ends with every question put right or tried three
// times. In challenge mode a lesson has HEARTS hearts, and each wrong answer costs one. A speed
// round asks quick questions until the time runs out, each once. Everything here is pure, so a
// lesson can be planned and played through in tests.
import type { Depth, Numbers } from "@mathsplanner/core";
import { skillText, type SkillLevels } from "./course.ts";
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
  /** A misconception the pupil has shown, which this question should offer as a wrong answer. */
  target?: string;
}

export type LessonKind = "skill" | "review" | "unit" | "year" | "mistakes" | "speed";

/** Hearts at the start of a lesson in challenge mode. */
export const HEARTS = 3;
/** A speed round's length in seconds, and the most questions it can ask. */
export const SPEED_SECONDS = 90;
export const SPEED_QUESTIONS = 60;
/** Right answers a speed round needs to count towards the daily goal. */
export const SPEED_COUNTS = 5;

export interface LessonPlan {
  kind: LessonKind;
  /** What the lesson is on, for the pupil: the skill, or the review's name. */
  title: string;
  /** For a skill lesson: the skill and the level being worked on, counting from 1. */
  skill?: string;
  level?: number;
  /** Set when a teacher picked the level, rather than it being the skill's next one. */
  picked?: true;
  /** For a unit or year review: what it records as done, as in Progress.reviews. */
  reviewId?: string;
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
  const base = { kind: "skill" as const, title: skillText(skill), skill, level, items };
  return levelDone === 0 && first
    ? {
        ...base,
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
    : base;
}

/**
 * A speed round on finished skills: their first level's questions with standard numbers, taken in
 * turn, more than anyone could answer in the time.
 */
export function planSpeed(sources: readonly Source[], seed: number): LessonPlan {
  const order = shuffle(sources, seed);
  const items: LessonItem[] = [];
  for (let i = 0; i < SPEED_QUESTIONS && order.length > 0; i++) {
    const source = order[i % order.length];
    if (!source) break;
    items.push({
      skill: source.skill,
      depth: source.info.levels[0]?.depths[0] ?? 1,
      numbers: "standard",
      seed: seedFor(seed, i + 1),
      review: false,
      slot: i,
      attempt: 0,
    });
  }
  return { kind: "speed", title: "Speed round", items };
}

/** A skill to draw questions from in a mixed lesson, and a misconception to aim at, if any. */
export interface Source {
  skill: string;
  info: SkillLevels;
  target?: string;
}

/**
 * Plans a mixed lesson of `count` questions, taking the sources in turn (in an order set by the
 * seed). Each skill's first question is at the deepest level that moves a pupil along the path,
 * and later ones step down through its earlier levels.
 */
export function planMixed(
  kind: Exclude<LessonKind, "skill">,
  title: string,
  sources: readonly Source[],
  count: number,
  seed: number,
  reviewId?: string,
): LessonPlan {
  const order = shuffle(sources, seed);
  const items: LessonItem[] = [];
  for (let i = 0; i < count && order.length > 0; i++) {
    const source = order[i % order.length];
    if (!source) break;
    const depths = [
      ...new Set(source.info.levels.slice(0, source.info.pathLevels).flatMap((l) => l.depths)),
    ].sort((a, b) => b - a);
    const turn = Math.floor(i / order.length);
    items.push({
      skill: source.skill,
      depth: depths[turn % depths.length] ?? 1,
      numbers: "standard",
      seed: seedFor(seed, i + 1),
      review: kind !== "mistakes",
      slot: i,
      attempt: 0,
      ...(source.target ? { target: source.target } : {}),
    });
  }
  return { kind, title, items, ...(reviewId ? { reviewId } : {}) };
}

/** The items in an order set by the seed. */
function shuffle<T>(from: readonly T[], seed: number): T[] {
  const pool = [...from];
  const out: T[] = [];
  let n = seed;
  while (pool.length > 0) {
    n = (n * 1_103_515_245 + 12_345) % 2_147_483_648;
    out.push(...pool.splice(n % pool.length, 1));
  }
  return out;
}

/** Up to REVIEW_QUESTIONS different skills, picked by the seed. */
const pickReviews = <T>(from: readonly T[], seed: number): T[] =>
  shuffle(from, seed).slice(0, REVIEW_QUESTIONS);

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
    !correct && item.attempt < RETRIES && state.plan.kind !== "speed"
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

/** The time is up in a speed round: no more questions. */
export const timeUp = (state: LessonState): LessonState => ({ ...state, queue: [] });

export const finished = (state: LessonState) => state.queue.length === 0;

/** Hearts left in challenge mode: one lost for each wrong answer. */
export const heartsLeft = (state: LessonState) =>
  Math.max(0, HEARTS - state.answered.filter((a) => !a.correct).length);

/** How far through the lesson: questions put right or out of tries, out of those planned. */
export function lessonProgress(state: LessonState): number {
  const total = state.plan.items.length;
  const pending = new Set(state.queue.map((i) => i.slot));
  return total === 0 ? 1 : (total - pending.size) / total;
}

export interface LessonSummary {
  /** Questions right first time, out of those planned (or answered, in a speed round). */
  firstTime: number;
  total: number;
  perfect: boolean;
  xp: number;
  mistakes: string[];
  /** Each skill asked about, and whether every question on it was right first time. */
  skills: Record<string, boolean>;
  /** Misconceptions aimed at whose questions were answered right first time. */
  fixed: string[];
  /** In challenge mode, the hearts left at the end. */
  hearts?: number;
}

/**
 * What a finished lesson came to. XP is LESSON_XP, plus PERFECT_XP for a perfect lesson, doubled
 * for finishing in challenge mode with a heart left; a speed round gives one XP for each right
 * answer, and is never "perfect", as it has no end but the clock.
 */
export function summarise(state: LessonState, challenge = false): LessonSummary {
  const speed = state.plan.kind === "speed";
  const total = speed ? state.answered.length : state.plan.items.length;
  const firstTime = state.answered.filter((a) => a.correct && a.item.attempt === 0).length;
  const perfect = !speed && firstTime === total;
  const hearts = challenge && !speed ? heartsLeft(state) : undefined;
  const base = speed ? firstTime : LESSON_XP + (perfect ? PERFECT_XP : 0);
  const firstTries = state.answered.filter((a) => a.item.attempt === 0);
  const skills: Record<string, boolean> = {};
  for (const a of firstTries) skills[a.item.skill] = (skills[a.item.skill] ?? true) && a.correct;
  return {
    firstTime,
    total,
    perfect,
    xp: hearts ? base * 2 : base,
    mistakes: state.answered.flatMap((a) => (a.misconception ? [a.misconception] : [])),
    skills,
    fixed: firstTries.flatMap((a) => (a.correct && a.item.target ? [a.item.target] : [])),
    ...(hearts === undefined ? {} : { hearts }),
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
