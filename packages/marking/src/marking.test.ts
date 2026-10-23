import type { AnswerSpec, Misconception, Part } from "@mathsplanner/core";
import { beforeAll, describe, expect, it } from "vitest";
import { equivalent, formProblem } from "./exact.ts";
import { markPart } from "./mark.ts";
import { loadEquivalence } from "./exact.ts";
import { judgeNumber, parseNumber } from "./number.ts";

const part = (answer: AnswerSpec, misconceptions: Misconception[] = [], marks = 1): Part => ({
  prompt: [],
  answer,
  marks,
  misconceptions,
});

beforeAll(loadEquivalence);

describe("parseNumber", () => {
  it.each([
    ["65", 65],
    ["65°", 65],
    [" -3.5 ", -3.5],
    ["−3.5", -3.5],
    ["1,000", 1000],
    ["1 000", 1000],
    ["3/4", 0.75],
    ["2.5 cm", 2.5],
    [".5", 0.5],
  ])("reads %j as %d", (text, value) => expect(parseNumber(text)).toBe(value));

  it.each(["", "abc", "3/0", "1.2.3", "--4"])("rejects %j", (text) =>
    expect(parseNumber(text)).toBeUndefined(),
  );
});

describe("judgeNumber", () => {
  it("checks exact values, tolerances, decimal places and significant figures", () => {
    expect(judgeNumber(0.1 + 0.2, 0.3, { exact: true })).toBe("right");
    expect(judgeNumber(41, 40, { tolerance: 1 })).toBe("right");
    expect(judgeNumber(42, 40, { tolerance: 1 })).toBe("wrong");
    expect(judgeNumber(3.14, 3.14159, { dp: 2 })).toBe("right");
    expect(judgeNumber(3.1416, 3.14159, { dp: 2 })).toBe("unrounded");
    expect(judgeNumber(3.15, 3.14159, { dp: 2 })).toBe("wrong");
    expect(judgeNumber(1200, 1234, { sf: 2 })).toBe("right");
    expect(judgeNumber(1234, 1234.4, { sf: 2 })).toBe("unrounded");
  });
});

describe("exact answers", () => {
  it("accepts equivalent values and expressions", () => {
    expect(equivalent("0.75", "\\frac{3}{4}")).toBe(true);
    expect(equivalent("\\frac{6}{8}", "\\frac{3}{4}")).toBe(true);
    expect(equivalent("\\sqrt{12}", "2\\sqrt{3}")).toBe(true);
    expect(equivalent("2x+6", "2(x+3)")).toBe(true);
    expect(equivalent("x^2+3x+2", "(x+1)(x+2)")).toBe(true);
    expect(equivalent("y=1+2x", "y=2x+1")).toBe(true);
    expect(equivalent("2x+5", "2(x+3)")).toBe(false);
    expect(equivalent("x+", "x")).toBeUndefined();
  });

  it("reads a number before e as a multiple of e, not scientific notation", () => {
    expect(equivalent("9e - 24", "65e - 24")).toBe(false);
    expect(equivalent("9e-24", "9e - 24")).toBe(true);
    expect(equivalent("2e+1", "e+e+1")).toBe(true);
  });

  it("keeps a command apart from the letter after it", () => {
    expect(equivalent("e^{2}", "e\\times e")).toBe(true);
    expect(equivalent("\\pi r^2", "r^2\\pi")).toBe(true);
    expect(equivalent("\\sin x", "\\sin(x)")).toBe(true);
  });

  it("enforces required forms", () => {
    expect(formProblem("\\frac{3}{4}", "simplest")).toBeUndefined();
    expect(formProblem("\\frac{6}{8}", "simplest")).toMatch(/simplify/i);
    expect(formProblem("1\\frac{1}{2}", "mixed-number")).toBeUndefined();
    expect(formProblem("\\frac{3}{2}", "mixed-number")).toMatch(/mixed number/);
    expect(formProblem("\\frac{3}{2}", "improper")).toBeUndefined();
    expect(formProblem("3.2\\times10^{4}", "standard-form")).toBeUndefined();
    expect(formProblem("32\\times10^{3}", "standard-form")).toMatch(/at least 1/);
    expect(formProblem("2\\sqrt{3}", "surd")).toBeUndefined();
    expect(formProblem("\\sqrt{12}", "surd")).toMatch(/square factors/);
    expect(formProblem("2(x+3)", "factorised")).toBeUndefined();
    expect(formProblem("2x+6", "factorised")).toMatch(/factorised/);
    expect(formProblem("2x+6", "expanded")).toBeUndefined();
    expect(formProblem("2(x+3)", "expanded")).toMatch(/Expand/);
    expect(formProblem("0.75", "decimal")).toBeUndefined();
  });

  it("asks for like terms to be collected and for full factorisation", () => {
    expect(formProblem("5x - 4y", "collected")).toBeUndefined();
    expect(formProblem("3x + 2y - x", "collected")).toMatch(/like terms/);
    expect(formProblem("3ab + 2ba", "collected")).toMatch(/like terms/);
    expect(formProblem("x^2 + 3x", "collected")).toBeUndefined();
    expect(formProblem("x^2 + 5x + 3x + 15", "expanded")).toMatch(/like terms/);
    expect(formProblem("x^2 + 8x + 15", "expanded")).toBeUndefined();
    expect(formProblem("2(4x + 6)", "factorised")).toMatch(/common factor/);
    expect(formProblem("4(2x + 3)", "factorised")).toBeUndefined();
    expect(formProblem("x(3x + 6x^2)", "factorised")).toMatch(/common factor/);
    expect(formProblem("3x(1 + 2x)", "factorised")).toBeUndefined();
    expect(formProblem("(x + 2)(x + 3)", "factorised")).toBeUndefined();
    expect(formProblem("(x - 4)(x + 4)", "factorised")).toBeUndefined();
  });

  it("gives a wrong-form result for a right value in the wrong form", () => {
    const p = part({ type: "exact", value: "\\frac{3}{4}", form: "simplest" });
    expect(markPart(p, { type: "exact", latex: "\\frac{3}{4}" }).status).toBe("correct");
    expect(markPart(p, { type: "exact", latex: "\\frac{6}{8}" }).status).toBe("wrong-form");
    expect(markPart(p, { type: "exact", latex: "\\frac{1}{4}" }).status).toBe("incorrect");
    expect(markPart(p, { type: "exact", latex: "\\frac{3}{" }).status).toBe("invalid");
  });
});

describe("markPart", () => {
  const wrong40: Misconception = {
    code: "GEO.ANGLES.ADDS-KNOWN",
    answer: { type: "number", value: 220 },
    feedback: [{ t: "text", v: "Subtract." }],
  };

  it("marks numbers and spots misconceptions", () => {
    const p = part({ type: "number", value: 40, accuracy: { exact: true } }, [wrong40]);
    expect(markPart(p, { type: "number", value: 40 })).toEqual({
      status: "correct",
      score: 1,
      marks: 1,
    });
    expect(markPart(p, { type: "number", value: 220 }).misconception?.code).toBe(
      "GEO.ANGLES.ADDS-KNOWN",
    );
    expect(markPart(p, { type: "number", value: 41 }).misconception).toBeUndefined();
    expect(markPart(p, undefined).status).toBe("unanswered");
    expect(markPart(p, { type: "choice", id: "A" }).status).toBe("invalid");
  });

  it("gives half marks for the right choice or the right reason alone", () => {
    const p = part(
      {
        type: "choice-with-reason",
        options: [
          { id: "T", content: [] },
          { id: "F", content: [] },
        ],
        correct: "F",
        reasons: [
          { id: "RA", content: [] },
          { id: "RB", content: [] },
        ],
        correctReason: "RA",
      },
      [{ code: "GEO.SYMMETRY.DIAGONAL", answer: { type: "choice", id: "RB" }, feedback: [] }],
      2,
    );
    expect(markPart(p, { type: "choice-with-reason", id: "F", reason: "RA" }).score).toBe(2);
    const half = markPart(p, { type: "choice-with-reason", id: "F", reason: "RB" });
    expect(half).toMatchObject({ status: "partial", score: 1 });
    expect(half.misconception?.code).toBe("GEO.SYMMETRY.DIAGONAL");
    expect(markPart(p, { type: "choice-with-reason", id: "T", reason: "RB" }).score).toBe(0);
  });

  it("marks match, order and multi-select answers", () => {
    const options = ["A", "B", "C"].map((id) => ({ id, content: [] }));
    const match = part({
      type: "match",
      left: options,
      right: options,
      correct: [
        ["A", "B"],
        ["B", "C"],
        ["C", "A"],
      ],
    });
    expect(
      markPart(match, {
        type: "match",
        pairs: [
          ["C", "A"],
          ["A", "B"],
          ["B", "C"],
        ],
      }).status,
    ).toBe("correct");
    expect(
      markPart(match, {
        type: "match",
        pairs: [
          ["A", "C"],
          ["B", "B"],
          ["C", "A"],
        ],
      }).status,
    ).toBe("incorrect");

    const order = part({ type: "order", options, correct: ["B", "A", "C"] });
    expect(markPart(order, { type: "order", ids: ["B", "A", "C"] }).status).toBe("correct");
    expect(markPart(order, { type: "order", ids: ["A", "B", "C"] }).status).toBe("incorrect");

    const multi = part(
      { type: "multi-select", options, correct: ["A", "C"], partialCredit: true },
      [],
      2,
    );
    expect(markPart(multi, { type: "choices", ids: ["C", "A"] }).score).toBe(2);
    expect(markPart(multi, { type: "choices", ids: ["A"] })).toMatchObject({
      status: "partial",
      score: 1,
    });
    expect(markPart(multi, { type: "choices", ids: ["A", "B"] }).score).toBe(0);
  });

  it("marks coordinates and plotted points within tolerance", () => {
    const c = part({ type: "coordinate", x: "3", y: "-2", tolerance: 0.1 });
    expect(markPart(c, { type: "coordinate", x: "3.05", y: "-2" }).status).toBe("correct");
    expect(markPart(c, { type: "coordinate", x: "-2", y: "3" }).status).toBe("incorrect");

    const plot = part({
      type: "plot",
      target: { type: "geometry", points: { A: [0, 0], B: [4, 0], C: [1.5, 2.5] } },
      tolerance: 0.2,
      place: ["C"],
    });
    expect(markPart(plot, { type: "points", points: { C: [1.6, 2.4] } }).status).toBe("correct");
    expect(markPart(plot, { type: "points", points: { C: [2, 2] } }).status).toBe("incorrect");

    const protractor = part({
      type: "plot",
      target: { type: "measure", instrument: "protractor", angle: 50, baseline: "left" },
      tolerance: 2,
      place: ["arm"],
    });
    const at = (deg: number): [number, number] => [
      Math.cos((deg * Math.PI) / 180),
      Math.sin((deg * Math.PI) / 180),
    ];
    expect(markPart(protractor, { type: "points", points: { arm: at(131) } }).status).toBe(
      "correct",
    );
    expect(markPart(protractor, { type: "points", points: { arm: at(50) } }).status).toBe(
      "incorrect",
    );
  });

  it("uses a validator for condition parts and leaves free text unmarked", () => {
    const p = part({ type: "condition", inputs: ["number", "number"], describe: [] });
    const sum180 = (values: readonly { type: string; value?: number }[]) =>
      values.reduce((s, v) => s + (v.value ?? 0), 0) === 180;
    const response = {
      type: "values" as const,
      values: [
        { type: "number" as const, value: 100 },
        { type: "number" as const, value: 80 },
      ],
    };
    expect(markPart(p, response, sum180).status).toBe("correct");
    expect(markPart(p, response).status).toBe("unmarked");
    expect(
      markPart(part({ type: "free-text", markScheme: [] }), { type: "text", text: "because" })
        .status,
    ).toBe("unmarked");
  });
});
