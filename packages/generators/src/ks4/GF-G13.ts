/**
 * @statement GF-G13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G13: Construct and interpret plans and elevations of 3D shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianPolygon, CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Stack heights: heights[row][col], row 0 at the front. */
  heights: number[][];
  claim: number;
}

const square = (x: number, y: number): Coord[] => [
  [x, y],
  [x + 1, y],
  [x + 1, y + 1],
  [x, y + 1],
];

/** The plan: one square per stack, labelled with its height. Row 0 (the front) is at the bottom. */
function plan(h: number[][]): CartesianSpec {
  const polygons: CartesianPolygon[] = [];
  h.forEach((row, r) =>
    row.forEach(
      (n, c) => n > 0 && polygons.push({ vertices: square(c + 1, r + 1), label: String(n) }),
    ),
  );
  const cols = Math.max(...h.map((r) => r.length));
  return {
    type: "cartesian",
    x: { min: 0, max: cols + 2, step: 1 },
    y: { min: 0, max: h.length + 2, step: 1 },
    grid: true,
    axes: false,
    polygons,
    description:
      "A plan view on squared paper: each square is a stack of cubes, labelled with how many cubes are in it.",
  };
}

/** An elevation: for each column, a stack of squares as tall as the tallest stack behind it. */
function elevation(tall: number[]): CartesianSpec {
  const polygons: CartesianPolygon[] = [];
  tall.forEach((n, c) => {
    for (let k = 0; k < n; k++) polygons.push({ vertices: square(c + 1, k + 1), shaded: true });
  });
  return {
    type: "cartesian",
    x: { min: 0, max: tall.length + 2, step: 1 },
    y: { min: 0, max: Math.max(...tall) + 2, step: 1 },
    grid: true,
    axes: false,
    polygons,
    description: "An elevation drawn on squared paper.",
  };
}

const front = (h: number[][]) => (h[0] ?? []).map((_, c) => Math.max(...h.map((r) => r[c] ?? 0)));
const side = (h: number[][]) => h.map((r) => Math.max(...r));
const top = (h: number[][]) => (h[0] ?? []).map((_, c) => h.filter((r) => (r[c] ?? 0) > 0).length);

export default defineGenerator<Params>({
  id: "GF-G13",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.PLAN.ELEVATION", "GEO.SOLIDS.VISIBLE-ONLY"],

  params(rng) {
    const rows = rng.int(2, 3);
    const cols = rng.int(2, 4);
    const heights = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => rng.int(1, 3)),
    );
    const f = front(heights);
    const s = side(heights);
    if (JSON.stringify(f) === JSON.stringify(s) || f.length === s.length)
      reject("front and side elevations that differ in width");
    return { heights, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.heights.flat().reduce((a, b) => a + b, 0);
    switch (depth) {
      case 1: {
        const visible = p.heights.flat().length;
        return A.standard({
          question: [
            "A solid is made from cubes. The plan shows how many cubes are in each stack.",
            A.figure(plan(p.heights)),
          ],
          ask: "How many cubes are in the solid?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "GEO.SOLIDS.VISIBLE-ONLY",
              value: A.number(visible),
              feedback: "Each number is the height of a stack: add them all.",
            },
          ]),
          solution: [{ say: `${p.heights.flat().join(" + ")} = ${total} cubes.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [
            "A solid is made from cubes. The plan shows how many cubes are in each stack; the front is at the bottom.",
            A.figure(plan(p.heights)),
            "Which drawing is the front elevation?",
          ],
          correct: elevation(front(p.heights)),
          distractors: [
            {
              figure: elevation(side(p.heights)),
              code: "GEO.PLAN.ELEVATION",
              feedback: "That is the view from the side.",
            },
            {
              figure: elevation(top(p.heights)),
              code: "GEO.PLAN.ELEVATION",
              feedback: "From the front, each column shows its tallest stack.",
            },
          ].filter((d) => JSON.stringify(d.figure) !== JSON.stringify(elevation(front(p.heights)))),
          solution: [
            {
              say: `From the front, each column is as tall as its tallest stack: ${front(p.heights).join(", ")}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            p.claim === 0
              ? "Ben says the plan of a solid is the view from the front."
              : "Ben says the front elevation shows the tallest stack in each column.",
          truth: p.claim === 1,
          reasons: [
            {
              text:
                p.claim === 1
                  ? "True. Looking from the front, a taller stack behind shows above a shorter one in front."
                  : "False. The plan is the view from above; elevations are views from the front and side.",
              correct: true,
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. Plan and elevation mean the same thing.`,
              code: "GEO.PLAN.ELEVATION",
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. You only see the front row from the front.`,
              code: "GEO.SOLIDS.VISIBLE-ONLY",
            },
          ],
          solution: [
            {
              say: "Plan: from above. Front elevation: from the front. Side elevation: from the side.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === p.heights.flat().reduce((a, b) => a + b, 0);
    if (question.archetype === "choose-the-diagram")
      return JSON.stringify(chosenFigure(question)) === JSON.stringify(elevation(front(p.heights)));
    return true;
  },
});
