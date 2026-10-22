/**
 * @statement FM-CP-17
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-17: Evaluate improper integrals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac as rational, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

const frac = (n: number, d: number) => toLatex(rational(n, d));

interface Params {
  n: number;
  m: number;
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-17",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.INTEGRATE.POWER", "CALC.STANDARD-INTEGRAL", "CALC.IMPROPER"],

  params(rng) {
    return { n: rng.int(2, 3), m: rng.int(1, 3), a: rng.int(2, 6), k: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const k = p.m * (p.n - 1) * (p.n + 1);
        const v = k / (p.n - 1);
        return A.standard({
          question: ["Evaluate ", A.math(`\\int_1^{\\infty} \\frac{${k}}{x^${p.n}}\\,dx`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "CALC.INTEGRATE.POWER",
              value: A.number(k / (p.n + 1)),
              feedback: `∫x^(−${p.n}) dx = x^(−${p.n - 1})/(−${p.n - 1}): the power goes up by 1, to −${p.n - 1}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\lim_{t \\to \\infty} \\left[-\\frac{${k}}{${p.n - 1}x^{${p.n - 1}}}\\right]_1^t = 0 + \\frac{${k}}{${p.n - 1}} = ${v}`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Evaluate ",
                A.math(`\\int_0^{\\infty} ${p.k === 1 ? "" : p.k}e^{-${p.a}x}\\,dx`),
                ", giving an exact answer.",
              ],
            },
          ],
          answer: A.exact(frac(p.k, p.a)),
          wrong: [
            {
              code: "CALC.STANDARD-INTEGRAL",
              value: A.exact(frac(-p.k, p.a)),
              feedback: `∫e^(−${p.a}x) dx = −e^(−${p.a}x)/${p.a}; at ∞ it is 0 and at 0 it is −1/${p.a}, and you subtract.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\lim_{t \\to \\infty} \\left[-\\frac{${p.k}}{${p.a}}e^{-${p.a}x}\\right]_0^t = 0 - \\left(-\\frac{${p.k}}{${p.a}}\\right) = ${frac(p.k, p.a)}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ian says ",
            A.math("\\int_1^{\\infty} \\frac{1}{x}\\,dx"),
            " is finite, because ",
            A.math("\\frac{1}{x} \\to 0"),
            " as ",
            A.math("x \\to \\infty"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The integral up to t is ln t, which grows without limit, so the improper integral diverges.",
              correct: true,
            },
            {
              text: "True. If the curve tends to 0 the area must be finite.",
              code: "CALC.IMPROPER",
            },
            {
              text: "True. It equals [ln x] from 1 to ∞ = ∞ − 0, which is a number.",
              code: "CALC.IMPROPER",
            },
          ],
          solution: [
            { say: "Compare ∫₁^∞ 1/x² dx = 1, which does converge: tending to 0 is not enough." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m * (p.n + 1);
    if (question.key.depth === 2) return exactAnswer(question) === frac(p.k, p.a);
    return true;
  },
});
