import {
  ARCHETYPES,
  createRng,
  defineGenerator,
  frac,
  type QuestionDraft,
  type Rng,
} from "@mathsplanner/core";
import { describe, expect, it } from "vitest";
import * as A from "./index.ts";

const rng = () => createRng("archetype tests");
const line = { type: "number-line" as const, min: 0, max: 10, step: 1 };

/** One example of every archetype, built the way a generator would. */
const examples: Record<string, (r: Rng) => QuestionDraft> = {
  standard: () =>
    A.standard({
      question: ["Angles on a straight line.", A.figure(line)],
      ask: ["Work out ", A.math("x"), "."],
      answer: A.degrees(133),
      wrong: [
        { code: "GEO.ANGLES.STRAIGHT-LINE-360", value: A.degrees(313), feedback: "Use 180°." },
      ],
      solution: A.steps.angleSum({
        total: 180,
        reason: "Angles on a straight line add up to 180°.",
        known: [47],
        unknown: "x",
      }),
    }),
  "missing-value": () =>
    A.missingValue({ relation: [47, "+", 133, "=", 180], hide: 2, units: "°" }),
  reverse: () =>
    A.reverse({
      question: "A turn of 90° clockwise is repeated until it is back where it started.",
      ask: "How many turns?",
      answer: A.number(4),
    }),
  "varied-form": (r) =>
    A.variedForm({
      rng: r,
      answer: A.exact(frac(7, 12), "simplest"),
      forms: [
        { question: "Add a third and a quarter." },
        { question: [A.math("\\frac{1}{3} + \\frac{1}{4}")] },
      ],
    }),
  "match-representations": (r) =>
    A.matchRepresentations({
      rng: r,
      pairs: [
        ["acute", A.math("40^\\circ")],
        ["obtuse", A.math("130^\\circ")],
        ["reflex", A.math("250^\\circ")],
      ],
    }),
  "choose-the-diagram": (r) =>
    A.chooseTheDiagram({
      rng: r,
      question: "Which number line shows 3?",
      correct: { ...line, points: [{ value: 3 }] },
      distractors: [
        {
          figure: { ...line, points: [{ value: 4 }] },
          code: "NPV.OFF-BY-ONE",
          feedback: "Count the jumps.",
        },
      ],
    }),
  "draw-or-plot": () =>
    A.drawOrPlot({
      question: "Plot the point (2, 3).",
      target: {
        type: "cartesian",
        x: { min: 0, max: 5 },
        y: { min: 0, max: 5 },
        points: [{ at: [2, 3] }],
      },
      tolerance: 0.25,
    }),
  "spot-the-mistake": () =>
    A.spotTheMistake({
      question: "Find angle x.",
      lines: [[A.math("x + 47 = 180")], [A.math("x = 180 + 47")], [A.math("x = 227")]],
      mistake: 1,
      feedback: "Subtract 47, do not add it.",
    }),
  "explain-the-error": (r) =>
    A.explainTheError({
      rng: r,
      claim: "Sam says the angle is 313°.",
      correct: "He used 360° instead of 180°.",
      distractors: [
        { content: "He added instead of subtracting." },
        { content: "He read the wrong scale." },
      ],
    }),
  "always-sometimes-never": (r) =>
    A.alwaysSometimesNever({
      rng: r,
      claim: "A triangle has an obtuse angle.",
      truth: "sometimes",
      reasons: [
        { text: "Some triangles have one; none has two.", correct: true },
        { text: "Every triangle has one." },
        { text: "Angles in a triangle are all acute." },
      ],
    }),
  "true-or-false-why": (r) =>
    A.trueOrFalseWhy({
      rng: r,
      statement: "A square is a rectangle.",
      truth: true,
      reasons: [
        { text: "It has four right angles.", correct: true },
        { text: "Its sides are all equal." },
      ],
    }),
  "odd-one-out": (r) =>
    A.oddOneOut({
      rng: r,
      items: [
        { content: A.math("30^\\circ") },
        { content: A.math("60^\\circ") },
        { content: A.math("120^\\circ"), odd: true },
      ],
      reasons: [
        { text: "It is obtuse; the others are acute.", correct: true },
        { text: "It is the largest number." },
      ],
    }),
  "compare-methods": (r) =>
    A.compareMethods({
      rng: r,
      ask: "works",
      question: "Two students find the missing angle on a straight line.",
      methods: [
        { working: [A.math("180 - 47 = 133")], best: true },
        {
          working: [A.math("360 - 47 = 313")],
          best: false,
          code: "GEO.ANGLES.STRAIGHT-LINE-360",
          feedback: "Use 180°.",
        },
      ],
    }),
  "open-construction": () =>
    A.openConstruction({
      question: "Find two different angles that make a straight line.",
      inputs: ["number", "number"],
      describe: "Two different angles adding up to 180°.",
      check: () => true,
      exists: true,
      example: [A.math("100^\\circ"), " and ", A.math("80^\\circ")],
    }),
  "multi-step-context": () =>
    A.multiStepContext({
      context: "A ramp makes a 15° angle with the ground.",
      parts: [
        { ask: "What angle does it make with the wall?", answer: A.degrees(75) },
        { ask: "What is the angle on the other side of the ramp?", answer: A.degrees(165) },
      ],
    }),
};

describe("archetypes", () => {
  it("has an example for all 15", () => {
    expect(Object.keys(examples).sort()).toEqual([...ARCHETYPES].sort());
  });

  it.each(Object.entries(examples))(
    "%s builds a question defineGenerator accepts",
    (archetype, build) => {
      const draft = build(rng());
      expect(draft.archetype).toBe(archetype);
      const generator = defineGenerator({
        id: "Y5-GEO-04",
        version: "1.0.0",
        depths: [1],
        misconceptions: ["GEO.ANGLES.STRAIGHT-LINE-360", "NPV.OFF-BY-ONE"],
        params: () => ({}),
        build: () => build(createRng("build")),
      });
      const question = generator.generate({ depth: 1, numbers: "standard", seed: 1 });
      expect(question.parts.length).toBeGreaterThan(0);
      expect(JSON.parse(JSON.stringify(question))).toEqual(question);
    },
  );

  it("gives options neutral letter IDs and shuffles them reproducibly", () => {
    const ids = new Set<string>();
    for (let s = 0; s < 40; s++) {
      const q = examples["explain-the-error"]?.(createRng(`seed ${s}`));
      const answer = q?.parts[0]?.answer;
      if (answer?.type !== "choice") throw new Error("expected a choice");
      expect(answer.options.map((o) => o.id)).toEqual(["A", "B", "C"]);
      ids.add(answer.correct);
    }
    expect(ids).toEqual(new Set(["A", "B", "C"]));
  });

  it("collects figures into the question's diagrams", () => {
    const q = examples["choose-the-diagram"]?.(rng());
    expect(q?.diagrams).toHaveLength(2);
    const answer = q?.parts[0]?.answer;
    if (answer?.type !== "choice") throw new Error("expected a choice");
    expect(answer.options.flatMap((o) => o.content.map((n) => n.t))).toEqual([
      "diagram",
      "diagram",
    ]);
  });

  it("maps wrong options to misconceptions", () => {
    const q = examples["compare-methods"]?.(rng());
    const part = q?.parts[0];
    if (part?.answer.type !== "choice") throw new Error("expected a choice");
    const wrongId = part.misconceptions?.[0]?.answer;
    expect(wrongId).toEqual({
      type: "choice",
      id: part.answer.options.find((o) => o.id !== (part.answer as { correct: string }).correct)
        ?.id,
    });
  });

  it("writes missing-value relations with a box", () => {
    const q = examples["missing-value"]?.(rng());
    expect(q?.stem.find((n) => n.t === "math")).toEqual({
      t: "math",
      v: "47^\\circ + \\square = 180^\\circ",
      display: true,
    });
    expect(q?.parts[0]?.answer).toEqual({
      type: "number",
      value: 133,
      accuracy: { exact: true },
      units: "°",
    });
  });

  it("labels the parts of multi-step questions", () => {
    expect(examples["multi-step-context"]?.(rng()).parts.map((p) => p.label)).toEqual([
      "(a)",
      "(b)",
    ]);
  });

  it("rejects parameters when an open question has no solution", () => {
    expect(() =>
      A.openConstruction({
        question: "",
        inputs: ["number"],
        describe: "",
        check: () => true,
        exists: false,
      }),
    ).toThrow("no solution");
  });

  it("refuses badly set-up questions", () => {
    expect(() =>
      A.trueOrFalseWhy({
        rng: rng(),
        statement: "",
        truth: true,
        reasons: [{ text: "a" }, { text: "b" }],
      }),
    ).toThrow("exactly one correct reason");
    expect(() => A.oddOneOut({ rng: rng(), items: [{ content: "a" }], reasons: [] })).toThrow(
      "exactly one odd item",
    );
    expect(() => A.spotTheMistake({ question: "", lines: ["a"], mistake: 3 })).toThrow(
      "not one of the 1 lines",
    );
    expect(() => A.missingValue({ relation: [1, "+", 2], hide: 1 })).toThrow("not a value");
  });

  it("builds angle-sum working", () => {
    expect(
      A.steps.angleSum({
        total: 180,
        reason: "Angles in a triangle add up to 180°.",
        known: [50, 70],
        unknown: "x",
      })[1],
    ).toEqual({
      say: "Subtract the known angles.",
      math: "x = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ",
    });
    expect(
      A.steps.angleSum({ total: 180, reason: "", known: [40], unknown: "y", share: 2 })[2]?.math,
    ).toBe("y = 140^\\circ \\div 2 = 70^\\circ");
  });

  it("formats answers with their units", () => {
    expect(A.answerLatex(A.degrees(63))).toBe("63^\\circ");
    expect(A.answerLatex(A.number(8, { units: "cm" }))).toBe("8\\text{ cm}");
    expect(A.answerLatex(A.exact(frac(3, 4)))).toBe("\\frac{3}{4}");
    expect(A.sameValue(A.exact(frac(1, 2)), A.number(0.5))).toBe(true);
    expect(A.sameValue(A.degrees(63), A.degrees(64))).toBe(false);
  });
});

describe("choice", () => {
  it("marks a standard question by choice", () => {
    const q = A.choice({
      rng: rng(),
      question: "What type of angle is 120°?",
      correct: "obtuse",
      distractors: [
        { content: "acute" },
        {
          content: "reflex",
          code: "GEO.ANGLES.TYPE-CONFUSED",
          feedback: "Reflex angles are more than 180°.",
        },
      ],
    });
    expect(q.archetype).toBe("standard");
    const answer = q.parts[0]?.answer;
    if (answer?.type !== "choice") throw new Error("expected a choice");
    expect(answer.options).toHaveLength(3);
    expect(q.parts[0]?.misconceptions).toHaveLength(1);
  });
});
