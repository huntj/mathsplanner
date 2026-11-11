// A made-up pupil played through part of the course, for the economy's tests: every lesson is done
// with the real learning functions (so levels, the review schedule and tuning are the real ones)
// and paid for by the real city functions. The pupil answers everything right; what differs
// between pupils is how many lessons they do a day, and whether they keep their machines tuned.
import type { CourseUnit, Stage } from "@mathsplanner/core";
import {
  addDays,
  answer,
  dueIn,
  emptyProgress,
  finished,
  finishLesson,
  finishUnitLesson,
  levelOf,
  levelsOf,
  planLesson,
  reviewPlan,
  sectionFor,
  startLesson,
  summarise,
  unitPlan,
  type LessonPlan,
  type Progress,
} from "@mathsplanner/learning";
import { lessonId, lessonsFor, lessonTeaches } from "@mathsplanner/learning/unit-lessons";
import { lessonFinished, newCity, placeMachine, settle, type City } from "./city.ts";
import { LESSON_POWER, lessonWorth, materialOf, sumOf, type Material } from "./economy.ts";
import { ratesOf } from "./works.ts";

export interface Pupil {
  /** Lessons done each day. */
  perDay: number;
  /** Whether the day starts with a tune-up when a machine is due. */
  tunes: boolean;
  /** How far each skill is taken once its zone is finished. */
  aim: "finished" | "mastered" | "legendary";
}

export const SLOW: Pupil = { perDay: 1, tunes: false, aim: "finished" };
export const TYPICAL: Pupil = { perDay: 3, tunes: true, aim: "mastered" };
export const KEEN: Pupil = { perDay: 8, tunes: true, aim: "legendary" };

/** One lesson of the run. */
export interface Step {
  what: string;
  /** Machines built, and what the city makes each minute, after the lesson. */
  machines: number;
  rate: number;
  /** What the lesson was worth: its crate, and its power once it has run down. */
  worth: number;
}

export interface Run {
  steps: Step[];
  city: City;
  progress: Progress;
  /** When the run ended, in ms. */
  now: number;
  today: string;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
/** A lesson takes about this long, so the power from one is still running at the next. */
const LESSON_MINUTES = 6;

/** Plays a lesson through with every answer right. */
function play(progress: Progress, plan: LessonPlan, today: string): Progress {
  let state = startLesson(plan);
  while (!finished(state)) state = answer(state, true);
  return finishLesson(progress, plan, summarise(state), levelsOf, today).progress;
}

/** Plays a pupil through some units of a year, in course order. */
export function simulate(stage: Stage, pupil: Pupil, units?: readonly string[]): Run {
  const section = sectionFor(stage);
  if (!section) throw new Error(`No course for ${stage}`);
  const zones = section.units.filter((u) => !units || units.includes(u.id));

  let progress = emptyProgress();
  progress.settings.stage = stage;
  let now = Date.UTC(2026, 8, 1, 9);
  let today = "2026-09-01";
  let city = newCity(1, now);
  let doneToday = 0;
  const steps: Step[] = [];

  /** Does one lesson: the learning first, then what the city makes of it. */
  const lesson = (what: string, learn: (p: Progress) => Progress, material?: Material) => {
    if (doneToday >= pupil.perDay) {
      now += DAY;
      today = addDays(today, 1);
      doneToday = 0;
      if (pupil.tunes && dueIn(progress, section, levelsOf, today).length > 0) {
        const plan = reviewPlan(progress, section, levelsOf, today, steps.length);
        if (plan) lesson("tune-up", (p) => play(p, plan, today));
      }
    }
    const before = ratesOf(city, progress, today);
    progress = learn(progress);
    const after = ratesOf(city, progress, today);
    city = lessonFinished(city, before, after, now, material);
    steps.push({
      what,
      machines: Object.keys(city.machines).length,
      rate: sumOf(after),
      worth: lessonWorth(after),
    });
    now += LESSON_MINUTES * MINUTE;
    doneToday++;
  };

  const level = (skill: string) =>
    lesson(
      `${skill} level ${levelOf(progress, skill) + 1}`,
      (p) =>
        play(p, planLesson(skill, levelsOf(skill), levelOf(p, skill), [], steps.length), today),
      materialOf(skill),
    );

  const zone = (unit: CourseUnit) => {
    for (const skill of unit.skills) {
      city = placeMachine(city, skill, { x: Object.keys(city.machines).length, y: 0 });
      const taught = lessonsFor(unit.id, false).find((l) =>
        lessonTeaches(l, unit.skills).includes(skill),
      );
      if (taught)
        lesson(
          `${skill} lesson`,
          (p) => finishUnitLesson(p, lessonId(taught), today),
          materialOf(skill),
        );
      while (levelOf(progress, skill) < levelsOf(skill).pathLevels) level(skill);
    }
    if (pupil.aim !== "finished")
      for (const skill of unit.skills) {
        const info = levelsOf(skill);
        const target = pupil.aim === "legendary" ? info.levels.length : (info.mastery ?? 0);
        while (levelOf(progress, skill) < target) level(skill);
      }
    lesson(`${unit.id} review`, (p) => play(p, unitPlan(unit, levelsOf, steps.length), today));
  };

  zones.forEach(zone);
  // Let the last of the power run down.
  now += steps.length * LESSON_POWER * MINUTE;
  city = settle(city, ratesOf(city, progress, today), now);
  return { steps, city, progress, now, today };
}
