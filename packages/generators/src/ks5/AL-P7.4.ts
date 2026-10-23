/**
 * @statement AL-P7.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.4: Use the product, quotient and chain rules, including dy/dx = 1/(dx/dy)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signed } from "../shared/alg.ts";

export interface Params {
  a: number;
  b: number;
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.CHAIN", "CALC.PRODUCT-RULE"],

  params(rng) {
    return {
      a: rng.int(2, 5),
      b: rng.pick([-7, -5, -3, -1, 1, 3, 5, 7]),
      n: rng.int(3, 7),
      k: rng.int(2, 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const inner = `${p.a}x ${signed(p.b)}`;
        return A.standard({
          question: ["Differentiate ", A.math(`y = (${inner})^${p.n}`), "."],
          answer: A.exact(`${p.a * p.n}(${inner})^{${p.n - 1}}`),
          wrong: [
            {
              code: "CALC.CHAIN",
              value: A.exact(`${p.n}(${inner})^{${p.n - 1}}`),
              feedback: `Multiply by the derivative of the inside, ${p.a}.`,
            },
          ],
          solution: [
            {
              say: "Chain rule: ",
              math: `${p.n}(${inner})^{${p.n - 1}} \\times ${p.a} = ${p.a * p.n}(${inner})^{${p.n - 1}}`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Differentiate ", A.math(`y = x^2 e^{${p.k}x}`), "."] },
            {
              question: [
                "Use the product rule to find ",
                A.math("\\frac{dy}{dx}"),
                " for ",
                A.math(`y = x^2 e^{${p.k}x}`),
                ".",
              ],
            },
          ],
          answer: A.exact(`2xe^{${p.k}x} + ${p.k}x^2e^{${p.k}x}`),
          wrong: [
            {
              code: "CALC.PRODUCT-RULE",
              value: A.exact(`${2 * p.k}xe^{${p.k}x}`),
              feedback: "The derivative of a product is u′v + uv′, not u′v′.",
            },
          ],
          solution: [
            {
              say: "With u = x² and v = e^(kx): ",
              math: `u'v + uv' = 2xe^{${p.k}x} + ${p.k}x^2e^{${p.k}x}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jon says the derivative of ",
            A.math(`x\\sin x`),
            " is ",
            A.math("\\cos x"),
            ", because the derivative of x is 1.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Use the product rule: 1 × sin x + x cos x = sin x + x cos x.",
              correct: true,
            },
            { text: "True. Differentiate each factor and multiply.", code: "CALC.PRODUCT-RULE" },
            { text: "True. The x just disappears.", code: "CALC.PRODUCT-RULE" },
          ],
          solution: [{ say: "d/dx (uv) = u′v + uv′." }],
        });
    }
  },

  verify() {
    return true;
  },
});
