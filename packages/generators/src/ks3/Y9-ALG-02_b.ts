/**
 * @statement Y9-ALG-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-02.b: Raise a power to a power
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-02.b",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
          rng,
          statement: ["Kim says ", A.math(`(x^{${p.m}})^{${p.n}} = (x^{${p.n}})^{${p.m}}`), "."],
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === `x^{${p.m * p.n}}`;
    if (question.key.depth === 2) return exactAnswer(question) === `${p.k ** p.n}x^{${p.m * p.n}}`;
    return true;
  },
});
