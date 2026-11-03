// A pupil's progress, kept only in this browser: their settings, each skill's level and place in
// the review schedule, XP, the lessons done each day (for the daily goal and streak), streak
// freezes, the misconceptions they have shown, the reviews and badges they have done and earned,
// and their best speed round. It is one versioned object, changed only by pure functions;
// whatever is read back is checked, and anything unreadable starts afresh rather than breaking
// the app.
import { STAGES, type Stage } from "@mathsplanner/core";

export const PROGRESS_VERSION = 1;
export const STORAGE_KEY = "learnmaths.progress";
/** XP for finishing a lesson, and the bonus for getting every question right first time. */
export const LESSON_XP = 10;
export const PERFECT_XP = 5;

/** Forms of question remembered for each skill, so the next lessons can show others. */
export const RECENT_FORMS = 6;

/** The most streak freezes a pupil can hold. */
export const MAX_FREEZES = 2;

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
  /** Teacher mode: every skill and review open, and any level of a skill can be tried. */
  teacher: boolean;
}

export interface SkillProgress {
  /** Levels completed. */
  level: number;
  lessons: number;
  /** The day of the last lesson, as YYYY-MM-DD. */
  last: string;
  /** Its box in the review schedule (see memory.ts): 1 to 6, or 0 before the skill is finished. */
  box: number;
  /** The day its next review is due, as YYYY-MM-DD, or "" when it has no box yet. */
  due: string;
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
  /** Reviews done: a unit's id, or "year:" and the stage, and the day it was last done. */
  reviews: Record<string, string>;
  /** Streak freezes held (see rewards.ts), and the days they covered. */
  freezes: number;
  frozen: string[];
  /** Badges earned (see rewards.ts), and the day each was earned. */
  badges: Record<string, string>;
  /** The most questions right in a speed round. */
  speedBest: number;
  /** The forms of question each skill showed lately (see formOf in skills.ts), newest first. */
  recent: Record<string, string[]>;
  /** Set on the example progress, so the app can say it is an example. */
  example?: true;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 2,
  sound: true,
  challenge: false,
  theme: "system",
  teacher: false,
};

export const emptyProgress = (): Progress => ({
  version: PROGRESS_VERSION,
  settings: { ...DEFAULT_SETTINGS },
  skills: {},
  xp: 0,
  days: {},
  mistakes: {},
  reviews: {},
  freezes: 0,
  frozen: [],
  badges: {},
  speedBest: 0,
  recent: {},
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
  if (typeof s.teacher === "boolean") progress.settings.teacher = s.teacher;

  if (isRecord(raw.skills))
    for (const [id, value] of Object.entries(raw.skills)) {
      if (!isRecord(value)) continue;
      const day = (x: unknown) => (typeof x === "string" && DAY.test(x) ? x : "");
      progress.skills[id] = {
        level: count(value.level),
        lessons: count(value.lessons),
        last: day(value.last),
        box: Math.min(count(value.box), 6),
        due: day(value.due),
      };
    }
  progress.xp = count(raw.xp);
  if (isRecord(raw.days))
    for (const [day, n] of Object.entries(raw.days))
      if (DAY.test(day) && count(n)) progress.days[day] = count(n);
  if (isRecord(raw.mistakes))
    for (const [code, n] of Object.entries(raw.mistakes))
      if (count(n)) progress.mistakes[code] = count(n);
  if (isRecord(raw.reviews))
    for (const [id, day] of Object.entries(raw.reviews))
      if (typeof day === "string" && DAY.test(day)) progress.reviews[id] = day;
  progress.freezes = Math.min(count(raw.freezes), MAX_FREEZES);
  if (Array.isArray(raw.frozen))
    progress.frozen = raw.frozen.filter((d): d is string => typeof d === "string" && DAY.test(d));
  if (isRecord(raw.badges))
    for (const [id, day] of Object.entries(raw.badges))
      if (typeof day === "string" && DAY.test(day)) progress.badges[id] = day;
  progress.speedBest = count(raw.speedBest);
  if (isRecord(raw.recent))
    for (const [skill, forms] of Object.entries(raw.recent))
      if (Array.isArray(forms))
        progress.recent[skill] = forms
          .filter((f): f is string => typeof f === "string")
          .slice(0, RECENT_FORMS);
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
 * Days in a row the daily goal was met (or a streak freeze covered), up to today; today still
 * counts towards it until it ends, so the streak carries on from yesterday until then.
 */
export function streak(progress: Progress, today: string): number {
  const met = (day: string) =>
    lessonsOn(progress, day) >= progress.settings.dailyGoal || progress.frozen.includes(day);
  let day = met(today) ? today : addDays(today, -1);
  let n = 0;
  while (met(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export const withSettings = (progress: Progress, settings: Partial<Settings>): Progress => ({
  ...progress,
  settings: { ...progress.settings, ...settings },
});

/** The forms of question a lesson showed for each skill, remembered newest first. */
export function rememberForms(progress: Progress, shown: Record<string, string[]>): Progress {
  const recent = { ...progress.recent };
  for (const [skill, forms] of Object.entries(shown))
    recent[skill] = [...new Set([...[...forms].reverse(), ...(recent[skill] ?? [])])].slice(
      0,
      RECENT_FORMS,
    );
  return { ...progress, recent };
}
