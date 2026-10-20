/**
 * @statement Y3-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y3-GEO-02: Recognise angles as a property of shape or a description of a turn
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { regularPolygon, shape, type ShapeKind } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";

interface Params {
  /** A shape to count the angles of: a named kind or a regular polygon with this many sides. */
  kind: ShapeKind | number;
  rotation: number;
  /** A minute-hand turn, in hours on the clock face: start and end. */
  from: number;
  quarters: 1 | 2 | 3;
  claim: number;
}

const sidesOf = (k: ShapeKind | number) =>
  typeof k === "number"
    ? k
    : ["equilateral", "isosceles", "scalene", "right-angled"].includes(k)
      ? 3
      : 4;
const nameOf = (k: ShapeKind | number) =>
  typeof k === "number"
    ? ({ 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon" }[k] ?? "shape")
    : ["equilateral", "isosceles", "scalene", "right-angled"].includes(k)
      ? "triangle"
      : k === "square" || k === "rectangle"
        ? k
        : "four-sided shape";

const CLAIMS = [
  {
    statement: "A shape with 5 straight sides has 5 angles.",
    truth: true,
    reasons: [
      {
        text: "Every corner, where two sides meet, makes an angle, and there are as many corners as sides.",
        correct: true,
      },
      { text: "Angles only count if they are right angles." },
      {
        text: "It has 10 angles: one at each end of each side.",
        code: "GEO.SHAPES.SIDES-VERTICES",
      },
    ],
  },
  {
    statement: "A circle has angles.",
    truth: false,
    reasons: [
      {
        text: "A circle has no straight sides and no corners, so it has no angles.",
        correct: true,
      },
      { text: "A circle is a whole turn, so it has a 360° angle." },
      { text: "It has 4 angles, like a square." },
    ],
  },
];

export default defineGenerator<Params>({
  id: "Y3-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SHAPES.SIDES-VERTICES", "GEO.TURNS.FRACTION"],

  params(rng, numbers) {
    const kinds: (ShapeKind | number)[] = {
      friendly: ["square", "rectangle", "equilateral", "isosceles"] as ShapeKind[],
      standard: ["kite", "parallelogram", "scalene", 5, 6] as (ShapeKind | number)[],
      stretch: [5, 6, 7, 8, "trapezium"] as (ShapeKind | number)[],
    }[numbers];
    return {
      kind: rng.pick(kinds),
      rotation: rng.int(0, 80),
      from: rng.pick([12, 3, 6, 9]),
      quarters: numbers === "friendly" ? rng.pick([1, 2] as const) : rng.pick([1, 2, 3] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = sidesOf(p.kind);
        const figure =
          typeof p.kind === "number"
            ? regularPolygon(p.kind)
            : shape(p.kind, { rotation: p.rotation });
        return A.standard({
          question: [`Here is a ${nameOf(p.kind)}.`, A.figure(figure)],
          ask: "How many angles does it have inside it?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "GEO.SHAPES.SIDES-VERTICES",
              value: A.number(2 * n),
              feedback: "Each corner is one angle; count each corner once.",
            },
          ]),
          solution: [
            {
              say: `There is an angle at every corner, where two sides meet. It has ${n} corners, so ${n} angles.`,
            },
          ],
        });
      }
      case 2: {
        const to = ((p.from + 3 * p.quarters - 1) % 12) + 1;
        const fraction = ["", "a quarter", "a half", "three quarters"][p.quarters] ?? "";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `The minute hand of a clock turns clockwise from ${p.from} to ${to}.`,
          ask: "What fraction of a whole turn is that?",
          correct: `${fraction[0]?.toUpperCase()}${fraction.slice(1)} of a turn`,
          distractors: [1, 2, 3]
            .filter((q) => q !== p.quarters)
            .map((q) => ({
              content: `${["", "A quarter", "A half", "Three quarters"][q]} of a turn`,
              code: "GEO.TURNS.FRACTION",
              feedback: "Each quarter turn moves the hand on by 3 numbers.",
            })),
          solution: [
            {
              say: `From ${p.from} to ${to} is ${3 * p.quarters} numbers on the clock. Each quarter turn is 3 numbers, so it is ${fraction} of a turn.`,
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? CLAIMS[0];
        return A.trueOrFalseWhy({
          rng,
          statement: c?.statement ?? "",
          truth: c?.truth ?? true,
          reasons: c?.reasons ?? [],
          solution: [{ say: c?.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    // A polygon has as many angles as sides: count the vertices of the drawn polygon.
    if (answer?.type === "number") {
      const polygon = question.diagrams[0]?.polygons as { vertices: string[] }[] | undefined;
      return polygon?.[0]?.vertices.length === answer.value;
    }
    return p.quarters >= 1;
  },
});
