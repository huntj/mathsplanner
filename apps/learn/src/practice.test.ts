import type { CourseSection } from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import { skillLevels } from "./course.ts";
import { answer, finished, planLesson, startLesson, summarise, type LessonPlan } from "./lesson.ts";
import { firstMemory, isDue, memoryOf, remember, strengthOf } from "./memory.ts";
import {
  finishLesson,
  mistakesPlan,
  mistakesToFix,
  reviewPlan,
  unitPlan,
  UNIT_BONUS,
  yearPlan,
  YEAR_BONUS,
} from "./practice.ts";
import { addDays, emptyProgress, LESSON_XP, PERFECT_XP, type Progress } from "./progress.ts";

const today = "2026-11-02";
const INFO = skillLevels([1, 2, 4]);
const infoOf = () => INFO;
const SECTION: CourseSection = {
  stage: "Y7",
  name: "Year 7",
  units: [
    { id: "u1", name: "One", topic: "ratio", skills: ["a", "b", "c"] },
    { id: "u2", name: "Two", topic: "ratio", skills: ["d", "e", "f"] },
  ],
};

/** Progress with skills at a level, in a box and due on a day. */
function progressWith(skills: Record<string, [level: number, box: number, due: string]>): Progress {
  const p = emptyProgress();
  for (const [id, [level, box, due]] of Object.entries(skills))
    p.skills[id] = { level, lessons: level, last: addDays(today, -3), box, due };
  return p;
}

/** Plays a lesson through, getting every question right (or wrong, for the skills listed). */
function play(plan: LessonPlan, wrongOn: readonly string[] = [], misconception?: string) {
  let state = startLesson(plan);
  while (!finished(state)) {
    const item = state.queue[0];
    const wrong = item ? wrongOn.includes(item.skill) : false;
    state = answer(state, !wrong, wrong ? misconception : undefined);
  }
  return summarise(state);
}

describe("the review schedule", () => {
  it("moves a skill up a box when it is right on time, and down two when it is wrong", () => {
    const start = firstMemory(today);
    expect(start).toEqual({ box: 1, due: "2026-11-03" });
    expect(remember(start, true, today)).toBe(start);
    const tomorrow = "2026-11-03";
    const second = remember(start, true, tomorrow);
    expect(second).toEqual({ box: 2, due: "2026-11-06" });
    expect(remember({ box: 5, due: today }, true, today)).toEqual({ box: 6, due: "2027-01-01" });
    expect(remember({ box: 6, due: today }, true, today).box).toBe(6);
    expect(remember({ box: 4, due: "2026-12-01" }, false, today)).toEqual({
      box: 2,
      due: tomorrow,
    });
    expect(remember({ box: 1, due: today }, false, today).box).toBe(1);
  });

  it("schedules skills finished before the schedule existed, and says how strong each is", () => {
    const old = { level: 2, lessons: 2, last: "2026-10-30", box: 0, due: "" };
    expect(memoryOf(old, 2)).toEqual({ box: 1, due: "2026-10-31" });
    expect(memoryOf({ ...old, level: 1 }, 2)).toBeUndefined();
    expect(isDue(memoryOf(old, 2), today)).toBe(true);
    expect(strengthOf({ box: 1, due: today }, today)).toBe("due");
    expect(strengthOf({ box: 2, due: "2026-12-01" }, today)).toBe("fresh");
    expect(strengthOf({ box: 4, due: "2026-12-01" }, today)).toBe("strong");
    expect(strengthOf({ box: 6, due: "2026-12-01" }, today)).toBe("solid");
  });
});

describe("practice lessons", () => {
  it("reviews the due skills, most overdue first, or the stalest when none is due", () => {
    const p = progressWith({
      a: [2, 2, "2026-11-01"],
      b: [2, 3, "2026-10-20"],
      c: [2, 4, "2026-12-20"],
      d: [1, 0, ""],
    });
    const plan = reviewPlan(p, SECTION, infoOf, today, 5);
    expect(plan?.title).toBe("Review what’s due");
    expect(new Set(plan?.items.map((i) => i.skill))).toEqual(new Set(["a", "b"]));
    expect(plan?.items).toHaveLength(8);
    expect(plan?.items.every((i) => i.review && i.numbers === "standard")).toBe(true);

    const none = progressWith({ a: [2, 3, "2026-12-01"], c: [2, 4, "2026-12-20"] });
    expect(reviewPlan(none, SECTION, infoOf, today, 5)?.title).toBe("Extra practice");
    expect(reviewPlan(emptyProgress(), SECTION, infoOf, today, 5)).toBeUndefined();
  });

  it("plans unit and year reviews across their skills", () => {
    const unit = unitPlan(
      SECTION.units[0] ?? { id: "", name: "", topic: "", skills: [] },
      infoOf,
      3,
    );
    expect(unit).toMatchObject({ kind: "unit", reviewId: "u1", title: "One: unit review" });
    expect(new Set(unit.items.map((i) => i.skill))).toEqual(new Set(["a", "b", "c"]));
    // First questions at the deepest path level, then a step down.
    expect(unit.items.slice(0, 3).every((i) => i.depth === 2)).toBe(true);
    expect(unit.items.slice(3, 6).every((i) => i.depth === 1)).toBe(true);

    const p = progressWith({ a: [2, 1, today], d: [2, 1, today] });
    const year = yearPlan(p, SECTION, infoOf, 3);
    expect(year).toMatchObject({ kind: "year", reviewId: "year:Y7" });
    expect(year?.items).toHaveLength(12);
    expect(new Set(year?.items.map((i) => i.skill))).toEqual(new Set(["a", "d"]));
  });

  it("aims at the commonest mistakes the pupil can be asked about", () => {
    const p = progressWith({ a: [2, 1, today], b: [1, 0, ""] });
    p.mistakes = { ONE: 1, THREE: 3, NOWHERE: 5 };
    const showing = (code: string, among: readonly string[]) =>
      code === "NOWHERE" ? [] : among.filter((s) => s === (code === "ONE" ? "a" : "b"));
    const mistakes = mistakesToFix(p, SECTION, showing);
    expect(mistakes).toEqual([
      { code: "THREE", count: 3, skills: ["b"] },
      { code: "ONE", count: 1, skills: ["a"] },
    ]);
    const plan = mistakesPlan(mistakes, infoOf, 2);
    expect(plan?.kind).toBe("mistakes");
    expect(plan?.items).toHaveLength(4);
    expect(plan?.items.filter((i) => i.target === "THREE").every((i) => i.skill === "b")).toBe(
      true,
    );
    expect(mistakesPlan([], infoOf, 2)).toBeUndefined();
  });
});

describe("finishing a lesson", () => {
  it("levels a skill up, and puts it in the schedule when it is finished", () => {
    let p = emptyProgress();
    for (let n = 0; n < 2; n++) {
      const plan = planLesson("a", INFO, n, [], 9);
      const { progress, message } = finishLesson(p, plan, play(plan), infoOf, today);
      p = progress;
      if (n === 0) expect(message).toMatch(/^You reached Learn/);
      else expect(message).toBe("Skill finished. The next skill on the path is open.");
    }
    expect(p.skills.a).toEqual({ level: 2, lessons: 2, last: today, box: 1, due: "2026-11-03" });
    expect(p.xp).toBe(2 * (LESSON_XP + PERFECT_XP));
    expect(p.days[today]).toBe(2);
  });

  it("counts a level a teacher picked as reached, and never as a step back", () => {
    const reason = { ...planLesson("a", INFO, 2, [], 9), picked: true as const };
    const first = finishLesson(emptyProgress(), reason, play(reason), infoOf, today);
    expect(first.progress.skills.a?.level).toBe(3);
    expect(first.message).toMatch(/^Mastered!/);
    const learn = { ...planLesson("a", INFO, 0, [], 9), picked: true as const };
    const back = finishLesson(first.progress, learn, play(learn), infoOf, today);
    expect(back.progress.skills.a?.level).toBe(3);
  });

  it("moves reviewed skills through the schedule, and records mistakes and a unit review", () => {
    const p = progressWith({ a: [2, 2, today], b: [2, 3, today], c: [2, 1, "2026-12-01"] });
    const plan = unitPlan(
      SECTION.units[0] ?? { id: "", name: "", topic: "", skills: [] },
      infoOf,
      4,
    );
    const summary = play(plan, ["b"], "MIS");
    const { progress, message } = finishLesson(p, plan, summary, infoOf, today);
    expect(progress.skills.a).toMatchObject({ box: 3, due: "2026-11-09", last: today });
    expect(progress.skills.b).toMatchObject({ box: 1, due: "2026-11-03" });
    expect(progress.skills.c).toMatchObject({ box: 1, due: "2026-12-01" });
    expect(progress.mistakes).toEqual({ MIS: summary.mistakes.length });
    expect(progress.reviews).toEqual({ u1: today });
    expect(progress.xp).toBe(LESSON_XP + UNIT_BONUS);
    expect(message).toBe(
      "Unit review done! +10 bonus XP. 1 skill is stronger in your memory. 1 skill will come back tomorrow for another go.",
    );
    const again = finishLesson(progress, plan, play(plan), infoOf, today);
    expect(again.progress.xp).toBe(progress.xp + LESSON_XP + PERFECT_XP);
    expect(again.message).toMatch(/^Unit review done!/);
  });

  it("takes mistakes put right off the list, and gives the year bonus once", () => {
    const p = progressWith({ a: [2, 1, today], d: [2, 1, today] });
    p.mistakes = { ONE: 2 };
    const fix = mistakesPlan([{ code: "ONE", count: 2, skills: ["a"] }], infoOf, 1);
    if (!fix) throw new Error("no plan");
    const fixed = finishLesson(p, fix, play(fix), infoOf, today);
    expect(fixed.progress.mistakes).toEqual({});
    expect(fixed.message).toMatch(/^You put right 2 mistakes/);

    const year = yearPlan(p, SECTION, infoOf, 1);
    if (!year) throw new Error("no plan");
    const done = finishLesson(p, year, play(year), infoOf, today);
    expect(done.progress.reviews).toEqual({ "year:Y7": today });
    expect(done.progress.xp).toBe(LESSON_XP + PERFECT_XP + YEAR_BONUS);
  });
});
