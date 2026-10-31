import { describe, expect, it } from "vitest";
import { course, skillLevels } from "./course.ts";
import {
  answer,
  drop,
  finished,
  lessonProgress,
  levelMessage,
  planLesson,
  RETRIES,
  startLesson,
  summarise,
} from "./lesson.ts";
import { LESSON_XP, PERFECT_XP } from "./progress.ts";
import { levelsOf, questionFor } from "./skills.ts";

const INFO = skillLevels([1, 2, 4]);
const REVIEW = [
  { skill: "r1", info: INFO },
  { skill: "r2", info: INFO },
  { skill: "r3", info: INFO },
];

describe("planning a lesson", () => {
  it("opens a new skill on a worked example, then easiest questions first", () => {
    const plan = planLesson("s", INFO, 0, [], 42);
    expect(plan.level).toBe(1);
    expect(plan.example).toMatchObject({ skill: "s", depth: 1, numbers: "friendly" });
    expect(plan.items).toHaveLength(8);
    expect(plan.items.every((i) => i.skill === "s" && i.depth === 1 && !i.review)).toBe(true);
    expect(new Set(plan.items.map((i) => i.seed)).size).toBe(8);
  });

  it("works on the next level and mixes in two reviews from different skills", () => {
    const plan = planLesson("s", INFO, 1, REVIEW, 7);
    expect(plan.level).toBe(2);
    expect(plan.example).toBeUndefined();
    const own = plan.items.filter((i) => !i.review);
    expect(own.map((i) => i.depth)).toEqual([1, 1, 1, 2, 2, 2]);
    expect(own.every((i) => i.numbers === "standard")).toBe(true);
    const reviews = plan.items.filter((i) => i.review);
    expect(reviews).toHaveLength(2);
    expect(new Set(reviews.map((r) => r.skill)).size).toBe(2);
    expect(plan.items.map((i) => i.review)).toEqual([
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
    ]);
    expect(plan.items.map((i) => i.slot)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("repeats the top level once every level is done", () => {
    const plan = planLesson("s", INFO, 4, [], 1);
    expect(plan.level).toBe(4);
    expect(plan.items.every((i) => i.depth === 4 && i.numbers === "stretch")).toBe(true);
  });
});

describe("playing a lesson", () => {
  it("brings a wrong answer back with new numbers, at most twice, then ends", () => {
    let state = startLesson(planLesson("s", INFO, 1, [], 3));
    const first = state.queue[0];
    state = answer(state, false, "MIS.CODE");
    expect(state.queue).toHaveLength(8);
    const back = state.queue.at(-1);
    expect(back).toMatchObject({ slot: first?.slot, attempt: 1 });
    expect(back?.seed).not.toBe(first?.seed);
    expect(lessonProgress(state)).toBe(0);

    for (let i = 0; i < 7; i++) state = answer(state, true);
    expect(lessonProgress(state)).toBe(7 / 8);
    for (let i = 0; i < RETRIES; i++) state = answer(state, false);
    expect(finished(state)).toBe(true);
    expect(lessonProgress(state)).toBe(1);

    const summary = summarise(state);
    expect(summary).toEqual({
      firstTime: 7,
      total: 8,
      perfect: false,
      xp: LESSON_XP,
      mistakes: ["MIS.CODE"],
    });
  });

  it("gives a bonus for a perfect lesson and drops a question that cannot be made", () => {
    let state = startLesson(planLesson("s", INFO, 1, [], 3));
    state = drop(state);
    expect(state.plan.items).toHaveLength(7);
    while (!finished(state)) state = answer(state, true);
    expect(summarise(state)).toMatchObject({
      firstTime: 7,
      total: 7,
      perfect: true,
      xp: LESSON_XP + PERFECT_XP,
    });
  });
});

describe("level messages", () => {
  it("says what the lesson did for the skill", () => {
    expect(levelMessage(INFO, 0, 1)).toBe("You reached Learn. 1 more lesson to finish this skill.");
    expect(levelMessage(INFO, 1, 2)).toBe("Skill finished. The next skill on the path is open.");
    expect(levelMessage(INFO, 2, 3)).toMatch(/^Mastered!/);
    expect(levelMessage(INFO, 3, 4)).toMatch(/^Legendary!/);
    expect(levelMessage(INFO, 4, 4)).toMatch(/^Extra practice/);
  });
});

describe("Year 7 lessons", () => {
  it("makes every question of every level's lesson for every Year 7 skill", () => {
    const section = course.sections.find((s) => s.stage === "Y7");
    const skills = section?.units.flatMap((u) => u.skills) ?? [];
    expect(skills.length).toBeGreaterThan(0);
    const missing: string[] = [];
    for (const skill of skills) {
      const info = levelsOf(skill);
      for (let done = 0; done < info.levels.length; done++) {
        const plan = planLesson(skill, info, done, [], 1000 + done);
        for (const item of [...plan.items, ...(plan.example ? [plan.example] : [])])
          if (!questionFor(item)) missing.push(`${skill} depth ${item.depth} ${item.numbers}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
