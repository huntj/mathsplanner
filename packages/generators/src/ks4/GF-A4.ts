/**
 * @statement GF-A4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A4: Simplify and manipulate algebraic expressions by collecting like terms, multiplying a single
// term over a bracket, taking out common factors, expanding products of two binomials, factorising
// quadratic expressions of the form x² + bx + c, including the difference of two squares; simplify
// expressions involving sums, products and powers, including the laws of indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  m: number;
  n: number;
  p: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "GF-A4",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "ALG.EXPAND.BINOMIAL-TWO-TERMS",
    "ALG.FACTORISE.SIGNS",
    "ALG.INDICES.MULTIPLY",
    "ALG.EXPAND.NEGATIVE",
  ],

  params(rng, numbers) {
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const a = rng.int(1, 9) * sign();
    const b = rng.int(1, 9) * sign();
    if (a + b === 0 || a === b) reject("a middle term");
    const p = rng.int(2, 5);
    const q = rng.int(2, 6);
    const m = rng.int(2, 6);
    const n = rng.int(2, 6);
    if (m === n) reject("different powers");
    return { a, b, k: rng.int(2, 12), m, n, p, q };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = poly([1, p.a + p.b, p.a * p.b]);
        return A.standard({
          question: ["Expand and simplify ", A.math(`${bracket(p.a)}${bracket(p.b)}`), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, 0, p.a * p.b])),
              feedback:
                "Multiply every term in the first bracket by every term in the second: there are four products.",
            },
          ],
          solution: [
            {
              say: "",
              math: `x^2 ${p.a < 0 ? "-" : "+"} ${Math.abs(p.a)}x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x ${p.a * p.b < 0 ? "-" : "+"} ${Math.abs(p.a * p.b)} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const right = `(x - ${p.k})(x + ${p.k})`;
        return A.standard({
          question: ["Factorise ", A.math(`x^2 - ${p.k * p.k}`), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`(x - ${p.k})^2`),
              feedback: `(x − ${p.k})² = x² − ${2 * p.k}x + ${p.k * p.k}. You need brackets whose middle terms cancel.`,
            },
          ],
          solution: [
            {
              say: `This is a difference of two squares: x² − ${p.k}² = (x − ${p.k})(x + ${p.k}).`,
            },
          ],
        });
      }
      case 4: {
        const truth = rng.bool();
        const shown = truth ? p.m + p.n : p.m * p.n;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Lena says ", A.math(`x^{${p.m}} \\times x^{${p.n}} = x^{${shown}}`), "."],
          truth,
          reasons: truth
            ? [
                {
                  text: `True. Multiplying powers of the same base adds the indices: ${p.m} + ${p.n} = ${p.m + p.n}.`,
                  correct: true,
                },
                {
                  text: `False. Multiply the indices: x^${p.m * p.n}.`,
                  code: "ALG.INDICES.MULTIPLY",
                },
                { text: `False. It is ${2}x^${p.m + p.n}.` },
              ]
            : [
                { text: `False. Add the indices when multiplying: x^${p.m + p.n}.`, correct: true },
                {
                  text: "True. You multiply the powers when you multiply.",
                  code: "ALG.INDICES.MULTIPLY",
                },
                { text: "True. Index laws only work with numbers." },
              ],
          solution: [
            {
              say: `x^${p.m} × x^${p.n} has ${p.m} + ${p.n} = ${p.m + p.n} x's multiplied together.`,
            },
          ],
        });
      }
      default: {
        // p(x + q) − 2(x − m)
        const coeff = p.p - 2;
        const constant = p.p * p.q + 2 * p.m;
        const right = poly([coeff, constant]);
        const slip = poly([coeff, p.p * p.q - 2 * p.m]);
        return A.multiStepContext({
          context: ["Simplify ", A.math(`${p.p}(x + ${p.q}) - 2(x - ${p.m})`), "."],
          parts: [
            {
              ask: ["Expand ", A.math(`-2(x - ${p.m})`), "."],
              answer: A.exact(`-2x + ${2 * p.m}`, "expanded"),
              wrong: [
                {
                  code: "ALG.EXPAND.NEGATIVE",
                  value: A.exact(`-2x - ${2 * p.m}`),
                  feedback: `−2 × −${p.m} = +${2 * p.m}.`,
                },
              ],
            },
            {
              ask: "Simplify the whole expression.",
              answer: A.exact(right, "expanded"),
              wrong: [
                {
                  code: "ALG.EXPAND.NEGATIVE",
                  value: A.exact(slip),
                  feedback: "The minus sign multiplies both terms in the second bracket.",
                },
              ],
            },
          ],
          solution: [{ say: "", math: `${p.p}x + ${p.p * p.q} - 2x + ${2 * p.m} = ${right}` }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === poly([1, p.a + p.b, p.a * p.b]);
    return true;
  },
});
