/**
 * @statement GH-A16.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A16.b: Find the equation of a tangent to a circle at a given point
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

const TRIPLES = [
  [3, 4],
  [4, 3],
  [6, 8],
  [5, 12],
  [12, 5],
  [8, 6],
] as const;

interface Params {
  t: number;
  sx: number;
  sy: number;
}

const point = (p: Params) => {
  const [a, b] = TRIPLES[p.t] ?? [3, 4];
  return [a * p.sx, b * p.sy] as const;
};

export default defineGenerator<Params>({
  id: "GH-A16.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PERPENDICULAR.GRADIENT"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), sx: rng.pick([1, -1]), sy: rng.pick([1, -1]) };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b] = point(p);
    const r2 = a * a + b * b;
    const m = toLatex(frac(-a, b));
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The point ",
            A.math(coord([a, b])),
            " lies on the circle ",
            A.math(`x^2 + y^2 = ${r2}`),
            ".",
          ],
          ask: "Find the gradient of the tangent at that point.",
          answer: A.exact(m),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(toLatex(frac(b, a))),
              feedback:
                "That is the gradient of the radius. The tangent is perpendicular to it: use the negative reciprocal.",
            },
          ],
          solution: [
            {
              say: `The radius has gradient ${toLatex(frac(b, a))}; the tangent's gradient is the negative reciprocal, `,
              math: m,
            },
          ],
        });
      case 2: {
        const c = toLatex(frac(r2, b));
        const right = `y = ${m}x + ${c}`.replace("+ -", "- ");
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the equation of the tangent to ",
                A.math(`x^2 + y^2 = ${r2}`),
                " at ",
                A.math(coord([a, b])),
                ".",
              ],
              ask: "Give it in the form y = mx + c.",
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(`y = ${toLatex(frac(b, a))}x`),
              feedback:
                "That line is the radius, through the centre. The tangent is perpendicular to the radius.",
            },
          ],
          solution: [{ say: `Gradient ${m}, through (${a}, ${b}): `, math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Dee says the tangent to a circle at a point is parallel to the radius at that point.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. A tangent is perpendicular to the radius at the point where it touches, so the gradients multiply to −1.",
                  correct: true,
                },
                {
                  text: "True. Both lines go through the same point.",
                  code: "ALG.PERPENDICULAR.GRADIENT",
                },
                {
                  text: "True. A tangent has the same gradient as the radius.",
                  code: "ALG.PERPENDICULAR.GRADIENT",
                },
              ],
              solution: [{ say: "Radius and tangent meet at 90°." }],
            }),
          [
            {
              statement:
                "The radius to (3, 4) on $x^2 + y^2 = 25$ has gradient $\\frac{4}{3}$. Kai says the tangent there has gradient $-\\frac{3}{4}$.",
              truth: true,
              right: "True. The tangent is perpendicular to the radius.",
              wrong: [
                ["False. It is 4/3 too.", "ALG.PERPENDICULAR.GRADIENT"],
                ["False. It is −4/3.", "ALG.PERPENDICULAR.GRADIENT"],
              ],
            },
            {
              claim: "A tangent to a circle meets the radius at a right angle.",
              truth: "always",
              right: "Always. This is a circle theorem.",
              wrong: [
                ["Never. It is parallel to the radius.", "ALG.PERPENDICULAR.GRADIENT"],
                ["Sometimes. Only at the top of the circle."],
              ],
            },
            {
              statement:
                "The radius to a point has gradient 2. Pia says the tangent there has gradient −2.",
              truth: false,
              right: "False. The perpendicular gradient is −1/2.",
              wrong: [
                ["True. Change the sign.", "ALG.PERPENDICULAR.GRADIENT"],
                ["True. Perpendicular means opposite sign.", "ALG.PERPENDICULAR.GRADIENT"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const [a, b] = point(p);
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(-a, b));
    return true;
  },
});
