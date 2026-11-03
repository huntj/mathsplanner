/**
 * @statement GF-R8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R8: Relate ratios to fractions and to linear functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-R8",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ORDER", "RAT.PROPORTION.LINEAR-INTERCEPT"],

  params(rng) {
    return { k: rng.int(2, 9), c: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `y = ${p.k}x`;
        return A.choice({
          rng,
          question: [
            "In a recipe, the ratio of water y to rice x is always ",
            A.math(`${p.k} : 1`),
            ".",
          ],
          ask: "Which equation links y and x?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x = ${p.k}y`),
              code: "RAT.ORDER",
              feedback: "y is the larger amount: y is " + p.k + " times x.",
            },
            {
              content: A.math(`y = x + ${p.k}`),
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
              feedback: "A ratio is multiplicative: y is a multiple of x.",
            },
          ],
          solution: [
            { say: `For every 1 cup of rice there are ${p.k} cups of water: `, math: right },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["y is directly proportional to x, and ", A.math(`y = ${p.k}x`), "."],
          ask: "What is the ratio x : y?",
          correct: `1 : ${p.k}`,
          distractors: [
            { content: `${p.k} : 1`, code: "RAT.ORDER", feedback: "x comes first in x : y." },
            { content: `1 : ${p.k + 1}`, feedback: "Compare y with x only." },
          ],
          solution: [{ say: `When x = 1, y = ${p.k}: x : y = 1 : ${p.k}.` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ravi says ",
                A.math(`y = ${p.k}x + ${p.c}`),
                " shows y in direct proportion to x, because its graph is a straight line.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Direct proportion needs a straight line through the origin. When x = 0, y = ${p.c}, not 0, so the ratio y : x keeps changing.`,
                  correct: true,
                },
                {
                  text: "True. Every straight line shows direct proportion.",
                  code: "RAT.PROPORTION.LINEAR-INTERCEPT",
                },
                {
                  text: "True. The gradient is the constant of proportion.",
                  code: "RAT.PROPORTION.LINEAR-INTERCEPT",
                },
              ],
              solution: [
                {
                  say: `x = 1 gives y = ${p.k + p.c}; x = 2 gives y = ${2 * p.k + p.c}. Doubling x does not double y.`,
                },
              ],
            }),
          [
            {
              statement: "Bea says $y = 5x$ shows y in direct proportion to x.",
              truth: true,
              right: "True. It is y = kx, a straight line through the origin.",
              wrong: [
                ["False. It needs a + c.", "RAT.PROPORTION.LINEAR-INTERCEPT"],
                ["False. y and x are equal."],
              ],
            },
            {
              claim: "If y is directly proportional to x, then when x = 0, y = 0.",
              truth: "always",
              right: "Always. y = kx gives y = 0 at x = 0.",
              wrong: [
                ["Never. y is the constant.", "RAT.PROPORTION.LINEAR-INTERCEPT"],
                ["Sometimes. If k is small."],
              ],
            },
            {
              statement:
                "y is directly proportional to x, and y = 15 when x = 3. Dev says y = 25 when x = 13.",
              truth: false,
              right: "False. k = 5, so when x = 13, y = 65.",
              wrong: [["True. Add 10 to both."], ["True. x went up 10, so y went up 10."]],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === `y = ${p.k}x`;
    if (question.archetype === "varied-form") return chosenText(question) === `1 : ${p.k}`;
    return true;
  },
});
