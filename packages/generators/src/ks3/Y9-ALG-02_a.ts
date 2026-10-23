/**
 * @statement Y9-ALG-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-02.a: Multiply and divide powers of the same base
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  n: number;
  v: string;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-02.a",
  version: "1.0.0",
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
        return A.alwaysSometimesNever({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `${p.v}^{${p.m + p.n}}`;
    if (question.key.depth === 2) return exactAnswer(question) === `${p.v}^{${p.m - p.n}}`;
    return true;
  },
});
