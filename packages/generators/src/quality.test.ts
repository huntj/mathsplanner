import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { anglesOnLine } from "@mathsplanner/diagrams";
import { describe, expect, it } from "vitest";
import { checkQuality, qualityReport, type QualityCheck } from "./quality.ts";

interface P {
  a: number;
}

const good: GeneratorDefinition<P> = {
  id: "Y5-GEO-04",
  version: "1.0.0",
  depths: [1],
  misconceptions: ["GEO.ANGLES.STRAIGHT-LINE-360"],
  params: (rng) => ({ a: rng.int(20, 160) }),
  accept: ({ a }) => a !== 90,
  build: ({ a }): QuestionDraft => ({
    archetype: "standard",
    stem: [
      { t: "text", v: "Find x." },
      { t: "diagram", i: 0 },
    ],
    diagrams: [anglesOnLine([{ value: a }, { value: 180 - a, label: "x" }])],
    parts: [
      {
        prompt: [],
        answer: { type: "number", value: 180 - a, accuracy: { exact: true }, units: "°" },
        misconceptions: [
          {
            code: "GEO.ANGLES.STRAIGHT-LINE-360",
            answer: { type: "number", value: 360 - a },
            feedback: [],
          },
        ],
      },
    ],
    solution: [{ say: [{ t: "text", v: "Subtract from 180°." }] }],
  }),
  verify: ({ a }, q) => q.parts[0]?.answer.type === "number" && q.parts[0].answer.value + a === 180,
  bounds: { standard: { min: 20, max: 160, dp: 0 } },
};

const checksFailing = (def: GeneratorDefinition<P>) =>
  new Set<QualityCheck>(
    checkQuality(defineGenerator(def), { seeds: 20 }).failures.map((f) => f.check),
  );

describe("quality checks", () => {
  it("pass a good generator", () => {
    const result = checkQuality(defineGenerator(good), { seeds: 50 });
    expect(qualityReport("Y5-GEO-04", result)).toBe(
      "Y5-GEO-04: all checks passed across 150 questions.",
    );
  });

  it("catch generators that crash", () => {
    expect(
      checksFailing({
        ...good,
        build: () => {
          throw new Error("boom");
        },
      }),
    ).toEqual(new Set(["generates"]));
  });

  it("catch wrong answers through verify, and a missing verify", () => {
    expect(checksFailing({ ...good, verify: () => false })).toEqual(new Set(["verify"]));
    const noVerify = { ...good };
    delete noVerify.verify;
    expect(checksFailing(noVerify)).toEqual(new Set(["verify"]));
  });

  it("catch distractors that equal the answer", () => {
    expect(
      checksFailing({
        ...good,
        build: (p, d, r) => {
          const q = good.build(p, d, r);
          const part = q.parts[0];
          if (part?.misconceptions?.[0])
            part.misconceptions[0].answer = { type: "number", value: 180 - p.a };
          return q;
        },
      }),
    ).toEqual(new Set(["distractors"]));
  });

  it("catch answers outside the declared bounds", () => {
    expect(checksFailing({ ...good, bounds: { standard: { max: 30 } } })).toEqual(
      new Set(["niceness"]),
    );
  });

  it("catch diagrams that lie", () => {
    const lying: GeneratorDefinition<P> = {
      ...good,
      build: (p, d, r) => {
        const q = good.build(p, d, r);
        const spec = anglesOnLine([{ value: p.a }, { value: 180 - p.a, label: "x" }]);
        // State the wrong size for the first angle.
        q.diagrams = [
          {
            ...spec,
            angles: spec.angles?.map((a, i) => (i === 0 ? { ...a, value: p.a + 10 } : a)),
          },
        ];
        return q;
      },
    };
    expect(checksFailing(lying)).toEqual(new Set(["diagram truth", "renders"]));
  });

  it("catch bad LaTeX and missing solutions", () => {
    expect(
      checksFailing({
        ...good,
        build: (p, d, r) => ({
          ...good.build(p, d, r),
          stem: [{ t: "math", v: "\\frac{1}{" }],
          solution: [],
        }),
      }),
    ).toEqual(new Set(["renders", "solution"]));
  });

  it("catch misconception codes missing from the catalogue", () => {
    const result = checkQuality(
      defineGenerator({ ...good, misconceptions: ["GEO.NOT-A-REAL-CODE"] }),
      { seeds: 1 },
    );
    expect(result.failures.map((f) => f.check)).toContain("catalogue");
  });
});
