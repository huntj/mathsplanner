/**
 * @statement AL-P8.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.2: Integrate xⁿ (n ≠ −1) and related sums and multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  a: number;
  n: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-P8.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.INTEGRATE.POWER"],

  params(rng) {
    const p = { a: rng.int(2, 9), n: rng.int(2, 5), b: rng.int(2, 9), k: rng.int(2, 8) };
    if (p.a % (p.n + 1) !== 0) reject("a whole-number coefficient");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const coef = p.a / (p.n + 1);
        return A.standard({
          question: ["Find ", A.math(`\\int (${p.a}x^${p.n} + ${p.b})\\,dx`), "."],
          answer: A.exact(`${coef === 1 ? "" : coef}x^{${p.n + 1}} + ${p.b}x + c`),
          wrong: [
            {
              code: "CALC.INTEGRATE.POWER",
              value: A.exact(`${p.a * p.n}x^{${p.n - 1}} + c`),
              feedback:
                "That differentiates. To integrate, add 1 to the power and divide by the new power.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.a}}{${p.n + 1}}x^{${p.n + 1}} + ${p.b}x + c` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find ",
                A.math(`\\int \\left(\\frac{${p.k}}{x^2} + \\sqrt{x}\\right)dx`),
                ".",
              ],
            },
            {
              question: [
                "Integrate ",
                A.math(`${p.k}x^{-2} + x^{\\frac{1}{2}}`),
                " with respect to x.",
              ],
            },
          ],
          answer: A.exact(`-\\frac{${p.k}}{x} + \\frac{2}{3}x^{\\frac{3}{2}} + c`),
          wrong: [
            {
              code: "CALC.INTEGRATE.POWER",
              value: A.exact(`\\frac{${p.k}}{x} + \\frac{2}{3}x^{\\frac{3}{2}} + c`),
              feedback: `x^(−2) integrates to x^(−1) ÷ (−1): the sign changes.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.k}\\frac{x^{-1}}{-1} + \\frac{x^{3/2}}{3/2} + c = -\\frac{${p.k}}{x} + ${toLatex(frac(2, 3))}x^{\\frac{3}{2}} + c`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says ",
            A.math(`\\int ${p.b}\\,dx = 0`),
            " because the derivative of a constant is 0.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.b}x has derivative ${p.b}, so the integral is ${p.b}x + c.`,
              correct: true,
            },
            { text: "True. Constants disappear.", code: "CALC.INTEGRATE.POWER" },
            { text: `False. It is ${p.b} + c.`, code: "CALC.INTEGRATE.POWER" },
          ],
          solution: [{ say: `${p.b} = ${p.b}x⁰ integrates to ${p.b}x¹/1.` }],
        });
    }
  },

  verify() {
    return true;
  },
});
