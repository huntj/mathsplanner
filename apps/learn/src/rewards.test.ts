import { describe, expect, it } from "vitest";
import { skillLevels } from "./course.ts";
import {
  answer,
  finished,
  HEARTS,
  heartsLeft,
  planLesson,
  planSpeed,
  SPEED_QUESTIONS,
  startLesson,
  summarise,
  timeUp,
} from "./lesson.ts";
import { finishLesson } from "./practice.ts";
import { addDays, emptyProgress, LESSON_XP, PERFECT_XP, readProgress } from "./progress.ts";
import { awardBadges, BADGES, earnFreeze, FREEZE_EVERY, settleStreak } from "./rewards.ts";

const today = "2026-11-05";
const INFO = skillLevels([1, 2, 4]);
const infoOf = () => INFO;

/** Progress with the daily goal met on the days given (days before today). */
function metOn(daysAgo: readonly number[], freezes = 0) {
  const p = emptyProgress();
  p.settings.dailyGoal = 1;
  for (const d of daysAgo) p.days[addDays(today, -d)] = 1;
  p.freezes = freezes;
  return p;
}

describe("streak freezes", () => {
  it("cover missed days when there are enough, so the streak carries on", () => {
    const p = metOn([3, 4, 5], 2);
    const { progress, used } = settleStreak(p, today);
    expect(used).toBe(2);
    expect(progress.freezes).toBe(0);
    expect(progress.frozen).toEqual([addDays(today, -2), addDays(today, -1)]);
    // Settling again changes nothing.
    expect(settleStreak(progress, today).used).toBe(0);
  });

  it("are kept when too many days were missed, or nothing was missed, or nothing was ever done", () => {
    expect(settleStreak(metOn([3, 4], 1), today)).toMatchObject({ used: 0 });
    expect(settleStreak(metOn([3, 4], 1), today).progress.freezes).toBe(1);
    expect(settleStreak(metOn([1, 2], 2), today).used).toBe(0);
    expect(settleStreak(metOn([], 2), today).used).toBe(0);
  });

  it("are earned every seven days of streak, up to two", () => {
    const before = metOn([1, 2, 3, 4, 5, 6]);
    const after = { ...before, days: { ...before.days, [today]: 1 } };
    expect(FREEZE_EVERY).toBe(7);
    expect(earnFreeze(before, after, today)).toMatchObject({ earned: true });
    expect(earnFreeze(before, after, today).progress.freezes).toBe(1);
    expect(earnFreeze(before, { ...after, freezes: 2 }, today).earned).toBe(false);
    expect(earnFreeze(after, after, today).earned).toBe(false);
  });
});

describe("badges", () => {
  it("are earned once, each recorded with the day", () => {
    const p = metOn([0]);
    const first = awardBadges(p, today, { perfect: true, challenge: false, fixed: 0 });
    expect(first.earned.map((b) => b.id)).toEqual(["first-lesson", "perfect"]);
    expect(first.progress.badges).toEqual({ "first-lesson": today, perfect: today });
    const again = awardBadges(first.progress, today, { perfect: true, challenge: false, fixed: 0 });
    expect(again.earned).toEqual([]);
  });

  it("all have a unique id, a name and how to earn them", () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    for (const b of BADGES) expect(b.name && b.how.endsWith(".")).toBeTruthy();
  });
});

describe("challenge mode and speed rounds", () => {
  it("loses a heart for each wrong answer and doubles the XP for finishing with one left", () => {
    let state = startLesson(planLesson("s", INFO, 1, [], 3));
    state = answer(state, false);
    state = answer(state, false);
    expect(heartsLeft(state)).toBe(HEARTS - 2);
    while (!finished(state)) state = answer(state, true);
    const summary = summarise(state, true);
    expect(summary.hearts).toBe(1);
    expect(summary.xp).toBe(LESSON_XP * 2);
    expect(summarise(state).hearts).toBeUndefined();
    expect(summarise(state).xp).toBe(LESSON_XP);
  });

  it("asks each speed question once, stops when the time is up, and gives XP per right answer", () => {
    const plan = planSpeed(
      [
        { skill: "a", info: INFO },
        { skill: "b", info: INFO },
      ],
      4,
    );
    expect(plan.items).toHaveLength(SPEED_QUESTIONS);
    expect(plan.items.every((i) => i.depth === 1 && i.numbers === "standard")).toBe(true);
    let state = startLesson(plan);
    state = answer(state, false);
    expect(state.queue).toHaveLength(SPEED_QUESTIONS - 1);
    for (let i = 0; i < 6; i++) state = answer(state, true);
    state = timeUp(state);
    expect(finished(state)).toBe(true);
    expect(summarise(state)).toMatchObject({ firstTime: 6, total: 7, perfect: false, xp: 6 });
  });
});

describe("rewards from a finished lesson", () => {
  it("records the speed best, without moving skills through the schedule", () => {
    const p = emptyProgress();
    p.skills.a = { level: 2, lessons: 2, last: today, box: 2, due: today };
    p.speedBest = 4;
    const plan = planSpeed([{ skill: "a", info: INFO }], 1);
    let state = startLesson(plan);
    for (let i = 0; i < 5; i++) state = answer(state, true);
    state = answer(state, false);
    const done = finishLesson(p, plan, summarise(timeUp(state)), infoOf, today);
    expect(done.progress.speedBest).toBe(5);
    expect(done.progress.skills.a).toEqual(p.skills.a);
    expect(done.message).toBe("5 right answers: a new best!");
  });

  it("earns badges for reaching mastery and for a perfect lesson", () => {
    const p = emptyProgress();
    p.skills.s = { level: 2, lessons: 2, last: today, box: 1, due: addDays(today, 1) };
    const plan = planLesson("s", INFO, 2, [], 5);
    let state = startLesson(plan);
    while (!finished(state)) state = answer(state, true);
    const done = finishLesson(p, plan, summarise(state), infoOf, today);
    expect(done.badges.map((b) => b.id)).toEqual(
      expect.arrayContaining(["first-lesson", "first-skill", "mastered", "perfect"]),
    );
    expect(done.progress.xp).toBe(LESSON_XP + PERFECT_XP);
    expect(done.freeze).toBe(false);
  });

  it("reads back freezes, frozen days, badges and the speed best", () => {
    const p = emptyProgress();
    p.freezes = 2;
    p.frozen = ["2026-11-01"];
    p.badges = { "first-lesson": today };
    p.speedBest = 12;
    expect(readProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
    expect(
      readProgress({ ...p, freezes: 9, frozen: ["soon", 3], badges: { x: "no" } }),
    ).toMatchObject({
      freezes: 2,
      frozen: [],
      badges: {},
    });
  });
});

describe("speed rounds and the daily goal", () => {
  it("count towards the daily goal only with a few right answers", () => {
    const plan = planSpeed([{ skill: "a", info: INFO }], 2);
    const play = (right: number) => {
      let state = startLesson(plan);
      for (let i = 0; i < right; i++) state = answer(state, true);
      return finishLesson(emptyProgress(), plan, summarise(timeUp(state)), infoOf, today).progress;
    };
    expect(play(4).days).toEqual({});
    expect(play(5).days).toEqual({ [today]: 1 });
  });
});
