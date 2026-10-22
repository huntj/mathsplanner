/**
 * @statement GH-A16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A16: Use the equation of a circle centred at the origin; find the equation of a tangent at a
// given point
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  /** Depth 2: the point (x0, y0) on the circle, with y0 = ±1 or ±2 dividing x0. */
  x0: number;
  y0: number;
  /** Depth 4: a point that may or may not be on the circle. */
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "GH-A16",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.CIRCLE.RADIUS-SQUARED", "ALG.PERPENDICULAR.GRADIENT"],

  params(rng) {
    const b = rng.pick([1, 2]);
    const x0 = b * rng.int(2, 4) * rng.pick([1, -1]);
    const y0 = b * rng.pick([1, -1]);
    return { r: rng.int(3, 12), x0, y0, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A circle has equation ", A.math(`x^2 + y^2 = ${p.r * p.r}`), "."],
          ask: "What is its radius?",
          answer: A.number(p.r),
          wrong: [
            {
              code: "ALG.CIRCLE.RADIUS-SQUARED",
              value: A.number(p.r * p.r),
              feedback: `x² + y² = r², so r² = ${p.r * p.r} and r = ${p.r}.`,
            },
          ],
          solution: [{ say: `r² = ${p.r * p.r}, so r = √${p.r * p.r} = ${p.r}.` }],
        });
      case 2: {
        const r2 = p.x0 * p.x0 + p.y0 * p.y0;
        const m = -p.x0 / p.y0;
        const c = r2 / p.y0;
        const wm = p.x0 / p.y0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The point ",
                A.math(`(${p.x0}, ${p.y0})`),
                " lies on the circle ",
                A.math(`x^2 + y^2 = ${r2}`),
                ".",
              ],
              ask: "Find the equation of the tangent to the circle at this point.",
            },
            {
              question: [
                "Find the equation of the tangent to ",
                A.math(`x^2 + y^2 = ${r2}`),
                " at the point ",
                A.math(`(${p.x0}, ${p.y0})`),
                ".",
              ],
            },
          ],
          answer: A.exact(lineLatex(m, c)),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(lineLatex(wm, p.y0 - wm * p.x0)),
              feedback:
                "The tangent is perpendicular to the radius: use the negative reciprocal of the radius's gradient.",
            },
          ],
          solution: [
            {
              say: `The radius to (${p.x0}, ${p.y0}) has gradient ${p.y0}/${p.x0}, so the tangent has gradient ${m}.`,
            },
            {
              say: `Substitute the point: ${p.y0} = ${m} × ${p.x0} + c, so c = ${c}.`,
              math: lineLatex(m, c),
            },
          ],
        });
      }
      default: {
        const k = p.r * p.r;
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Ella says the circle ",
                A.math(`x^2 + y^2 = ${k}`),
                ` has its centre at the origin and radius ${p.r}.`,
              ]
            : ["Ella says the circle ", A.math(`x^2 + y^2 = ${k}`), ` has radius ${k}.`],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. x² + y² = r² is a circle centred at the origin, and r² = ${k} gives r = ${p.r}.`,
                  correct: true,
                },
                { text: `False. The radius is ${k}.`, code: "ALG.CIRCLE.RADIUS-SQUARED" },
                { text: `False. The radius is ${k / 2}.` },
              ]
            : [
                {
                  text: `False. The number on the right is r², so the radius is √${k} = ${p.r}.`,
                  correct: true,
                },
                {
                  text: "True. The radius is the number on the right.",
                  code: "ALG.CIRCLE.RADIUS-SQUARED",
                },
                { text: `False. The radius is ${k / 2}, half of ${k}.` },
              ],
          solution: [
            {
              say: `By Pythagoras, a point (x, y) at distance r from the origin satisfies x² + y² = r².`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.r;
    return true;
  },
});
