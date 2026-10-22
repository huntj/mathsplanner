/**
 * @statement GH-A3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A3: Understand and use identities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  /** Depth 2: p(x + a) − q(x − b) ≡ (p − q)x + c. */
  p: number;
  q: number;
  b: number;
  difference: boolean;
}

export default defineGenerator<Params>({
  id: "GH-A3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EQUATION.IDENTITY", "ALG.EXPAND.BINOMIAL-TWO-TERMS", "ALG.EXPAND.NEGATIVE"],

  params(rng) {
    const p = rng.int(3, 7);
    const q = rng.int(2, 6);
    if (p - q < 1) reject("a positive x coefficient");
    return { a: rng.int(2, 9), p, q, b: rng.int(2, 9), difference: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: "Which of these is an identity, true for every value of x?",
          correct: A.math(`(x + ${p.a})^2 \\equiv ${poly([1, 2 * p.a, p.a * p.a])}`),
          distractors: [
            {
              content: A.math(`(x + ${p.a})^2 = x^2 + ${p.a * p.a}`),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: `(x + ${p.a})² = (x + ${p.a})(x + ${p.a}), which has a middle term ${2 * p.a}x.`,
            },
            {
              content: A.math(`${p.a}x + ${p.a} = ${p.a + 1}x`),
              code: "ALG.EQUATION.IDENTITY",
              feedback: `This is only true when x = ${p.a}: it is an equation.`,
            },
            {
              content: A.math(`x^2 = ${p.a * p.a}`),
              code: "ALG.EQUATION.IDENTITY",
              feedback: `This is only true when x = ${p.a} or x = −${p.a}.`,
            },
          ],
          solution: [
            {
              say: "An identity is true for every value of the letter; expanding the left side gives exactly the right side.",
            },
          ],
        });
      case 2: {
        const c = p.p * p.a + p.q * p.b;
        const lhs = `${p.p}(x + ${p.a}) - ${p.q}(x - ${p.b})`;
        const rhs = `${poly([p.p - p.q, 0])} + c`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Given that ", A.math(`${lhs} \\equiv ${rhs}`), ", find the value of c."],
            },
            { question: [A.math(`${lhs} \\equiv ${rhs}`), " is an identity. Work out c."] },
          ],
          answer: A.number(c),
          wrong: [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.number(p.p * p.a - p.q * p.b),
              feedback: `−${p.q} × −${p.b} = +${p.q * p.b}.`,
            },
          ],
          solution: [
            {
              say: "Expand the left side: ",
              math: `${poly([p.p, p.p * p.a])} - ${p.q}x + ${p.q * p.b} = ${poly([p.p - p.q, c])}`,
            },
          ],
        });
      }
      default:
        return p.difference
          ? A.trueOrFalseWhy({
              rng,
              statement: [
                "Nia says ",
                A.math(`x^2 - ${p.a * p.a} \\equiv (x - ${p.a})(x + ${p.a})`),
                ".",
              ],
              truth: true,
              reasons: [
                {
                  text: `True. Expanding gives x² + ${p.a}x − ${p.a}x − ${p.a * p.a} = x² − ${p.a * p.a} for every x.`,
                  correct: true,
                },
                {
                  text: "False. It only works for some values of x.",
                  code: "ALG.EQUATION.IDENTITY",
                },
                { text: `False. It should be (x − ${p.a})².` },
              ],
              solution: [{ say: "This is the difference of two squares: it holds for every x." }],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: ["Nia says ", A.math(`(x + ${p.a})^2 \\equiv x^2 + ${p.a * p.a}`), "."],
              truth: false,
              reasons: [
                {
                  text: `False. (x + ${p.a})² = x² + ${2 * p.a}x + ${p.a * p.a}; the two sides are only equal when x = 0.`,
                  correct: true,
                },
                {
                  text: "True. Square each term in the bracket.",
                  code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
                },
                {
                  text: "True. It works when x = 0, so it is always true.",
                  code: "ALG.EQUATION.IDENTITY",
                },
              ],
              solution: [
                {
                  say:
                    "Test x = 1: the left side is " +
                    (1 + p.a) ** 2 +
                    " but the right side is " +
                    (1 + p.a * p.a) +
                    ".",
                },
              ],
            });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === p.p * p.a + p.q * p.b;
    return true;
  },
});
