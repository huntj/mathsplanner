/**
 * @statement Y9-ALG-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-02.b: Raise a power to a power
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  m: number;
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-02.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDICES.POWER-ADD", "ALG.INDICES.BRACKET-COEFF"],

  params(rng) {
    const p = { m: rng.int(2, 6), n: rng.int(2, 4), k: rng.int(2, 5) };
    if (p.m + p.n === p.m * p.n) reject("a sum and product that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Simplify ", A.math(`(x^{${p.m}})^{${p.n}}`), "."],
          answer: A.exact(`x^{${p.m * p.n}}`),
          wrong: [
            {
              code: "ALG.INDICES.POWER-ADD",
              value: A.exact(`x^{${p.m + p.n}}`),
              feedback: `${p.n} lots of x^${p.m} multiplied together: multiply the powers.`,
            },
          ],
          solution: [{ say: "", math: `x^{${p.m} \\times ${p.n}} = x^{${p.m * p.n}}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [{ question: ["Simplify ", A.math(`(${p.k}x^{${p.m}})^{${p.n}}`), "."] }],
          answer: A.exact(`${p.k ** p.n}x^{${p.m * p.n}}`),
          wrong: [
            {
              code: "ALG.INDICES.BRACKET-COEFF",
              value: A.exact(`${p.k}x^{${p.m * p.n}}`),
              feedback: `Everything in the bracket is raised to the power ${p.n}, including ${p.k}: ${p.k}^${p.n} = ${p.k ** p.n}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.k}^{${p.n}} \\times x^{${p.m * p.n}} = ${p.k ** p.n}x^{${p.m * p.n}}`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Kim says ",
                A.math(`(x^{${p.m}})^{${p.n}} = (x^{${p.n}})^{${p.m}}`),
                ".",
              ],
              truth: true,
              reasons: [
                {
                  text: `True. Both are x^(${p.m} × ${p.n}) = x^${p.m * p.n}, and multiplying is commutative.`,
                  correct: true,
                },
                { text: `False. The first is x^${p.m + p.n}.`, code: "ALG.INDICES.POWER-ADD" },
                { text: "False. The order of the powers matters.", code: "ALG.INDICES.POWER-ADD" },
              ],
              solution: [{ say: "(xᵐ)ⁿ = xᵐⁿ." }],
            }),
          [
            {
              statement: "Gus says $(x^2)^3 = x^5$.",
              truth: false,
              right: "False. A power of a power multiplies the indices: (x²)³ = x².x².x² = x⁶.",
              wrong: [
                ["True. Add the indices: 2 + 3 = 5.", "ALG.INDICES.POWER-ADD"],
                ["True. The 3 goes on the end."],
              ],
            },
            {
              statement: "Ivy says $(2x^3)^2 = 4x^6$.",
              truth: true,
              right: "True. Square the 2 and the x³: 2² = 4 and (x³)² = x⁶.",
              wrong: [
                ["False. It is 2x⁶; the 2 is not squared.", "ALG.INDICES.BRACKET-COEFF"],
                ["False. It is 4x⁵.", "ALG.INDICES.POWER-ADD"],
              ],
            },
            {
              claim: "$(a^m)^n$ is equal to $a^{m + n}$.",
              truth: "sometimes",
              right:
                "Sometimes. It equals a^(mn), which matches a^(m + n) only when mn = m + n, as when m = n = 2.",
              wrong: [
                ["Always. That is the rule for powers.", "ALG.INDICES.POWER-ADD"],
                ["Never. The two can never be equal."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `x^{${p.m * p.n}}`;
    if (question.key.depth === 2) return exactAnswer(question) === `${p.k ** p.n}x^{${p.m * p.n}}`;
    return true;
  },
});
