/**
 * @statement GH-A22.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A22.a: Solve linear inequalities in two variables and show the region
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  /** Region: x ≥ a, y ≥ b, x + y ≤ s. */
  a: number;
  b: number;
  s: number;
  pts: [number, number][];
}

const inside = (p: Params, [x, y]: [number, number]) => x >= p.a && y >= p.b && x + y <= p.s;

function region(p: Params): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: -6, max: 6, step: 1 },
    y: { min: -6, max: 6, step: 1 },
    grid: true,
    polygons: [
      {
        vertices: [
          [p.a, p.b],
          [p.s - p.b, p.b],
          [p.a, p.s - p.a],
        ],
        shaded: true,
      },
    ],
    description: "A shaded triangular region on a coordinate grid.",
  };
}

export default defineGenerator<Params>({
  id: "GH-A22.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.FLIP"],

  params(rng) {
    const p = {
      a: rng.int(-4, 0),
      b: rng.int(-4, 0),
      s: rng.int(2, 5),
      pts: [0, 1, 2].map((): [number, number] => [rng.int(-5, 5), rng.int(-5, 5)]),
    };
    if (p.s - p.a - p.b < 4) reject("a region big enough to see");
    if (p.s - p.a > 6 || p.s - p.b > 6) reject("corners inside the axes");
    if (
      p.pts.filter((q) => inside(p, q)).length !== 1 ||
      new Set(p.pts.map((q) => q.join())).size < 3
    )
      reject("exactly one point in the region");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const right = `x \\ge ${p.a}, \\; y \\ge ${p.b}, \\; x + y \\le ${p.s}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which inequalities describe the shaded region?", A.figure(region(p))],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x \\le ${p.a}, \\; y \\ge ${p.b}, \\; x + y \\le ${p.s}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `The region is to the right of x = ${p.a}: x ≥ ${p.a}.`,
            },
            {
              content: A.math(`x \\ge ${p.a}, \\; y \\ge ${p.b}, \\; x + y \\ge ${p.s}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `The region is below the line x + y = ${p.s}.`,
            },
          ],
          solution: [
            {
              say: "Right of the vertical line, above the horizontal line and below the sloping line: ",
              math: right,
            },
          ],
        });
      case 2: {
        const good = p.pts.find((q) => inside(p, q)) ?? [0, 0];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["A region is defined by ", A.math(right), "."],
          ask: "Which point is in the region?",
          correct: A.math(coord(good)),
          distractors: p.pts
            .filter((q) => !inside(p, q))
            .map((q) => ({
              content: A.math(coord(q)),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `Test ${coord(q)} in all three inequalities.`,
            })),
          solution: [{ say: `${coord(good)} satisfies all three.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ali says the boundary line for ",
            A.math(`x + y < ${p.s}`),
            " should be drawn solid.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Points on x + y = ${p.s} are not included in a strict inequality, so the line is dashed.`,
              correct: true,
            },
            { text: "True. All boundary lines are solid.", code: "ALG.INEQUALITY.FLIP" },
            { text: "True. Solid lines are for < and >.", code: "ALG.INEQUALITY.FLIP" },
          ],
          solution: [{ say: "Solid for ≤ and ≥; dashed for < and >." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `x \\ge ${p.a}, \\; y \\ge ${p.b}, \\; x + y \\le ${p.s}`;
    return true;
  },
});
