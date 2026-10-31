// A pupil's progress, kept only in this browser: their settings, each skill's level, XP, the
// lessons done each day (for the daily goal and streak) and the misconceptions they have shown. It is one versioned object, changed only by
// the pure functions here; whatever is read back is checked, and anything unreadable starts afresh
// rather than breaking the app.
import { STAGES, type Stage } from "@mathsplanner/core";

export const PROGRESS_VERSION = 1;
export const STORAGE_KEY = "learnmaths.progress";
/** XP for finishing a lesson, and the bonus for getting every question right first time. */
export const LESSON_XP = 10;
export const PERFECT_XP = 5;

export const DAILY_GOALS = [1, 2, 3, 5] as const;
export type DailyGoal = (typeof DAILY_GOALS)[number];
export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export interface Settings {
  /** The pupil's year; unset until the first visit is done. */
  stage?: Stage;
  /** Lessons a day. */
  dailyGoal: DailyGoal;
  sound: boolean;
  /** Hearts in lessons, for pupils who want a challenge. */
  challenge: boolean;
  theme: Theme;
}

export interface SkillProgress {
  /** Levels completed. */
  level: number;
  lessons: number;
  /** The day of the last lesson, as YYYY-MM-DD. */
  last: string;
}

export interface Progress {
  version: typeof PROGRESS_VERSION;
  settings: Settings;
  skills: Record<string, SkillProgress>;
  xp: number;
  /** Lessons finished each day, by YYYY-MM-DD. */
  days: Record<string, number>;
  /** Misconception codes the pupil's wrong answers matched, and how often. */
  mistakes: Record<string, number>;
  /** Set on the example progress, so the app can say it is an example. */
  example?: true;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 2,
  sound: true,
  challenge: false,
  theme: "system",
};

export const emptyProgress = (): Progress => ({
  version: PROGRESS_VERSION,
  settings: { ...DEFAULT_SETTINGS },
  skills: {},
  xp: 0,
  days: {},
  mistakes: {},
});

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const count = (x: unknown) => (Number.isInteger(x) && (x as number) >= 0 ? (x as number) : 0);

/** Reads stored progress, keeping only what is valid. */
export function readProgress(raw: unknown): Progress {
  const progress = emptyProgress();
  if (!isRecord(raw) || raw.version !== PROGRESS_VERSION) return progress;

  const s = isRecord(raw.settings) ? raw.settings : {};
  if (STAGES.includes(s.stage as Stage)) progress.settings.stage = s.stage as Stage;
  if (DAILY_GOALS.includes(s.dailyGoal as DailyGoal))
    progress.settings.dailyGoal = s.dailyGoal as DailyGoal;
  if (typeof s.sound === "boolean") progress.settings.sound = s.sound;
  if (typeof s.challenge === "boolean") progress.settings.challenge = s.challenge;
  if (THEMES.includes(s.theme as Theme)) progress.settings.theme = s.theme as Theme;

  if (isRecord(raw.skills))
    for (const [id, value] of Object.entries(raw.skills)) {
      if (!isRecord(value)) continue;
      const last = typeof value.last === "string" && DAY.test(value.last) ? value.last : "";
      progress.skills[id] = { level: count(value.level), lessons: count(value.lessons), last };
    }
  progress.xp = count(raw.xp);
  if (isRecord(raw.days))
    for (const [day, n] of Object.entries(raw.days))
      if (DAY.test(day) && count(n)) progress.days[day] = count(n);
  if (isRecord(raw.mistakes))
    for (const [code, n] of Object.entries(raw.mistakes))
      if (count(n)) progress.mistakes[code] = count(n);
  if (raw.example === true) progress.example = true;
  return progress;
}

/** The saved progress, or a fresh start when there is none or storage is unavailable. */
export function loadProgress(
  storage: Pick<Storage, "getItem"> | undefined = safeStorage(),
): Progress {
  try {
    const text = storage?.getItem(STORAGE_KEY);
    return text ? readProgress(JSON.parse(text)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

/** Saves progress; false when the browser will not store it (a private window, for example). */
export function saveProgress(
  progress: Progress,
  storage: Pick<Storage, "setItem"> | undefined = safeStorage(),
): boolean {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(progress));
    return storage !== undefined;
  } catch {
    return false;
  }
}

function safeStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** A day as YYYY-MM-DD in local time. */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The day `n` days after `day` (before it, for negative `n`). */
export function addDays(day: string, n: number): string {
  const [y = 0, m = 1, d = 1] = day.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

export const levelOf = (progress: Progress, skill: string) => progress.skills[skill]?.level ?? 0;

export const lessonsOn = (progress: Progress, day: string) => progress.days[day] ?? 0;

/**
 * Days in a row the daily goal was met, up to today; today still counts towards it until it ends,
 * so the streak carries on from yesterday until then.
 */
export function streak(progress: Progress, today: string): number {
  const met = (day: string) => lessonsOn(progress, day) >= progress.settings.dailyGoal;
  let day = met(today) ? today : addDays(today, -1);
  let n = 0;
  while (met(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

/** What a finished lesson changes. */
export interface LessonOutcome {
  skill: string;
  /** The skill's number of levels, the most it can reach. */
  levels: number;
  xp: number;
  /** Misconception codes of the wrong answers. */
  mistakes: readonly string[];
}

/** A lesson finished: the skill up a level, XP, today's count and the mistakes made. */
export function completeLesson(
  progress: Progress,
  outcome: LessonOutcome,
  today: string,
): Progress {
  const { skill, levels } = outcome;
  const was = progress.skills[skill] ?? { level: 0, lessons: 0, last: today };
  const mistakes = { ...progress.mistakes };
  for (const code of outcome.mistakes) mistakes[code] = (mistakes[code] ?? 0) + 1;
  return {
    ...progress,
    skills: {
      ...progress.skills,
      [skill]: { level: Math.min(was.level + 1, levels), lessons: was.lessons + 1, last: today },
    },
    xp: progress.xp + outcome.xp,
    days: { ...progress.days, [today]: lessonsOn(progress, today) + 1 },
    mistakes,
  };
}

export const withSettings = (progress: Progress, settings: Partial<Settings>): Progress => ({
  ...progress,
  settings: { ...progress.settings, ...settings },
});
