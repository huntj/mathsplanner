/**
 * @statement GF-A11.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A11.b: Identify turning points from a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid, poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  a: number;
  b: number;
  r: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "GF-A11.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.TURNING"],

  params(rng) {
    const a = rng.int(-5, 3);
    const b = a + 2 * rng.int(1, 3);
    const ty = -(((b - a) / 2) ** 2);
    const p = { a, b, r: rng.int(-8, 4), s: 0 };
    p.s = p.r + 2 * rng.int(2, 6);
    if (a === 0 || b === 0 || ty < -8 || Math.abs(a * b) > 8 || Math.abs(a) === Math.abs(b))
      reject("a parabola that fits the grid");
    if (!curveClearOfOrigin((x) => (x - a) * (x - b))) reject("a curve clear of the origin label");
    if (p.r + p.s === 0) reject("a turning point off the y-axis");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = poly([1, -(p.a + p.b), p.a * p.b]);
    const tx = (p.a + p.b) / 2;
    const ty = (tx - p.a) * (tx - p.b);
    switch (depth) {
      case 1: {
        const right = coord([tx, ty]);
        return A.choice({
          rng,
          question: [
            "The graph of ",
            A.math(`y = ${eq}`),
            " is shown.",
            A.figure(grid(8, [eq], [], "A U-shaped curve on a coordinate grid.")),
          ],
          ask: "What are the coordinates of the turning point?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([0, p.a * p.b])),
              code: "ALG.QUADRATIC.TURNING",
              feedback:
                "That is the y-intercept. The turning point is the lowest point of the curve.",
            },
            {
              content: A.math(coord([ty, tx])),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "Give x first, then y.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "The lowest point of the curve is ", math: right }],
        });
      }
      case 2: {
        const v = (p.r + p.s) / 2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A quadratic curve crosses the x-axis at x = ${p.r} and x = ${p.s}.`],
              ask: "What is the x-coordinate of its turning point?",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.QUADRATIC.TURNING",
              value: A.number(p.r + p.s),
              feedback: "The turning point is halfway between the roots: add them and halve.",
            },
          ]),
          solution: [
            {
              say: `The curve is symmetrical, so the turning point is halfway between ${p.r} and ${p.s}: x = ${v}.`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The turning point of ", A.math("y = x^2 + bx + c"), " lies on the y-axis."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. The turning point is at x = −b/2, so it is on the y-axis only when b = 0, e.g. y = x² − 4.",
              correct: true,
            },
            { text: "Always. The turning point is where x = 0.", code: "ALG.QUADRATIC.TURNING" },
            {
              text: "Never. Turning points are always on the x-axis.",
              code: "ALG.QUADRATIC.TURNING",
            },
          ],
          solution: [
            {
              say: "Compare y = x² − 4 (turning point (0, −4)) with y = x² − 4x (turning point (2, −4)).",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === (p.r + p.s) / 2;
    if (question.key.depth === 1) {
      const tx = (p.a + p.b) / 2;
      return chosenText(question) === coord([tx, (tx - p.a) * (tx - p.b)]);
    }
    return true;
  },
});
