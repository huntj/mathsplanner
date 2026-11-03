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
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  r: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "GF-A11.b",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["The turning point of ", A.math("y = x^2 + bx + c"), " lies on the y-axis."],
              truth: "sometimes",
              reasons: [
                {
                  text: "Sometimes. The turning point is at x = −b/2, so it is on the y-axis only when b = 0, e.g. y = x² − 4.",
                  correct: true,
                },
                {
                  text: "Always. The turning point is where x = 0.",
                  code: "ALG.QUADRATIC.TURNING",
                },
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
            }),
          [
            {
              statement: "Bea says the turning point of $y = x^2 - 4$ is (0, −4).",
              truth: true,
              right: "True. x² is smallest at x = 0, giving y = −4.",
              wrong: [["False. It is (−4, 0).", "ALG.QUADRATIC.TURNING"], ["False. It is (2, 0)."]],
            },
            {
              claim: "The graph of $y = x^2 + c$ is symmetrical about the y-axis.",
              truth: "always",
              right: "Always. x and −x give the same y.",
              wrong: [
                ["Never. It leans to one side.", "ALG.QUADRATIC.TURNING"],
                ["Sometimes. Only if c = 0."],
              ],
            },
            {
              statement: "Dev says the turning point of $y = (x - 3)^2$ is at x = −3.",
              truth: false,
              right: "False. (x − 3)² is smallest, 0, when x = 3.",
              wrong: [
                ["True. The minus moves it left.", "ALG.QUADRATIC.TURNING"],
                ["True. It is at the y-intercept."],
              ],
            },
          ],
        );
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
