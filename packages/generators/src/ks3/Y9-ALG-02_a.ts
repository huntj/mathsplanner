/**
 * @statement Y9-ALG-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-02.a: Multiply and divide powers of the same base
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  m: number;
  n: number;
  v: string;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-02.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDICES.MULTIPLY"],

  params(rng) {
    const p = { m: rng.int(3, 9), n: rng.int(2, 6), v: rng.pick(["a", "x", "y", "p"]) };
    if (p.m <= p.n || p.m + p.n === p.m * p.n || p.m - p.n === p.m / p.n)
      reject("powers where the slips differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Simplify ", A.math(`${p.v}^{${p.m}} \\times ${p.v}^{${p.n}}`), "."],
          answer: A.exact(`${p.v}^{${p.m + p.n}}`),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(`${p.v}^{${p.m * p.n}}`),
              feedback: `${p.m} of them multiplied by ${p.n} more makes ${p.m + p.n}: add the powers.`,
            },
          ],
          solution: [{ say: "", math: `${p.v}^{${p.m} + ${p.n}} = ${p.v}^{${p.m + p.n}}` }],
        });
      case 2: {
        const slip = p.m / p.n;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Simplify ", A.math(`${p.v}^{${p.m}} \\div ${p.v}^{${p.n}}`), "."] },
          ],
          answer: A.exact(`${p.v}^{${p.m - p.n}}`),
          wrong: [
            Number.isInteger(slip)
              ? {
                  code: "ALG.INDICES.MULTIPLY",
                  value: A.exact(`${p.v}^{${slip}}`),
                  feedback: "When dividing, subtract the powers.",
                }
              : {
                  code: "ALG.INDICES.MULTIPLY",
                  value: A.exact(`${p.v}^{${p.m + p.n}}`),
                  feedback: "When dividing, subtract the powers.",
                },
          ],
          solution: [{ say: "", math: `${p.v}^{${p.m} - ${p.n}} = ${p.v}^{${p.m - p.n}}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [A.math("2^3 \\times 3^2 = 6^5")],
              truth: "never",
              reasons: [
                {
                  text: "Never. The index laws only work for the same base. 2³ × 3² = 8 × 9 = 72, but 6⁵ = 7776.",
                  correct: true,
                },
                {
                  text: "Always. Multiply the bases and add the powers.",
                  code: "ALG.INDICES.MULTIPLY",
                },
                { text: "Sometimes. It works for small numbers.", code: "ALG.INDICES.MULTIPLY" },
              ],
              solution: [{ say: "aᵐ × aⁿ = aᵐ⁺ⁿ needs the same base a." }],
            }),
          [
            {
              statement: "Ola says $x^3 \\times x^4 = x^7$.",
              truth: true,
              right: "True. Multiplying powers of the same base adds the indices: 3 + 4 = 7.",
              wrong: [
                ["False. It is x¹², multiplying the indices.", "ALG.INDICES.MULTIPLY"],
                ["False. It is 2x⁷."],
              ],
            },
            {
              statement: "Ben says $y^{10} \\div y^{2} = y^{5}$.",
              truth: false,
              right: "False. Dividing subtracts the indices: y¹⁰ ÷ y² = y⁸.",
              wrong: [
                ["True. Divide the indices: 10 ÷ 2 = 5.", "ALG.INDICES.MULTIPLY"],
                ["True. Half of y¹⁰ is y⁵."],
              ],
            },
            {
              claim: "$a^m \\times a^n$ is bigger than $a^m$.",
              truth: "sometimes",
              right:
                "Sometimes. It is when a is bigger than 1 and n is positive, but not when a = 1 or a is a fraction.",
              wrong: [
                ["Always. Multiplying makes things bigger."],
                ["Never. The indices add, so it gets smaller.", "ALG.INDICES.MULTIPLY"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `${p.v}^{${p.m + p.n}}`;
    if (question.key.depth === 2) return exactAnswer(question) === `${p.v}^{${p.m - p.n}}`;
    return true;
  },
});
