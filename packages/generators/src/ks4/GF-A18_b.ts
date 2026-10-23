/**
 * @statement GF-A18.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A18.b: Find approximate solutions of quadratics from a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid, poly, signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  b: number;
  d: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-A18.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SOLUTION-Y"],

  params(rng) {
    const p = { k: rng.int(2, 7), b: rng.int(-3, 3), d: rng.int(1, 5) };
    if (Number.isInteger(Math.sqrt(p.k)) || Number.isInteger(Math.sqrt(p.d + p.k)))
      reject("solutions that need estimating");
    if (p.b === 0) reject("a shifted curve at depth 2");
    const root = (c: number) => r1((-p.b + Math.sqrt(p.b * p.b + 4 * c)) / 2);
    if (Math.abs(root(p.k + p.d) - root(p.k)) < 0.5)
      reject("a misread root that marking can tell apart");
    if (
      !curveClearOfOrigin((x) => x * x - p.k) ||
      !curveClearOfOrigin((x) => x * x + p.b * x - p.k)
    )
      reject("curves clear of the origin label");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.sqrt(p.k));
        return A.standard({
          question: [
            "The graph of ",
            A.math(`y = x^2 - ${p.k}`),
            " is shown.",
            A.figure(grid(8, [`x^2 - ${p.k}`], [], "A U-shaped curve on a coordinate grid.")),
          ],
          ask: [
            "Use the graph to estimate the positive solution of ",
            A.math(`x^2 - ${p.k} = 0`),
            ", to 1 decimal place.",
          ],
          answer: A.number(v, { accuracy: { tolerance: 0.2 } }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(p.k, { accuracy: { tolerance: 0.2 } }),
              feedback: `The solutions are the x-values where the curve crosses y = 0, not the y-intercept ${-p.k}.`,
            },
          ]),
          solution: [{ say: `The curve crosses the x-axis at about x = ±${v}.` }],
        });
      }
      case 2: {
        // y = x² + bx − k, solve y = d: x² + bx − (k + d) = 0
        const c = p.k + p.d;
        const big = r1((-p.b + Math.sqrt(p.b * p.b + 4 * c)) / 2);
        const eq = poly([1, p.b, -p.k]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The graph of ",
                A.math(`y = ${eq}`),
                " is shown.",
                A.figure(grid(8, [eq], [], "A U-shaped curve on a coordinate grid.")),
              ],
              ask: [
                "Use the graph to estimate the larger solution of ",
                A.math(`${eq} = ${p.d}`),
                ", to 1 decimal place.",
              ],
            },
          ],
          answer: A.number(big, { accuracy: { tolerance: 0.2 } }),
          wrong: signedWrongs(big, [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(r1((-p.b + Math.sqrt(p.b * p.b + 4 * p.k)) / 2), {
                accuracy: { tolerance: 0.2 },
              }),
              feedback: `Read across from y = ${p.d}, not from y = 0.`,
            },
          ]),
          solution: [{ say: `Draw the line y = ${p.d}; it meets the curve at about x = ${big}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eve says ",
            A.math(`x^2 + ${p.k} = 0`),
            " has two solutions, because every U-shaped graph has two roots.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The graph of y = x² + ${p.k} has its lowest point at (0, ${p.k}), above the x-axis, so it never crosses it: there are no solutions.`,
              correct: true,
            },
            {
              text: "True. Every quadratic equation has two solutions.",
              code: "ALG.GRAPH.SOLUTION-Y",
            },
            { text: `True. The solutions are x = ±${p.k}.`, code: "ALG.GRAPH.SOLUTION-Y" },
          ],
          solution: [{ say: "x² is never negative, so x² + k > 0 for every x." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.sqrt(p.k));
    return true;
  },
});
