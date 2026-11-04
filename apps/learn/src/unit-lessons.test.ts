// Every unit lesson must be playable: each screen's answer is reachable, inside its grid, and
// matches what its words say, so a pupil is never stuck on a screen that cannot be done.
import { describe, expect, it } from "vitest";
import { course } from "./course.ts";
import { latticeOn } from "./LineGraph.tsx";
import { emptyProgress, finishUnitLesson, LESSON_XP, lessonsOn, readProgress } from "./progress.ts";
import {
  OPEN_TO_PUPILS,
  makesLine,
  onLine,
  ruleText,
  ruleThrough,
  unitLessonFor,
  UNIT_LESSONS,
  yOn,
  type Picture,
  type Point,
  type Range,
  type Scene,
} from "./unit-lessons/index.ts";
import { curveY } from "./LineGraph.tsx";
import { snapToTick } from "./Picture.tsx";
import {
  balanceMoves,
  circleSlices,
  factorPairs,
  fillWrong,
  isPrime,
  matches,
  morphPieces,
  plainLabel,
  primeProductTex,
  sectorAt,
  shuffled,
} from "./unit-screens.tsx";
import { machineChoices, machineRuleTex } from "./UnitLessonView.tsx";
import { wordsHtml } from "./unit-ui.tsx";

const inside = (r: Range, p: Point) =>
  p.x >= r.xMin && p.x <= r.xMax && p.y >= r.yMin && p.y <= r.yMax;
const whole = (p: Point) => Number.isInteger(p.x) && Number.isInteger(p.y);

const pictureWords = (p: Picture | undefined): string[] =>
  p?.kind === "table" ? [...(p.head ?? []), ...p.rows.flat()] : [];

/** Every piece of writing in a lesson, which must all render. */
const words = (lesson: (typeof UNIT_LESSONS)[number]): string[] =>
  [lesson.title, lesson.summary].concat(
    lesson.screens.flatMap((s) => {
      const own: string[] = [s.title];
      if ("text" in s && s.text) own.push(...(Array.isArray(s.text) ? s.text : [s.text]));
      if ("hint" in s) own.push(s.hint);
      if ("done" in s && s.done) own.push(s.done);
      if ("picture" in s) own.push(...pictureWords(s.picture));
      if (s.kind === "choice")
        own.push(
          ...s.options.flatMap((o) => [o.text, o.feedback]),
          ...pictureWords(s.revealPicture),
        );
      if (s.kind === "steps")
        own.push(
          s.start,
          ...s.stages.flatMap((st) => [
            st.prompt,
            st.then,
            ...st.options.flatMap((o) => [o.text, o.feedback]),
            ...pictureWords(st.picture),
          ]),
        );
      if (s.kind === "sort") own.push(...s.groups, ...s.items.flatMap((i) => [i.text, i.why]));
      if (s.kind === "fill") own.push(s.template, ...s.bank);
      if (s.kind === "order") own.push(...s.items);
      if (s.kind === "answer") own.push(...(s.wrong ?? []).map((w) => w.feedback));
      if (s.kind === "place") own.push(...s.targets.map((t) => t.label));
      return own;
    }),
  );

/** Pictures must fit: marks on the line, labels for every side, and so on. */
function checkPicture(p: Picture | undefined) {
  if (!p) return;
  switch (p.kind) {
    case "graph":
      checkScene(p);
      break;
    case "number-line": {
      expect(p.min).toBeLessThan(p.max);
      const ticks = (p.max - p.min) / p.step;
      expect(Math.abs(ticks - Math.round(ticks))).toBeLessThan(1e-9);
      expect(ticks).toBeLessThanOrEqual(40);
      for (const m of p.marks ?? []) expect(m.at >= p.min && m.at <= p.max, `${m.at}`).toBe(true);
      for (const j of p.jumps ?? []) expect(j.from >= p.min && j.to <= p.max).toBe(true);
      if (p.interval) {
        const { from, to } = p.interval;
        expect(from !== undefined || to !== undefined).toBe(true);
        for (const end of [from, to])
          if (end !== undefined) expect(end >= p.min && end <= p.max).toBe(true);
      }
      break;
    }
    case "angles":
      for (const a of p.arcs) {
        expect(p.rays[a.from]).toBeDefined();
        expect(p.rays[a.to]).toBeDefined();
      }
      break;
    case "shape":
      expect(p.points.length).toBeGreaterThanOrEqual(3);
      for (const list of [p.sides, p.angles, p.names])
        if (list) expect(list.length).toBeLessThanOrEqual(p.points.length);
      break;
    case "grid":
      expect(p.shaded).toBeLessThanOrEqual(p.cols * p.rows);
      for (const c of p.cells ?? []) expect(c).toBeLessThan(p.cols * p.rows);
      if (p.values) expect(p.values).toHaveLength(p.cols * p.rows);
      if (p.colLabels) expect(p.colLabels).toHaveLength(p.cols);
      if (p.rowLabels) expect(p.rowLabels).toHaveLength(p.rows);
      break;
    case "venn":
      // Nothing in two places at once.
      {
        const all = [...p.onlyA, ...p.both, ...p.onlyB, ...(p.neither ?? [])];
        expect(new Set(all).size).toBe(all.length);
      }
      break;
    case "dots":
      expect(p.terms).toBeGreaterThan(0);
      expect(p.terms).toBeLessThanOrEqual(6);
      break;
    case "table":
      for (const row of p.rows) if (p.head) expect(row.length).toBe(p.head.length);
      break;
    case "bar-chart":
      for (const b of p.bars) expect(b.value).toBeLessThanOrEqual(p.max);
      expect(p.max % p.step).toBe(0);
      break;
    case "spinner":
      expect(p.sectors.every((s) => s.size > 0)).toBe(true);
      break;
    case "ruler":
      expect(p.from).toBeLessThan(p.to);
      break;
    default:
      break;
  }
}

/** What the factor tree screen ends on: the primes of n, smallest first. */
function primes(n: number): number[] {
  const out: number[] = [];
  for (let d = 2; n > 1; d++)
    while (n % d === 0) {
      out.push(d);
      n /= d;
    }
  return out;
}

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
        case "answer": {
          checkPicture(screen.picture);
          expect(screen.answers.length).toBeGreaterThan(0);
          // A nudge for a wrong answer must not match a right one.
          for (const w of screen.wrong ?? [])
            for (const a of screen.answers) expect(matches(w.answer, a), w.answer).toBe(false);
          break;
        }
        case "place": {
          checkPicture(screen.line);
          for (const t of screen.targets) {
            expect(t.value >= screen.line.min && t.value <= screen.line.max).toBe(true);
            // Every target sits on a tick, so a tap can land on it.
            expect(snapToTick(screen.line, t.value), t.label).toBeCloseTo(t.value, 9);
          }
          break;
        }
        case "order":
          checkPicture(screen.picture);
          expect(new Set(screen.items).size).toBe(screen.items.length);
          expect(screen.items.length).toBeGreaterThan(2);
          break;
        case "sort":
          expect(screen.groups.length).toBeGreaterThan(1);
          for (const item of screen.items) expect(screen.groups[item.group]).toBeDefined();
          // Every group gets something.
          for (const g of screen.groups.keys())
            expect(screen.items.some((i) => i.group === g)).toBe(true);
          break;
        case "fill": {
          checkPicture(screen.picture);
          expect(screen.template.split("[]").length - 1).toBe(screen.answers.length);
          for (const a of screen.answers) expect(screen.bank, a).toContain(a);
          expect(new Set(screen.bank).size).toBe(screen.bank.length);
          break;
        }
        case "shade":
          expect(screen.target).toBeGreaterThan(0);
          expect(screen.target).toBeLessThanOrEqual(screen.cols * screen.rows);
          if (screen.cells) {
            expect(new Set(screen.cells).size).toBe(screen.target);
            for (const c of screen.cells) expect(c).toBeLessThan(screen.cols * screen.rows);
          }
          if (screen.values) expect(screen.values).toHaveLength(screen.cols * screen.rows);
          break;
        case "balance": {
          const d = screen.d ?? 0;
          expect(
            balanceMoves(screen.a, screen.b, screen.c, screen.letter, d).length,
          ).toBeGreaterThan(0);
          // More bags on the left, and it ends on a whole-number answer, with every pile small
          // enough to draw.
          expect(screen.a).toBeGreaterThan(d);
          expect((screen.c - screen.b) % (screen.a - d)).toBe(0);
          expect(screen.c - screen.b).toBeGreaterThan(0);
          expect(screen.b).toBeGreaterThanOrEqual(0);
          expect(screen.c + d).toBeLessThanOrEqual(24);
          // Playing every right move ends with the letter alone.
          let eq = { a: screen.a, b: screen.b, c: screen.c, d };
          for (let k = 0; k < 3; k++) {
            const after = balanceMoves(eq.a, eq.b, eq.c, screen.letter, eq.d)[0]?.after;
            if (after) eq = { d: 0, ...after };
          }
          expect(eq).toEqual({ a: 1, b: 0, c: (screen.c - screen.b) / (screen.a - d), d: 0 });
          expect(screen.done).toContain(`= ${eq.c}`);
          break;
        }
        case "steps":
          checkPicture(screen.picture);
          for (const st of screen.stages) {
            expect(
              st.options.filter((o) => o.correct),
              st.prompt,
            ).toHaveLength(1);
            checkPicture(st.picture);
          }
          break;
        case "dial":
          expect(screen.target).toBeGreaterThan(0);
          expect(screen.target).toBeLessThan(360);
          // The dial starts away from the target.
          expect(Math.abs((screen.target > 180 ? 200 : 40) - screen.target)).toBeGreaterThan(
            screen.within,
          );
          break;
        case "spin":
          expect(screen.sectors.length).toBeGreaterThan(1);
          expect(screen.spins).toBeGreaterThan(0);
          expect(sectorAt([1, 1, 2], 0.6)).toBe(2);
          break;
        case "tree":
          expect(isPrime(screen.root)).toBe(false);
          expect(screen.done).toContain(primes(screen.root).join(" \\times "));
          break;
        case "morph":
          expect(screen.dims.every((d) => d > 0)).toBe(true);
          if (screen.shape === "circle") {
            // An even number of slices, so they pair up into a row.
            expect((screen.dims[1] ?? 0) % 2).toBe(0);
          } else if (screen.shape !== "cuboid") {
            // At the end, the moving piece and the still one make one shape with no overlap.
            const end = morphPieces(screen.shape, screen.dims, 1);
            expect(end.moving.length).toBeGreaterThan(2);
          }
          break;
      }
      if (screen.kind === "explain" || screen.kind === "choice") {
        checkPicture(screen.picture);
        if (screen.kind === "choice") checkPicture(screen.revealPicture);
      }
    },
  );
});

describe("unit lesson screens", () => {
  it("marks typed answers however they are written", () => {
    expect(matches(" 2500 ", "2500")).toBe(true);
    expect(matches("2,500", "2500")).toBe(true);
    expect(matches("0.50", "0.5")).toBe(true);
    expect(matches("−3", "-3")).toBe(true);
    expect(matches("3 : 2", "3:2")).toBe(true);
    expect(matches("3X+9", "3x+9")).toBe(true);
    expect(matches("6/10", "3/5")).toBe(false);
  });

  it("mixes cards up the same way every time, never already in order", () => {
    const items = ["a", "b", "c", "d"];
    expect(shuffled(items, "x")).toEqual(shuffled(items, "x"));
    expect(shuffled(items, "x")).not.toEqual(items);
    expect([...shuffled(items, "x")].sort()).toEqual(items);
  });

  it("solves a balance a step at a time", () => {
    const [first] = balanceMoves(2, 5, 17, "x");
    expect(first?.after).toEqual({ a: 2, b: 0, c: 12 });
    const [second] = balanceMoves(2, 0, 12, "x");
    expect(second?.after).toEqual({ a: 1, b: 0, c: 6 });
    expect(balanceMoves(1, 0, 6, "x")).toEqual([]);
    // With letters on both sides, the right side's letters go first.
    const [both] = balanceMoves(5, 3, 15, "x", 2);
    expect(both?.after).toEqual({ a: 3, b: 3, c: 15, d: 0 });
  });

  it("lays a circle's slices out in a row half the circumference long", () => {
    const r = 2;
    const n = 16;
    const start = circleSlices(r, n, 0);
    // At the start every slice points out from the same centre.
    expect(new Set(start.map((s) => `${s.apex.x},${s.apex.y}`)).size).toBe(1);
    const end = circleSlices(r, n, 1);
    const xs = end.map((s) => s.apex.x);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(Math.PI * r - (Math.PI * r) / n, 9);
    expect(
      end.every(
        (s) =>
          Math.abs(Math.abs(s.facing % 360) - 90) < 1e-9 ||
          Math.abs(Math.abs(s.facing % 360) - 270) < 1e-9,
      ),
    ).toBe(true);
  });

  it("splits numbers into factor pairs and writes primes with powers", () => {
    expect(factorPairs(60)).toEqual([
      [2, 30],
      [3, 20],
      [4, 15],
      [5, 12],
      [6, 10],
    ]);
    expect(primeProductTex([5, 2, 3, 2])).toBe("2^{2} \\times 3 \\times 5");
  });

  it("slides and turns shapes so their pieces end up side by side", () => {
    const para = morphPieces("parallelogram", [6, 4, 2], 1);
    expect(para.moving.map((p) => p.x)).toEqual([6, 8, 8]);
    const tri = morphPieces("triangle", [6, 4, 2], 1);
    // The turned copy's corners land on the parallelogram's: (8, 4), (2, 4) and (6, 0).
    const near = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y) < 1e-9;
    expect(tri.moving.some((p) => near(p, { x: 8, y: 4 }))).toBe(true);
    expect(tri.moving.some((p) => near(p, { x: 6, y: 0 }))).toBe(true);
  });

  it("writes a machine's rule with its own names, as maths that renders", () => {
    expect(machineRuleTex({ m: 2, c: 1 }, "x", "y")).toBe("y = 2x + 1");
    const term = machineRuleTex({ m: 4, c: -1 }, "n", "term");
    expect(term).toBe("\\text{term} = 4n - 1");
    expect(wordsHtml(`$${term}$`)).not.toContain("katex-error");
    for (const lesson of UNIT_LESSONS)
      for (const s of lesson.screens)
        if (s.kind === "machine") {
          const [a, b] = s.ports ?? ["x", "y"];
          expect(wordsHtml(`$${machineRuleTex(s.rule, a, b)}$`)).not.toContain("katex-error");
        }
  });

  it("fills gaps in any order when the order doesn't matter", () => {
    expect(fillWrong(["4", "3"], ["3", "4"], true)).toEqual([false, false]);
    expect(fillWrong(["3", "3"], ["3", "4"], true)).toEqual([false, true]);
    expect(fillWrong(["4", "3"], ["3", "4"], false)).toEqual([true, true]);
  });

  it("draws curves through the right points", () => {
    expect(curveY({ kind: "quadratic", a: 1, b: -2, c: -3 }, 3)).toBe(0);
    expect(curveY({ kind: "inverse", k: 24 }, 4)).toBe(6);
    expect(curveY({ kind: "inverse", k: 24 }, 0)).toBeUndefined();
    // Every plotted point on a lesson's curve is on the curve.
    for (const lesson of UNIT_LESSONS)
      for (const s of lesson.screens)
        if (s.kind === "plot" && s.scene.curves?.length && !s.scene.lines?.length)
          for (const t of s.targets)
            expect(s.scene.curves.some((c) => Math.abs((curveY(c, t.x) ?? NaN) - t.y) < 1e-9)).toBe(
              true,
            );
  });

  it("turns lesson maths into plain labels for drawings", () => {
    expect(plainLabel("$\\frac{3}{4}$")).toBe("3/4");
    expect(plainLabel("$-\\frac{1}{2}$")).toBe("−1/2");
  });
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

  it("shows a unit lesson only to teachers until it is opened to pupils", () => {
    const unit = UNIT_LESSONS[0]?.unit ?? "";
    expect(unitLessonFor(unit, true)).toBeDefined();
    expect(unitLessonFor(unit, false) !== undefined).toBe(OPEN_TO_PUPILS.has(unit));
    for (const open of OPEN_TO_PUPILS) expect(unitLessonFor(open, false)).toBeDefined();
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
