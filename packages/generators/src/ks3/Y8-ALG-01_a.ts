/**
 * @statement Y8-ALG-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-01.a: Expand the product of two binomials with positive terms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(1, 9), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = poly([1, p.a + p.b, p.a * p.b]);
        return A.standard({
          question: ["Expand and simplify ", A.math(`(x + ${p.a})(x + ${p.b})`), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, 0, p.a * p.b])),
              feedback: `Multiply every term by every term: x × ${p.b} and ${p.a} × x give the x terms.`,
            },
          ],
          solution: [{ say: "", math: `x^2 + ${p.b}x + ${p.a}x + ${p.a * p.b} = ${right}` }],
        });
      }
      case 2: {
        const right = poly([p.k, p.k * p.b + p.a, p.a * p.b]);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Expand and simplify ", A.math(`(${p.k}x + ${p.a})(x + ${p.b})`), "."] },
            {
              question: [`A rectangle is (${p.k}x + ${p.a}) cm long and (x + ${p.b}) cm wide.`],
              ask: "Write an expanded expression for its area, in cm².",
            },
          ],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([p.k, 0, p.a * p.b])),
              feedback: `Include the middle terms: ${p.k}x × ${p.b} and ${p.a} × x.`,
            },
          ],
          solution: [
            { say: "", math: `${p.k}x^2 + ${p.k * p.b}x + ${p.a}x + ${p.a * p.b} = ${right}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Jay says ", A.math(`(x + ${p.a})^2 = x^2 + ${p.a * p.a}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. (x + ${p.a})² = (x + ${p.a})(x + ${p.a}) = ${poly([1, 2 * p.a, p.a * p.a]).replace("x^2", "x²")}. The middle term ${2 * p.a}x is missing.`,
              correct: true,
            },
            {
              text: "True. Square each term in the bracket.",
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
            },
            {
              text: "True. Squaring works like multiplying by a number.",
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
            },
          ],
          solution: [
            {
              say: `Check with x = 1: (1 + ${p.a})² = ${(1 + p.a) ** 2}, but 1 + ${p.a * p.a} = ${1 + p.a * p.a}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === poly([1, p.a + p.b, p.a * p.b]);
    if (question.key.depth === 2)
      return exactAnswer(question) === poly([p.k, p.k * p.b + p.a, p.a * p.b]);
    return true;
  },
});
