/**
 * @statement AL-P4.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.1a: Expand (a + bx)ⁿ for positive integer n using n! and ⁿCᵣ; link to binomial probabilities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  n: number;
  k: number;
  claim: number;
}

const nCr = (n: number, r: number) => {
  let c = 1;
  for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;
  return Math.round(c);
};

const CLAIMS = [
  {
    text: "the expansion of (1 + x)¹⁰ has 10 terms",
    truth: false,
    why: "There are n + 1 = 11 terms, from x⁰ to x¹⁰.",
  },
  {
    text: "¹⁰C₃ = ¹⁰C₇",
    truth: true,
    why: "Choosing 3 to include is the same as choosing 7 to leave out: ⁿCᵣ = ⁿCₙ₋ᵣ = 120.",
  },
  {
    text: "the coefficients in the expansion of (1 + x)⁵ add up to 32",
    truth: true,
    why: "Put x = 1: (1 + 1)⁵ = 2⁵ = 32.",
  },
] as const;

export default defineGenerator<Params>({
  id: "AL-P4.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.BINOMIAL.POWER"],

  params(rng) {
    const p = {
      a: rng.int(1, 3),
      b: rng.pick([-3, -2, 2, 3]),
      n: rng.int(4, 7),
      k: rng.int(2, 3),
      claim: rng.int(0, CLAIMS.length - 1),
    };
    if (p.a === Math.abs(p.b)) reject("different numbers in the bracket");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const coef = nCr(p.n, p.k) * p.a ** (p.n - p.k) * p.b ** p.k;
        const slip = nCr(p.n, p.k) * p.a ** (p.n - p.k) * p.b;
        return A.standard({
          question: [
            "Find the coefficient of ",
            A.math(`x^${p.k}`),
            " in the expansion of ",
            A.math(`(${p.a} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x)^${p.n}`),
            ".",
          ],
          answer: A.number(coef),
          wrong: signedWrongs(coef, [
            {
              code: "ALG.BINOMIAL.POWER",
              value: A.number(slip),
              feedback: `The term is ${nCr(p.n, p.k)} × ${p.a}^${p.n - p.k} × (${p.b}x)^${p.k}: raise ${p.b} to the power ${p.k} as well.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\binom{${p.n}}{${p.k}} \\times ${p.a}^{${p.n - p.k}} \\times (${p.b})^{${p.k}} = ${nCr(p.n, p.k)} \\times ${p.a ** (p.n - p.k)} \\times ${p.b ** p.k} = ${coef}`,
            },
          ],
        });
      }
      case 2: {
        const ascending = `1 ${p.n * p.b < 0 ? "-" : "+"} ${Math.abs(p.n * p.b)}x + ${nCr(p.n, 2) * p.b * p.b}x^2`;
        const slip = `1 ${p.n * p.b < 0 ? "-" : "+"} ${Math.abs(p.n * p.b)}x ${nCr(p.n, 2) * p.b < 0 ? "-" : "+"} ${Math.abs(nCr(p.n, 2) * p.b)}x^2`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the first three terms, in ascending powers of x, of the expansion of ",
                A.math(`(1 ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x)^${p.n}`),
                ".",
              ],
            },
            {
              question: [
                "Expand ",
                A.math(`(1 ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x)^${p.n}`),
                " up to and including the term in ",
                A.math("x^2"),
                ".",
              ],
            },
          ],
          answer: A.exact(ascending),
          wrong: [
            {
              code: "ALG.BINOMIAL.POWER",
              value: A.exact(slip),
              feedback: `The x² term is ${nCr(p.n, 2)}(${p.b}x)², so square the ${p.b}.`,
            },
          ],
          solution: [
            { say: "", math: `1 + ${p.n}(${p.b}x) + \\binom{${p.n}}{2}(${p.b}x)^2 = ${ascending}` },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? (CLAIMS[0] as (typeof CLAIMS)[number]);
        return A.trueOrFalseWhy({
          rng,
          statement: `Jas says ${c.text}.`,
          truth: c.truth,
          reasons: c.truth
            ? [
                { text: `True. ${c.why}`, correct: true },
                { text: "False. Binomial coefficients are all different." },
                { text: "False. You need to expand fully to know.", code: "ALG.BINOMIAL.POWER" },
              ]
            : [
                { text: `False. ${c.why}`, correct: true },
                {
                  text: "True. The power tells you the number of terms.",
                  code: "ALG.BINOMIAL.POWER",
                },
                { text: "True. Each bracket gives one term." },
              ],
          solution: [{ say: c.why }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === nCr(p.n, p.k) * p.a ** (p.n - p.k) * p.b ** p.k;
    return true;
  },
});
