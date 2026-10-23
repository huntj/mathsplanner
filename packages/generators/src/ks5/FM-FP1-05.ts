/**
 * @statement FM-FP1-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-05: Use Taylor series and series expansions to evaluate limits, including L'Hospital's rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "FM-FP1-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.LIMIT"],

  params(rng) {
    const p = { a: rng.int(2, 9), b: rng.int(2, 9), k: rng.int(2, 7) };
    if (p.a === p.b) reject("a limit other than 1");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find ", A.math(`\\lim_{x \\to 0} \\frac{\\sin ${p.a}x}{${p.b}x}`), "."],
          answer: A.exact(toLatex(frac(p.a, p.b))),
          wrong: [
            {
              code: "CALC.LIMIT",
              value: A.exact("1"),
              feedback: `sin ${p.a}x ≈ ${p.a}x for small x, so the limit is ${p.a}/${p.b}, not 1.`,
            },
          ],
          solution: [
            {
              say: "By L'Hospital's rule, or using sin u ≈ u: ",
              math: `\\lim_{x \\to 0} \\frac{${p.a}\\cos ${p.a}x}{${p.b}} = ${toLatex(frac(p.a, p.b))}`,
            },
          ],
        });
      case 2: {
        const v = toLatex(frac(p.k * p.k, 2));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use a series expansion to find ",
                A.math(`\\lim_{x \\to 0} \\frac{1 - \\cos ${p.k}x}{x^2}`),
                ".",
              ],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "CALC.LIMIT",
              value: A.exact(String(p.k * p.k)),
              feedback: `cos u = 1 − u²/2 + …: the ½ stays, so 1 − cos ${p.k}x ≈ ${p.k * p.k}x²/2.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `1 - \\cos ${p.k}x = \\frac{${p.k * p.k}x^2}{2} - \\ldots, \\text{ so the limit is } ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eve uses L'Hospital's rule to say ",
            A.math(
              `\\lim_{x \\to 0} \\frac{x + ${p.a}}{x + ${p.b}} = \\lim_{x \\to 0} \\frac{1}{1} = 1`,
            ),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. L'Hospital's rule only applies to 0/0 or ∞/∞ forms. Here substitute directly: the limit is ${p.a}/${p.b}.`,
              correct: true,
            },
            {
              text: "True. Differentiating the top and bottom always gives the limit.",
              code: "CALC.LIMIT",
            },
            {
              text: "False. You should differentiate the whole fraction with the quotient rule.",
              code: "CALC.LIMIT",
            },
          ],
          solution: [
            { say: `At x = 0 the fraction is ${p.a}/${p.b}, which is not indeterminate.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.a, p.b));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.k * p.k, 2));
    return true;
  },
});
