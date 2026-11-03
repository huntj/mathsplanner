// Every unit lesson must be playable: each screen's answer is reachable, inside its grid, and
// matches what its words say, so a pupil is never stuck on a screen that cannot be done.
import { describe, expect, it } from "vitest";
import { course } from "./course.ts";
import { latticeOn } from "./LineGraph.tsx";
import { emptyProgress, finishUnitLesson, LESSON_XP, lessonsOn, readProgress } from "./progress.ts";
import {
  FOR_PUPILS,
  makesLine,
  onLine,
  ruleText,
  ruleThrough,
  unitLessonFor,
  UNIT_LESSONS,
  yOn,
  type Point,
  type Range,
  type Scene,
} from "./unit-lessons/index.ts";
import { machineChoices, wordsHtml } from "./UnitLessonView.tsx";

const inside = (r: Range, p: Point) =>
  p.x >= r.xMin && p.x <= r.xMax && p.y >= r.yMin && p.y <= r.yMax;
const whole = (p: Point) => Number.isInteger(p.x) && Number.isInteger(p.y);

const words = (lesson: (typeof UNIT_LESSONS)[number]): string[] =>
  [lesson.title, lesson.summary].concat(
    lesson.screens.flatMap((s) => {
      const own: string[] = [s.title];
      if ("text" in s && s.text) own.push(...(Array.isArray(s.text) ? s.text : [s.text]));
      if ("hint" in s) own.push(s.hint);
      if ("done" in s) own.push(s.done);
      if (s.kind === "choice") own.push(...s.options.flatMap((o) => [o.text, o.feedback]));
      return own;
    }),
  );

function checkScene(scene: Scene) {
  const { range } = scene;
  expect(range.xMin).toBeLessThan(range.xMax);
  expect(range.yMin).toBeLessThan(range.yMax);
  for (const p of scene.points ?? []) expect(inside(range, p), JSON.stringify(p)).toBe(true);
  if (scene.star) expect(inside(range, scene.star)).toBe(true);
  // Steps need a line with at least two whole-number points on the grid.
  const first = scene.lines?.[0];
  if (scene.steps && first) expect(latticeOn(first, range).length).toBeGreaterThan(1);
}

describe.each(UNIT_LESSONS.map((l) => [l.unit, l] as const))("unit lesson %s", (_, lesson) => {
  it("opens a unit on the course", () => {
    const units = course.sections.flatMap((s) => s.units.map((u) => u.id));
    expect(units).toContain(lesson.unit);
    expect(lesson.screens.length).toBeGreaterThan(3);
  });

  it("has words that render: balanced $maths$ and **bold**", () => {
    for (const w of words(lesson)) {
      expect(w.split("$").length % 2, w).toBe(1);
      for (const [i, part] of w.split("$").entries())
        if (i % 2 === 0) expect(part.split("**").length % 2, w).toBe(1);
      expect(() => wordsHtml(w)).not.toThrow();
      expect(wordsHtml(w)).not.toContain("katex-error");
    }
  });

  it.each(lesson.screens.map((s, i) => [i + 1, s.kind, s] as const))(
    "screen %i (%s) can be done",
    (_n, _kind, screen) => {
      switch (screen.kind) {
        case "explain":
          expect(screen.text.length).toBeGreaterThan(0);
          if (screen.scene) checkScene(screen.scene);
          break;
        case "machine": {
          expect(screen.shown).toBeGreaterThan(0);
          expect(screen.shown).toBeLessThan(screen.inputs.length);
          expect(new Set(screen.inputs).size).toBe(screen.inputs.length);
          // Every input the pupil answers has decoys, none of them the right output.
          for (const x of screen.inputs.slice(screen.shown)) {
            const decoys = screen.decoys[x] ?? [];
            expect(decoys.length, `x = ${x}`).toBeGreaterThan(0);
            expect(decoys).not.toContain(yOn(screen.rule, x));
            expect(machineChoices(screen, x)).toContain(yOn(screen.rule, x));
          }
          break;
        }
        case "plot": {
          checkScene(screen.scene);
          expect(screen.targets.length).toBeGreaterThan(0);
          for (const t of screen.targets) {
            expect(whole(t)).toBe(true);
            expect(inside(screen.scene.range, t), JSON.stringify(t)).toBe(true);
            if (screen.rule) expect(onLine(screen.rule, t)).toBe(true);
          }
          const keys = screen.targets.map((t) => `${t.x},${t.y}`);
          expect(new Set(keys).size).toBe(keys.length);
          // A target that is already drawn could not be tapped as new.
          for (const p of screen.scene.points ?? []) expect(keys).not.toContain(`${p.x},${p.y}`);
          break;
        }
        case "choice": {
          expect(screen.options.filter((o) => o.correct)).toHaveLength(1);
          expect(new Set(screen.options.map((o) => o.text)).size).toBe(screen.options.length);
          if (screen.scene) checkScene(screen.scene);
          if (screen.reveal) checkScene(screen.reveal);
          expect(screen.scene ?? screen.reveal).toBeDefined();
          break;
        }
        case "slider": {
          const { vary, start, star } = screen;
          expect(whole(star)).toBe(true);
          expect(inside(screen.range, star)).toBe(true);
          expect(start[vary]).toBeGreaterThanOrEqual(screen.min);
          expect(start[vary]).toBeLessThanOrEqual(screen.max);
          // The star is not hit at the start, and exactly one whole value on the slider hits it.
          expect(onLine(start, star)).toBe(false);
          const hits = [];
          for (let v = screen.min; v <= screen.max; v++)
            if (onLine({ ...start, [vary]: v }, star)) hits.push(v);
          expect(hits).toHaveLength(1);
          // The words that end it name that value.
          expect(screen.done).toContain(`${vary} = ${String(hits[0]).replace("-", "−")}`);
          break;
        }
        case "build": {
          expect(screen.ms).toContain(screen.rule.m);
          expect(screen.cs).toContain(screen.rule.c);
          expect(new Set(screen.ms).size).toBe(screen.ms.length);
          expect(new Set(screen.cs).size).toBe(screen.cs.length);
          // Enough of the line shows to read both its intercept and a step.
          const lattice = latticeOn(screen.rule, screen.range);
          expect(lattice.some((p) => p.x === 0)).toBe(true);
          expect(lattice.length).toBeGreaterThan(2);
          break;
        }
        case "drag-line": {
          const [a, b] = screen.from;
          expect(inside(screen.range, a) && inside(screen.range, b)).toBe(true);
          expect(makesLine(screen.rule, a, b)).toBe(false);
          // Two whole-number points of the line fit on the grid, one on the y-axis.
          const lattice = latticeOn(screen.rule, screen.range);
          expect(lattice.length).toBeGreaterThan(1);
          expect(lattice.some((p) => p.x === 0)).toBe(true);
          break;
        }
      }
    },
  );
});

describe("unit lesson helpers", () => {
  it("writes rules as a pupil would", () => {
    expect(ruleText({ m: 2, c: 1 })).toBe("y = 2x + 1");
    expect(ruleText({ m: -1, c: 3 })).toBe("y = −x + 3");
    expect(ruleText({ m: 3, c: -2 })).toBe("y = 3x − 2");
    expect(ruleText({ m: 1, c: 0 })).toBe("y = x");
    expect(ruleText({ m: 0, c: -4 })).toBe("y = −4");
    expect(ruleText({ m: -2, c: 4 }, "-")).toBe("y = -2x + 4");
  });

  it("finds the line through two points, and knows when two points make a line", () => {
    expect(ruleThrough({ x: 0, y: -2 }, { x: 2, y: 0 })).toEqual({ m: 1, c: -2 });
    expect(ruleThrough({ x: 1, y: 0 }, { x: 1, y: 5 })).toBeUndefined();
    const rule = { m: 1, c: -2 };
    expect(makesLine(rule, { x: 0, y: -2 }, { x: 3, y: 1 })).toBe(true);
    expect(makesLine(rule, { x: 0, y: -2 }, { x: 0, y: -2 })).toBe(false);
    expect(makesLine(rule, { x: 0, y: -2 }, { x: 1, y: 0 })).toBe(false);
  });

  it("shows unit lessons only to teachers until they are opened to pupils", () => {
    const unit = UNIT_LESSONS[0]?.unit ?? "";
    expect(unitLessonFor(unit, true)).toBeDefined();
    expect(unitLessonFor(unit, false) !== undefined).toBe(FOR_PUPILS);
    expect(unitLessonFor("no-such-unit", true)).toBeUndefined();
  });

  it("renders maths and bold in words, and escapes the rest", () => {
    const html = wordsHtml("The **gradient** of $y = 2x$ is <2>");
    expect(html).toContain("<strong>gradient</strong>");
    expect(html).toContain("katex");
    expect(html).toContain("&lt;2&gt;");
  });
});

describe("recording a unit lesson", () => {
  it("adds XP, counts towards the day and remembers the unit", () => {
    const day = "2026-11-03";
    const after = finishUnitLesson(emptyProgress(), "y8-graphs", day);
    expect(after.xp).toBe(LESSON_XP);
    expect(lessonsOn(after, day)).toBe(1);
    expect(after.unitLessons).toEqual({ "y8-graphs": day });
    expect(readProgress(JSON.parse(JSON.stringify(after))).unitLessons).toEqual({
      "y8-graphs": day,
    });
  });

  it("reads back only valid days", () => {
    const raw = { ...emptyProgress(), unitLessons: { a: "2026-01-02", b: 3, c: "soon" } };
    expect(readProgress(raw).unitLessons).toEqual({ a: "2026-01-02" });
    const old: Record<string, unknown> = { ...emptyProgress() };
    delete old.unitLessons;
    expect(readProgress(old).unitLessons).toEqual({});
  });
});
