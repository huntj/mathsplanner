/**
 * @statement FM-CP-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-07: Find the nth roots of a complex number and solve zⁿ = w geometrically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.ROOTS", "NPV.INDEX.FRACTIONAL"],

  params(rng) {
    return { k: rng.int(2, 3), n: rng.int(3, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const R = p.k ** p.n;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The equation ",
            A.math(`z^${p.n} = ${R}i`),
            " has roots on a circle in the Argand diagram.",
          ],
          ask: "What is the radius of the circle?",
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "NPV.INDEX.FRACTIONAL",
              value: A.number(R / p.n),
              feedback: `Each root has modulus ${R}^(1/${p.n}), the ${p.n}th root of ${R}.`,
            },
          ]),
          solution: [{ say: `|z|^${p.n} = ${R}, so |z| = ${p.k}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The roots of ",
                A.math(`z^${p.n} = ${R}`),
                " form a regular polygon in the Argand diagram.",
              ],
              ask: "What is the angle between neighbouring roots, in radians?",
            },
          ],
          answer: A.exact(`\\frac{2\\pi}{${p.n}}`),
          wrong: [
            {
              code: "CPLX.ROOTS",
              value: A.exact(`\\frac{\\pi}{${p.n}}`),
              feedback: `The ${p.n} roots are spread evenly round a full turn of 2π.`,
            },
          ],
          solution: [{ say: `${p.n} roots evenly spaced: 2π ÷ ${p.n}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Liam says the only solution of ",
            A.math(`z^3 = ${p.k ** 3}`),
            ` is z = ${p.k}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. There are three cube roots: ${p.k} and two complex roots ${p.k}e^(±2πi/3), equally spaced round a circle of radius ${p.k}.`,
              correct: true,
            },
            { text: "True. A real number has only one cube root.", code: "CPLX.ROOTS" },
            { text: "True. Complex roots only appear for negative numbers.", code: "CPLX.ROOTS" },
          ],
          solution: [{ say: "zⁿ = w has exactly n roots in the complex numbers (for w ≠ 0)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    return true;
  },
});
