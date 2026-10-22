/**
 * @statement AL-P2.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.1: Use the laws of indices for all rational exponents
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Depth 1: (a³/b³)^(−2/3). */
  a: number;
  b: number;
  /** Depth 2: x^m √x ÷ x^n written as x^k. */
  m: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INDEX.NEGATIVE", "NPV.INDEX.FRACTIONAL", "ALG.INDICES.MULTIPLY"],

  params(rng) {
    const a = rng.int(2, 5);
    const b = rng.int(2, 5);
    const m = rng.int(2, 5);
    const n = rng.int(1, 4);
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
    if (a === b || m === n || gcd(a, b) !== 1)
      reject("different values and a fraction in lowest terms");
    return { a, b, m, n };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const value = frac(p.b * p.b, p.a * p.a);
        return A.standard({
          question: [
            "Work out ",
            A.math(`\\left(\\frac{${p.a ** 3}}{${p.b ** 3}}\\right)^{-\\frac{2}{3}}`),
            ", giving your answer as a fraction.",
          ],
          answer: A.exact(value, "simplest"),
          wrong: [
            {
              code: "NPV.INDEX.NEGATIVE",
              value: A.exact(frac(p.a * p.a, p.b * p.b)),
              feedback:
                "The negative index means take the reciprocal: turn the fraction upside down.",
            },
            {
              code: "NPV.INDEX.FRACTIONAL",
              value: A.exact(frac(-2 * p.a ** 3, 3 * p.b ** 3)),
              feedback:
                "A power of −2/3 means: cube root, square, then reciprocal. Do not multiply by −2/3.",
            },
          ],
          solution: [
            {
              say: "Cube root, then square, then reciprocal: ",
              math: `\\left(\\frac{${p.a}}{${p.b}}\\right)^{-2} = ${toLatex(value)}`,
            },
          ],
        });
      }
      case 2: {
        const k = frac(2 * p.m + 1 - 2 * p.n, 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`\\frac{x^{${p.m}}\\sqrt{x}}{x^{${p.n}}}`),
                " in the form ",
                A.math("x^k"),
                ".",
              ],
              ask: "Find k.",
            },
            {
              question: [A.math(`\\frac{x^{${p.m}}\\sqrt{x}}{x^{${p.n}}} = x^k`), "."],
              ask: "Work out the value of k.",
            },
          ],
          answer: A.exact(k),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(frac(p.m, 2 * p.n)),
              feedback: "Add powers when multiplying and subtract when dividing: √x = x^(1/2).",
            },
          ],
          solution: [{ say: "", math: `${p.m} + \\tfrac{1}{2} - ${p.n} = ${toLatex(k)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ivan says ", A.math(`${p.a * p.a}^{-\\frac{1}{2}} = -${p.a}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. The negative index gives a reciprocal: ${p.a * p.a}^(−1/2) = 1/√${p.a * p.a} = 1/${p.a}.`,
              correct: true,
            },
            {
              text: "True. A negative power makes the answer negative.",
              code: "NPV.INDEX.NEGATIVE",
            },
            { text: `False. It is ${p.a * p.a} ÷ −2.`, code: "NPV.INDEX.FRACTIONAL" },
          ],
          solution: [
            {
              say: "x^(−n) = 1/xⁿ: negative powers give reciprocals, never negative numbers (for positive x).",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(frac(p.b * p.b, p.a * p.a));
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(frac(2 * p.m + 1 - 2 * p.n, 2));
    return true;
  },
});
