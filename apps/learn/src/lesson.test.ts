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
import { emptyProgress, LESSON_XP, PERFECT_XP, RECENT_FORMS, rememberForms } from "./progress.ts";
import { formOf, levelsOf, questionFor } from "./skills.ts";

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
      skills: { s: false },
      fixed: [],
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
  it("finds a question offering the mistake a pupil is fixing, at another depth if need be", () => {
    // Y7-ALG-04.a offers the sign slip only at depth 2.
    const item = {
      skill: "Y7-ALG-04.a",
      depth: 1 as const,
      numbers: "standard" as const,
      seed: 77,
      review: false,
      slot: 0,
      attempt: 0,
      target: "ALG.LIKE-TERMS.SIGN",
    };
    const lq = questionFor(item);
    expect(lq?.question.key.depth).toBe(2);
    expect(
      lq?.question.parts.some((p) => p.misconceptions.some((m) => m.code === item.target)),
    ).toBe(true);
  });

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

describe("variety in a lesson", () => {
  const legendary = (skill: string) => {
    const info = levelsOf(skill);
    return planLesson(skill, info, info.levels.length - 1, [], 314);
  };

  it("names a question's form by its wording, not its numbers", () => {
    const item = legendary("Y7-GEO-05.c").items[0];
    if (!item) throw new Error("no item");
    const a = questionFor(item)?.question;
    const b = questionFor({ ...item, seed: item.seed + 1 })?.question;
    if (!a || !b) throw new Error("no question");
    expect(formOf(a)).toMatch(/^[0-9a-z]+$/);
    // Two seeds may pick the same claim or different ones; the same seed always gives the same form.
    expect(formOf(questionFor(item)?.question ?? a)).toBe(formOf(a));
  });

  it("prefers a form the pupil has not just seen", () => {
    const item = legendary("Y7-ALG-04.a").items[0];
    if (!item) throw new Error("no item");
    const first = questionFor(item);
    if (!first) throw new Error("no question");
    const next = questionFor(item, new Map([[formOf(first.question), 1]]));
    expect(next && formOf(next.question)).not.toBe(formOf(first.question));
  });

  it("shows each kind of reasoning question in a lesson before repeating one", () => {
    for (const skill of ["Y7-ALG-04.a", "Y7-GEO-05.a", "Y7-STA-01.b", "Y7-RAT-03.b"]) {
      const seen = new Map<string, number>();
      for (const item of legendary(skill).items.slice(0, 4)) {
        const lq = questionFor(item, seen);
        if (lq) seen.set(formOf(lq.question), seen.size + 1);
      }
      expect(seen.size, skill).toBe(4);
    }
  });

  it("goes back to the form seen longest ago once every form has been seen", () => {
    const items = legendary("Y7-GEO-05.a").items;
    const seen = new Map<string, number>();
    let tick = 0;
    const order: string[] = [];
    for (const item of [...items, ...items].slice(0, 12)) {
      const lq = questionFor(item, seen);
      if (!lq) continue;
      const form = formOf(lq.question);
      order.push(form);
      seen.set(form, ++tick);
    }
    // Four forms, each shown once before any comes round again, and never twice in a row.
    expect(new Set(order.slice(0, 4)).size).toBe(4);
    expect(order.slice(4, 8)).toEqual(order.slice(0, 4));
    expect(order.some((f, i) => f === order[i - 1])).toBe(false);
  });

  it("remembers the forms a skill showed lately, newest first and without repeats", () => {
    let p = emptyProgress();
    p = rememberForms(p, { s: ["a", "b"] });
    p = rememberForms(p, { s: ["c", "a"] });
    expect(p.recent.s).toEqual(["a", "c", "b"]);
    p = rememberForms(p, { s: ["d", "e", "f", "g", "h"] });
    expect(p.recent.s).toHaveLength(RECENT_FORMS);
    expect(p.recent.s?.[0]).toBe("h");
  });
});
