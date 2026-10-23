/**
 * @statement Y9-ALG-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-07.b: Use quadratic graphs to find approximate solutions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid, poly } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  d: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y9-ALG-07.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SOLUTION-Y", "ALG.QUADRATIC.ONE-ROOT"],

  params(rng) {
    const p = { k: rng.int(2, 5), d: rng.int(-7, 3) };
    if (Number.isInteger(Math.sqrt(1 + p.k))) reject("roots that need estimating");
    if (!curveClearOfOrigin((x) => x * x + 2 * x - p.k))
      reject("a curve clear of the origin label");
    if (p.d === -1 - p.k) reject("a line that is not tangent");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = poly([1, 2, -p.k]);
    const fig = A.figure(grid(8, [eq], [], "A U-shaped curve on a coordinate grid."));
    switch (depth) {
      case 1: {
        const v = r1(-1 + Math.sqrt(1 + p.k));
        return A.standard({
          question: ["The graph of ", A.math(`y = ${eq}`), " is drawn.", fig],
          ask: [
            "Use the graph to estimate the larger solution of ",
            A.math(`${eq} = 0`),
            ", to 1 decimal place.",
          ],
          answer: A.number(v, { accuracy: { tolerance: 0.2 } }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(p.k, { accuracy: { tolerance: 0.2 } }),
              feedback: `The solutions are where the curve crosses the x-axis (y = 0), not where it crosses the y-axis at −${p.k}.`,
            },
          ]),
          solution: [{ say: `The curve crosses the x-axis at about x = ${v}.` }],
        });
      }
      case 2: {
        const min = -1 - p.k;
        const v = p.d > min ? 2 : 0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph of ", A.math(`y = ${eq}`), " is drawn.", fig],
              ask: ["How many solutions does ", A.math(`${eq} = ${p.d}`), " have?"],
            },
          ],
          answer: A.number(v),
          wrong:
            v === 2
              ? [
                  {
                    code: "ALG.QUADRATIC.ONE-ROOT",
                    value: A.number(1),
                    feedback: `Draw the line y = ${p.d}: it crosses the U-shape twice.`,
                  },
                ]
              : [
                  {
                    code: "ALG.QUADRATIC.ONE-ROOT",
                    value: A.number(2),
                    feedback: `The lowest point of the curve is at y = ${min}, so the line y = ${p.d} misses it.`,
                  },
                ],
          solution: [
            {
              say: `The curve's lowest point is at y = ${min}. The line y = ${p.d} ${v === 2 ? "is above it, crossing twice" : "is below it, so never meets the curve"}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says every quadratic equation has two solutions, because a U-shaped graph always crosses the x-axis twice.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A U-shape whose lowest point is above the x-axis never crosses it (no solutions), and one that just touches it has one solution.",
              correct: true,
            },
            { text: "True. Quadratics always have two answers.", code: "ALG.QUADRATIC.ONE-ROOT" },
            { text: "True. The y-intercept counts as a solution.", code: "ALG.GRAPH.SOLUTION-Y" },
          ],
          solution: [{ say: "A quadratic equation can have 0, 1 or 2 solutions." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(-1 + Math.sqrt(1 + p.k));
    if (question.key.depth === 2) return numberAnswer(question) === (p.d > -1 - p.k ? 2 : 0);
    return true;
  },
});
