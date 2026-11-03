/**
 * @statement Y8-ALG-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-01.b: Expand the product of two binomials with negative terms and coefficients
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-01.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.NEGATIVE", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    const p = { a: rng.int(1, 9), b: rng.int(1, 9), k: rng.int(2, 4), m: rng.int(2, 4) };
    if (p.a === p.b) reject("two different numbers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = poly([1, p.b - p.a, -p.a * p.b]);
        return A.standard({
          question: ["Expand and simplify ", A.math(`(x - ${p.a})(x + ${p.b})`), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.exact(poly([1, p.b - p.a, p.a * p.b])),
              feedback: `−${p.a} × ${p.b} = −${p.a * p.b}: a negative times a positive is negative.`,
            },
          ],
          solution: [{ say: "", math: `x^2 + ${p.b}x - ${p.a}x - ${p.a * p.b} = ${right}` }],
        });
      }
      case 2: {
        const right = poly([p.k * p.m, -(p.k * p.b + p.m * p.a), p.a * p.b]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Expand and simplify ",
                A.math(`(${p.k}x - ${p.a})(${p.m}x - ${p.b})`),
                ".",
              ],
            },
          ],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.exact(poly([p.k * p.m, -(p.k * p.b + p.m * p.a), -p.a * p.b])),
              feedback: `−${p.a} × −${p.b} = +${p.a * p.b}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.k * p.m}x^2 - ${p.k * p.b}x - ${p.m * p.a}x + ${p.a * p.b} = ${right}`,
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
              claim: ["The expansion of ", A.math("(x - a)(x + a)"), " has an x term."],
              truth: "never",
              reasons: [
                {
                  text: `Never. The x terms are −ax and +ax, which cancel: (x − ${p.a})(x + ${p.a}) = x² − ${p.a * p.a}.`,
                  correct: true,
                },
                {
                  text: "Always. Two brackets always give an x term.",
                  code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
                },
                { text: "Sometimes. Only when a is negative.", code: "ALG.EXPAND.NEGATIVE" },
              ],
              solution: [{ say: "This is the difference of two squares." }],
            }),
          [
            {
              statement: "Rafi says $(x - 3)(x - 5) = x^2 - 8x - 15$.",
              truth: false,
              right: "False. −3 × −5 = +15, so it is x² − 8x + 15.",
              wrong: [
                [
                  "True. Both numbers are negative, so the last term is negative.",
                  "ALG.EXPAND.NEGATIVE",
                ],
                ["True. The x term is −3 − 5 = −8, and that is all that needs checking."],
              ],
            },
            {
              statement: "Gus says $(x + 4)(x - 6) = x^2 - 2x - 24$.",
              truth: true,
              right: "True. x² − 6x + 4x − 24 = x² − 2x − 24.",
              wrong: [
                ["False. It is x² + 2x − 24.", "ALG.EXPAND.NEGATIVE"],
                ["False. It is x² − 24.", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],
              ],
            },
            {
              claim:
                "When a and b are positive, the number term in the expansion of $(x - a)(x - b)$ is positive.",
              truth: "always",
              right: "Always. A negative times a negative is positive: (−a) × (−b) = +ab.",
              wrong: [
                ["Never. Both brackets have minus signs, so it is −ab.", "ALG.EXPAND.NEGATIVE"],
                ["Sometimes. Only when a and b are equal."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === poly([1, p.b - p.a, -p.a * p.b]);
    if (question.key.depth === 2)
      return exactAnswer(question) === poly([p.k * p.m, -(p.k * p.b + p.m * p.a), p.a * p.b]);
    return true;
  },
});
