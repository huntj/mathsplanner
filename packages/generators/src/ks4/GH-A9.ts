/**
 * @statement GH-A9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A9: Identify perpendicular lines from their equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, poly } from "../shared/alg.ts";

interface Params {
  /** Depth 1: a gradient m = top/bottom. */
  top: number;
  bottom: number;
  c: number;
  /** Depth 2: a line of gradient 1/k (sign s), and a point on the perpendicular. */
  k: number;
  sign: 1 | -1;
  x0: number;
  y0: number;
  claimTrue: boolean;
}

/** A gradient as LaTeX, e.g. -\frac{2}{3}. */
const grad = (n: number, d: number) => toLatex(frac(n, d));

export default defineGenerator<Params>({
  id: "GH-A9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PERPENDICULAR.GRADIENT"],

  params(rng) {
    const top = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const bottom = rng.pick([1, 2, 3]);
    const k = rng.int(2, 5);
    if (Math.abs(top) === bottom || (bottom !== 1 && Math.abs(top) % bottom === 0))
      reject("a gradient in lowest terms, not ±1");
    return {
      top,
      bottom,
      c: rng.int(-6, 6),
      k,
      sign: rng.pick([1, -1] as const),
      x0: rng.int(-4, 4),
      y0: rng.int(-6, 6),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const m = grad(p.top, p.bottom);
        const line =
          `y = ${m === "1" ? "" : m}x ${p.c === 0 ? "" : p.c < 0 ? `- ${-p.c}` : `+ ${p.c}`}`.trim();
        return A.standard({
          question: ["Line L has equation ", A.math(line), "."],
          ask: "What is the gradient of a line perpendicular to L?",
          answer: A.exact(frac(-p.bottom, p.top)),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(frac(-p.top, p.bottom)),
              feedback:
                "Change the sign and also take the reciprocal: the two gradients multiply to −1.",
            },
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(frac(p.bottom, p.top)),
              feedback: "Take the reciprocal and also change the sign.",
            },
          ],
          solution: [
            {
              say: "The negative reciprocal of ",
              math: `${m} \\text{ is } ${toLatex(frac(-p.bottom, p.top))}`,
            },
          ],
        });
      }
      case 2: {
        const perp = -p.sign * p.k;
        const c = p.y0 - perp * p.x0;
        const given = `y = ${p.sign < 0 ? "-" : ""}\\frac{1}{${p.k}}x + 1`;
        const wrongM = p.sign * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the equation of the line perpendicular to ",
                A.math(given),
                " that passes through ",
                A.math(`(${p.x0}, ${p.y0})`),
                ".",
              ],
            },
            {
              question: [
                "Line L passes through ",
                A.math(`(${p.x0}, ${p.y0})`),
                " and is perpendicular to ",
                A.math(given),
                ".",
              ],
              ask: "Find the equation of L.",
            },
          ],
          answer: A.exact(lineLatex(perp, c)),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(lineLatex(wrongM, p.y0 - wrongM * p.x0)),
              feedback: `The perpendicular gradient is the negative reciprocal: ${perp}.`,
            },
          ],
          solution: [
            {
              say: `Perpendicular gradient: ${perp}. Substitute (${p.x0}, ${p.y0}): ${p.y0} = ${perp} × ${p.x0} + c, so c = ${c}.`,
            },
            { say: "", math: lineLatex(perp, c) },
          ],
        });
      }
      default: {
        const m = p.k;
        const other = p.claimTrue ? `-\\frac{1}{${m}}` : `-${m}`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says the lines ",
            A.math(`y = ${poly([m, 1])}`),
            " and ",
            A.math(`y = ${other}x + 4`),
            " are perpendicular.",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${m} × (−1/${m}) = −1.`, correct: true },
                {
                  text: "False. Perpendicular lines have opposite gradients.",
                  code: "ALG.PERPENDICULAR.GRADIENT",
                },
                { text: "False. They have different y-intercepts." },
              ]
            : [
                {
                  text: `False. ${m} × (−${m}) = −${m * m}, not −1. The perpendicular gradient is −1/${m}.`,
                  correct: true,
                },
                {
                  text: "True. The gradients have opposite signs.",
                  code: "ALG.PERPENDICULAR.GRADIENT",
                },
                { text: "True. The lines cross, so they are perpendicular." },
              ],
          solution: [{ say: "Two lines are perpendicular when their gradients multiply to −1." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(frac(-p.bottom, p.top));
    return true;
  },
});
