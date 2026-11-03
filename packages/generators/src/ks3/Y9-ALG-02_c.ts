/**
 * @statement Y9-ALG-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-02.c: Simplify products and quotients using the laws of indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  p: number;
  q: number;
  m: number;
  n: number;
  j: number;
  k: number;
}

const term = (c: number, a: number, b: number) =>
  `${c === 1 ? "" : c}a${a === 1 ? "" : `^{${a}}`}${b === 0 ? "" : `b${b === 1 ? "" : `^{${b}}`}`}`;

export default defineGenerator<Params>({
  id: "Y9-ALG-02.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDICES.MULTIPLY", "NPV.INDEX.ZERO"],

  params(rng) {
    const v = {
      p: rng.int(2, 6),
      q: rng.int(2, 5),
      m: rng.int(2, 5),
      n: rng.int(2, 4),
      j: rng.int(1, 3),
      k: rng.int(4, 7),
    };
    if (v.m + v.n === v.m * v.n || v.k <= v.j + 1 || v.m <= 1) reject("powers that test the idea");
    return v;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = term(p.p * p.q, p.m + p.n, 0);
        return A.standard({
          question: ["Simplify ", A.math(`${p.p}a^{${p.m}} \\times ${p.q}a^{${p.n}}`), "."],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(term(p.p * p.q, p.m * p.n, 0)),
              feedback: "Multiply the numbers, but add the powers of a.",
            },
          ],
          solution: [
            { say: "", math: `${p.p} \\times ${p.q} \\times a^{${p.m} + ${p.n}} = ${right}` },
          ],
        });
      }
      case 2: {
        const top = p.p * p.q;
        const right = term(p.p, p.m + 1, p.k - p.j);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Simplify ",
                A.math(`\\frac{${top}a^{${p.m + 2}}b^{${p.k}}}{${p.q}ab^{${p.j}}}`),
                ".",
              ],
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(term(p.p, p.m + 1, p.k + p.j)),
              feedback: "When dividing, subtract the powers of b as well as a.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${top}}{${p.q}} a^{${p.m + 2} - 1} b^{${p.k} - ${p.j}} = ${right}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [A.math("a^0 = 0"), " for any non-zero number a."],
              truth: "never",
              reasons: [
                {
                  text: `Never. a^0 = 1, because a^${p.m} ÷ a^${p.m} = a^0, and anything divided by itself is 1.`,
                  correct: true,
                },
                { text: "Always. A power of 0 leaves nothing.", code: "NPV.INDEX.ZERO" },
                { text: "Sometimes. Only when a is small.", code: "NPV.INDEX.ZERO" },
              ],
              solution: [{ say: "Any non-zero number to the power 0 is 1." }],
            }),
          [
            {
              statement: "Dev says $\\frac{x^5 \\times x^3}{x^2} = x^6$.",
              truth: true,
              right: "True. x⁵ × x³ = x⁸, and x⁸ ÷ x² = x⁶.",
              wrong: [
                ["False. It is x^7.5, as 15 ÷ 2 = 7.5.", "ALG.INDICES.MULTIPLY"],
                ["False. It is x¹⁰."],
              ],
            },
            {
              statement: "Pam says $3x^2 \\times 4x^3 = 7x^5$.",
              truth: false,
              right: "False. Multiply the numbers and add the indices: 12x⁵.",
              wrong: [
                ["True. Add the numbers and add the indices."],
                ["True. 3 + 4 = 7 and 2 + 3 = 5.", "ALG.INDICES.MULTIPLY"],
              ],
            },
            {
              claim: "$\\frac{a^n}{a^n} = 1$ for any non-zero a.",
              truth: "always",
              right: "Always. Anything non-zero divided by itself is 1, which is also a⁰.",
              wrong: [
                ["Never. It is 0, as n − n = 0.", "NPV.INDEX.ZERO"],
                ["Sometimes. Only when n is 1."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === term(p.p * p.q, p.m + p.n, 0);
    if (question.key.depth === 2) return exactAnswer(question) === term(p.p, p.m + 1, p.k - p.j);
    return true;
  },
});
