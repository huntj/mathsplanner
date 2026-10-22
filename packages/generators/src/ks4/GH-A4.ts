/**
 * @statement GH-A4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A4: Expand three binomials, factorise ax² + bx + c, simplify expressions with surds and
// algebraic fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signed } from "../shared/alg.ts";

interface Params {
  /** Depth 1: (kx + q)(x + r). */
  k: number;
  q: number;
  r: number;
  /** Depth 2: (x + a)(x + b)(x + c). */
  a: number;
  b: number;
  c: number;
  /** Depth 4: (x + 2m)/(x + m). */
  m: number;
  /** Depth 5: (x + s)(x + t)/((x + t)(x − t)). */
  s: number;
  t: number;
}

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

export default defineGenerator<Params>({
  id: "GH-A4",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "ALG.FACTORISE.SIGNS",
    "ALG.EXPAND.BINOMIAL-TWO-TERMS",
    "ALG.FRACTION.CANCEL-TERMS",
  ],

  params(rng) {
    const k = rng.pick([2, 3, 5]);
    const q = rng.int(-7, 7);
    const r = rng.int(-6, 6);
    const [a, b, c] = [rng.int(1, 5), rng.int(-5, 5), rng.int(-5, 5)];
    const s = rng.int(1, 9);
    const t = rng.int(1, 9);
    if (q === 0 || r === 0 || gcd(k, q) !== 1 || k * r + q === 0)
      reject("a quadratic with three terms that factorises fully");
    if (
      b === 0 ||
      c === 0 ||
      new Set([a, b, c]).size < 3 ||
      a + b + c === 0 ||
      a * b + b * c + c * a === 0
    )
      reject("a cubic with four terms");
    if (s === t) reject("a fraction that does not cancel to 1");
    return { k, q, r, a, b, c, m: rng.int(2, 9), s, t };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const expanded = poly([p.k, p.k * p.r + p.q, p.q * p.r]);
        return A.standard({
          question: ["Factorise ", A.math(expanded), "."],
          answer: A.exact(`(${p.k}x ${signed(p.q)})${bracket(p.r)}`, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`(${p.k}x ${signed(-p.q)})${bracket(-p.r)}`),
              feedback:
                "Expand your brackets to check: the signs must give the middle term and the constant.",
            },
          ],
          solution: [
            {
              say: `Look for two numbers that multiply to ${p.k} × ${p.q * p.r} = ${p.k * p.q * p.r} and add to ${p.k * p.r + p.q}: ${p.k * p.r} and ${p.q}.`,
            },
            { say: "", math: `${expanded} = (${p.k}x ${signed(p.q)})${bracket(p.r)}` },
          ],
        });
      }
      case 2: {
        const { a, b, c } = p;
        const cubic = poly([1, a + b + c, a * b + b * c + c * a, a * b * c]);
        const product = `${bracket(a)}${bracket(b)}${bracket(c)}`;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Expand and simplify ", A.math(product), "."] },
            { question: ["Write ", A.math(product), " as a cubic expression in x."] },
          ],
          answer: A.exact(cubic, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, 0, 0, a * b * c])),
              feedback:
                "Every term in each bracket multiplies every term in the others: expand two brackets first, then multiply by the third.",
            },
          ],
          solution: [
            { say: "First two brackets: ", math: poly([1, a + b, a * b]) },
            { say: `Then multiply by ${bracket(c)}: `, math: cubic },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Omar says ",
            A.math(`\\frac{x + ${2 * p.m}}{x + ${p.m}}`),
            " simplifies to 2.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Only common factors cancel. x + ${2 * p.m} and x + ${p.m} have no common factor, so the fraction does not simplify.`,
              correct: true,
            },
            {
              text: `True. Cancel the x terms, then ${2 * p.m} ÷ ${p.m} = 2.`,
              code: "ALG.FRACTION.CANCEL-TERMS",
            },
            { text: "True. The top is double the bottom." },
          ],
          solution: [{ say: `Try x = 1: (1 + ${2 * p.m}) ÷ (1 + ${p.m}) is not 2.` }],
        });
      default: {
        const top = poly([1, p.s + p.t, p.s * p.t]);
        const bottom = poly([1, 0, -p.t * p.t]);
        return A.multiStepContext({
          context: ["This question is about ", A.math(`\\frac{${top}}{${bottom}}`), "."],
          parts: [
            {
              ask: ["Factorise ", A.math(bottom), "."],
              answer: A.exact(`(x + ${p.t})(x - ${p.t})`, "factorised"),
              wrong: [
                {
                  code: "ALG.FACTORISE.SIGNS",
                  value: A.exact(`(x - ${p.t})^2`),
                  feedback: `(x − ${p.t})² = x² − ${2 * p.t}x + ${p.t * p.t}; a difference of two squares has one bracket of each sign.`,
                },
              ],
            },
            {
              ask: "Simplify the fraction fully.",
              answer: A.exact(`\\frac{x + ${p.s}}{x - ${p.t}}`),
              wrong: [
                {
                  code: "ALG.FRACTION.CANCEL-TERMS",
                  value: A.exact(`\\frac{${poly([p.s + p.t, p.s * p.t])}}{${-p.t * p.t}}`),
                  feedback: "Cancel common factors (whole brackets), not terms like x².",
                },
              ],
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{(x + ${p.s})(x + ${p.t})}{(x + ${p.t})(x - ${p.t})} = \\frac{x + ${p.s}}{x - ${p.t}}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 2) {
      const cubic = poly([1, p.a + p.b + p.c, p.a * p.b + p.b * p.c + p.c * p.a, p.a * p.b * p.c]);
      return a?.type === "exact" && a.value === cubic;
    }
    return true;
  },
});
