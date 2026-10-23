/**
 * @statement GF-A11.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A11.a: Identify roots and intercepts of quadratics from a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid, poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";

export interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-A11.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.QUADRATIC.TURNING"],

  params(rng) {
    const a = rng.int(-5, 3);
    const b = a + 2 * rng.int(1, 3);
    const ty = -(((b - a) / 2) ** 2);
    if (a === 0 || b === 0 || ty < -8 || a * b > 8 || a * b < -8 || Math.abs(a) === Math.abs(b))
      reject("a parabola that fits the grid");
    if (!curveClearOfOrigin((x) => (x - a) * (x - b))) reject("a curve clear of the origin label");
    if (a * b === ty) reject("a y-intercept that is not the turning point");
    return { a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const eq = poly([1, -(p.a + p.b), p.a * p.b]);
    const fig = grid(8, [eq], [], "A U-shaped curve on a coordinate grid.");
    const roots = `x = ${p.a} \\text{ and } x = ${p.b}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["The graph of ", A.math(`y = ${eq}`), " is shown.", A.figure(fig)],
          ask: ["What are the roots of ", A.math(`${eq} = 0`), "?"],
          correct: A.math(roots),
          distractors: [
            {
              content: A.math(`x = ${-p.a} \\text{ and } x = ${-p.b}`),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "Read where the curve crosses the x-axis.",
            },
            {
              content: A.math(`x = ${(p.a + p.b) / 2}`),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "That is the line of symmetry. The roots are where y = 0.",
            },
          ].filter(distinctFrom(A.math(roots))),
          solution: [{ say: "The curve crosses the x-axis at ", math: roots }],
        });
      case 2: {
        const ty = -(((p.b - p.a) / 2) ** 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph of ", A.math(`y = ${eq}`), " is shown.", A.figure(fig)],
              ask: "Where does the curve cross the y-axis? Give the y-coordinate.",
            },
          ],
          answer: A.number(p.a * p.b),
          wrong: signedWrongs(p.a * p.b, [
            {
              code: "ALG.QUADRATIC.TURNING",
              value: A.number(ty),
              feedback:
                "That is the lowest point (the turning point). The y-intercept is where x = 0.",
            },
          ]),
          solution: [{ say: `At x = 0, y = ${p.a * p.b}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says the roots of ",
            A.math(
              `y = (x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)})(x ${p.b < 0 ? "+" : "-"} ${Math.abs(p.b)})`,
            ),
            ` are x = ${-p.a} and x = ${-p.b}.`,
          ],
          truth: false,
          reasons: [
            { text: `False. y = 0 when a bracket is 0: x = ${p.a} or x = ${p.b}.`, correct: true },
            {
              text: "True. The roots are the numbers in the brackets.",
              code: "ALG.QUADRATIC.ROOT-SIGN",
            },
            {
              text: "True. Roots are where the curve crosses the y-axis.",
              code: "ALG.QUADRATIC.TURNING",
            },
          ],
          solution: [{ say: `Check: x = ${p.a} makes the first bracket 0.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `x = ${p.a} \\text{ and } x = ${p.b}`;
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.b;
    return true;
  },
});
