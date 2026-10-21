/**
 * @statement Y9-ALG-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-07: Use linear and quadratic graphs to estimate values of y for given x and vice versa, and
// find approximate solutions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { numberAnswer } from "../shared/counting.ts";
import { poly, signedWrongs } from "../shared/alg.ts";

interface Params {
  /** y = (x − r)(x − s), roots r < s. */
  r: number;
  s: number;
  /** Depth 1: read y at this x. */
  x: number;
}

const graph = (r: number, s: number): CartesianSpec => ({
  type: "cartesian",
  x: { min: -6, max: 6, step: 1 },
  y: { min: -10, max: 10, step: 2 },
  grid: true,
  curves: [{ y: `(x - ${r})*(x - ${s})`, domain: [-6, 6] }],
  description: "A U-shaped curve on a coordinate grid.",
});

export default defineGenerator<Params>({
  id: "Y9-ALG-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COORD.ORDER", "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    const r = rng.int(-4, 1);
    const s = rng.int(r + 2, 5);
    const x = rng.int(-5, 5);
    const y = (x - r) * (x - s);
    const vertex = -((s - r) ** 2) / 4;
    if (Math.abs(y) > 10 || vertex < -10 || r * s === 0 || x === y)
      reject("everything on the grid");
    // Keep the curve clear of the origin label, just below and left of the origin.
    const near = [-0.8, -0.6, -0.4, -0.2, 0].map((t) => (t - r) * (t - s));
    if (near.some((v) => v > -2 && v < 0.6)) reject("a curve clear of the origin label");
    return { r, s, x };
  },

  build(p, depth, rng): QuestionDraft {
    const quad = poly([1, -(p.r + p.s), p.r * p.s]);
    switch (depth) {
      case 1: {
        const y = (p.x - p.r) * (p.x - p.s);
        return A.standard({
          question: ["The graph shows ", A.math(`y = ${quad}`), ".", A.figure(graph(p.r, p.s))],
          ask: ["Use the graph to find y when ", A.math(`x = ${p.x}`), "."],
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.x),
              feedback: `Find ${p.x} on the x-axis, go up or down to the curve, then read across to the y-axis.`,
            },
          ]),
          solution: [
            {
              say: `From x = ${p.x}, go to the curve and read across: y = ${y}. Check: (${p.x} − ${p.r < 0 ? `(${p.r})` : p.r})(${p.x} − ${p.s}) = ${y}.`,
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: ["The graph shows ", A.math(`y = ${quad}`), ".", A.figure(graph(p.r, p.s))],
          ask: ["Use the graph to find the larger solution of ", A.math(`${quad} = 0`), "."],
          answer: A.number(p.s),
          wrong: signedWrongs(p.s, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.r * p.s),
              feedback:
                "The solutions are where the curve crosses the x-axis (y = 0), not where it crosses the y-axis.",
            },
          ]),
          solution: [
            {
              say: `The curve crosses the x-axis at x = ${p.r} and x = ${p.s}. The larger solution is ${p.s}.`,
            },
          ],
        });
      default: {
        const k = rng.int(2, 9);
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ade says ", A.math(`x^2 = ${k * k}`), ` has only one solution, x = ${k}.`],
          truth: false,
          reasons: [
            {
              text: `False. (−${k})² = ${k * k} too, so x = ${k} or x = −${k}. The graph of y = x² meets the line y = ${k * k} twice.`,
              correct: true,
            },
            {
              text: `True. (−${k})² = −${k * k}, so −${k} does not work.`,
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
            },
            { text: "True. Every equation has exactly one solution." },
          ],
          solution: [{ say: `x = ±${k}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === (p.x - p.r) * (p.x - p.s)
      : numberAnswer(question) === p.s;
  },
});
