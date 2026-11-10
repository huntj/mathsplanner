// Rewards for practising: badges for milestones, and streak freezes, which keep a streak going over
// a missed day. A freeze is earned every FREEZE_EVERY days of streak, up to MAX_FREEZES held, and
// spent without asking when the app is next opened after a missed day. All pure.
import { addDays, lessonsOn, MAX_FREEZES, streak, type Progress } from "./progress.ts";

const goalMetToday = (p: Progress, today: string) =>
  p.settings.dailyGoal >= 3 && lessonsOn(p, today) >= p.settings.dailyGoal;

/** Days of streak that earn a freeze. */
export const FREEZE_EVERY = 7;

/** What a lesson did, beyond what progress records, for badges that need it. */
export interface LessonEvent {
  perfect: boolean;
  /** Finished in challenge mode with hearts left. */
  challenge: boolean;
  /** Questions right in a speed round. */
  speed?: number;
  /** Mistakes put right. */
  fixed: number;
  /** A unit review or year review finished. */
  review?: "unit" | "year";
  /** What a skill lesson took the skill to, if it reached a milestone. */
  reached?: "finished" | "mastered" | "legendary";
}

export type BadgeShape = "circle" | "star" | "shield" | "hexagon";

export interface Badge {
  id: string;
  name: string;
  /** How to earn it, for the pupil. */
  how: string;
  shape: BadgeShape;
  earned: (p: Progress, today: string, event?: LessonEvent) => boolean;
}

/** The badges, in the order they are shown. A skill with a box is finished on the path. */
export const BADGES: readonly Badge[] = [
  {
    id: "first-lesson",
    name: "First steps",
    how: "Finish your first lesson.",
    shape: "circle",
    earned: (p) => Object.keys(p.days).length > 0,
  },
  {
    id: "first-skill",
    name: "Off the mark",
    how: "Finish your first skill.",
    shape: "circle",
    earned: (p) => Object.values(p.skills).some((s) => s.box > 0),
  },
  {
    id: "mastered",
    name: "Deep thinker",
    how: "Master a skill by reasoning with it.",
    shape: "hexagon",
    earned: (_p, _t, e) => e?.reached === "mastered" || e?.reached === "legendary",
  },
  {
    id: "perfect",
    name: "Spot on",
    how: "Get every question right first time in a lesson.",
    shape: "star",
    earned: (_p, _t, e) => e?.perfect === true,
  },
  {
    id: "unit",
    name: "Unit cleared",
    how: "Finish a unit review.",
    shape: "shield",
    earned: (_p, _t, e) => e?.review === "unit",
  },
  {
    id: "year",
    name: "Year complete",
    how: "Finish the review at the end of the year.",
    shape: "shield",
    earned: (_p, _t, e) => e?.review === "year",
  },
  {
    id: "mender",
    name: "Mistake mender",
    how: "Put right a mistake you used to make.",
    shape: "hexagon",
    earned: (_p, _t, e) => (e?.fixed ?? 0) > 0,
  },
  {
    id: "skills-10",
    name: "Ten skills",
    how: "Finish ten skills.",
    shape: "circle",
    earned: (p) => Object.values(p.skills).filter((s) => s.box > 0).length >= 10,
  },
  {
    id: "daily-double",
    name: "Daily double",
    how: "Meet a daily goal of three or more lessons.",
    shape: "circle",
    earned: (p, t) => goalMetToday(p, t),
  },
  {
    id: "streak-7",
    name: "Week streak",
    how: "Meet your daily goal seven days in a row.",
    shape: "star",
    earned: (p, t) => streak(p, t) >= 7,
  },
  {
    id: "streak-30",
    name: "Month streak",
    how: "Keep a streak going for 30 days.",
    shape: "star",
    earned: (p, t) => streak(p, t) >= 30,
  },
  {
    id: "streak-100",
    name: "Hundred days",
    how: "Keep a streak going for 100 days.",
    shape: "star",
    earned: (p, t) => streak(p, t) >= 100,
  },
  {
    id: "challenge",
    name: "Heart keeper",
    how: "Finish a lesson in challenge mode with a heart left.",
    shape: "hexagon",
    earned: (_p, _t, e) => e?.challenge === true,
  },
  {
    id: "speed",
    name: "Quick thinker",
    how: "Get ten right in one speed round.",
    shape: "hexagon",
    earned: (_p, _t, e) => (e?.speed ?? 0) >= 10,
  },
  {
    id: "xp-1000",
    name: "Thousand club",
    how: "Earn 1,000 XP.",
    shape: "shield",
    earned: (p) => p.xp >= 1000,
  },
  {
    id: "legendary",
    name: "Legend",
    how: "Reach Legendary on a skill.",
    shape: "star",
    earned: (_p, _t, e) => e?.reached === "legendary",
  },
];

/** Badges earned now that were not before, with progress recording them. */
export function awardBadges(
  progress: Progress,
  today: string,
  event?: LessonEvent,
): { progress: Progress; earned: Badge[] } {
  const earned = BADGES.filter(
    (b) => !(b.id in progress.badges) && b.earned(progress, today, event),
  );
  if (earned.length === 0) return { progress, earned };
  const badges = { ...progress.badges };
  for (const b of earned) badges[b.id] = today;
  return { progress: { ...progress, badges }, earned };
}

/** A freeze for each FREEZE_EVERY days of streak reached by a lesson, up to MAX_FREEZES held. */
export function earnFreeze(
  before: Progress,
  after: Progress,
  today: string,
): { progress: Progress; earned: boolean } {
  const was = streak(before, today);
  const now = streak(after, today);
  const crossed = Math.floor(now / FREEZE_EVERY) > Math.floor(was / FREEZE_EVERY);
  if (!crossed || after.freezes >= MAX_FREEZES) return { progress: after, earned: false };
  return { progress: { ...after, freezes: after.freezes + 1 }, earned: true };
}

/**
 * On opening the app: if days were missed since the goal was last met, and the pupil holds enough
 * freezes to cover them all, spend them so the streak carries on. Too many missed days, and the
 * streak is lost and the freezes kept.
 */
export function settleStreak(
  progress: Progress,
  today: string,
): { progress: Progress; used: number } {
  const met = (day: string) =>
    lessonsOn(progress, day) >= progress.settings.dailyGoal || progress.frozen.includes(day);
  const yesterday = addDays(today, -1);
  const missed: string[] = [];
  let day = yesterday;
  // Look back at most as many days as freezes could cover, plus one.
  while (!met(day) && missed.length <= progress.freezes) {
    missed.push(day);
    day = addDays(day, -1);
  }
  const lastMet = met(day) && Object.keys(progress.days).length > 0;
  if (missed.length === 0 || !lastMet || missed.length > progress.freezes)
    return { progress, used: 0 };
  return {
    progress: {
      ...progress,
      freezes: progress.freezes - missed.length,
      frozen: [...progress.frozen, ...missed].sort(),
    },
    used: missed.length,
  };
}
