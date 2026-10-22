/**
 * @statement AL-P7.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.1a: Understand the derivative as gradient of a tangent and as a limit; differentiate from
// first principles for small positive integer powers of x
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.RATE.AVERAGE-INSTANT", "CALC.FIRST-PRINCIPLES"],

  params(rng) {
    return { a: rng.int(-5, 6), h: rng.pick([0.1, 0.01, 0.5, 0.2]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const g = Math.round((2 * p.a + p.h) * 1000) / 1000;
        return A.standard({
          question: [
            "The points with x-coordinates ",
            A.math(`${p.a}`),
            " and ",
            A.math(`${p.a} + ${p.h}`),
            " lie on the curve ",
            A.math("y = x^2"),
            ".",
          ],
          ask: "Work out the gradient of the chord joining them.",
          answer: A.number(g),
          wrong: signedWrongs(g, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(2 * p.a),
              feedback:
                "That is the gradient of the tangent. The chord's gradient is the change in y over the change in x.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{(${p.a} + ${p.h})^2 - (${p.a})^2}{${p.h}} = 2(${p.a}) + ${p.h} = ${g}`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "For ",
            A.math("f(x) = x^3"),
            ", the gradient of a chord is ",
            A.math("\\frac{f(x + h) - f(x)}{h} = 3x^2 + 3xh + h^2"),
            ".",
          ],
          ask: "What is f′(x), from first principles?",
          correct: A.math("3x^2"),
          distractors: [
            {
              content: A.math("3x^2 + 3xh + h^2"),
              code: "CALC.FIRST-PRINCIPLES",
              feedback: "Take the limit as h → 0: the terms in h vanish.",
            },
            {
              content: A.math("\\frac{0}{0}"),
              code: "CALC.FIRST-PRINCIPLES",
              feedback: "Simplify first, then let h → 0.",
            },
            {
              content: A.math("x^2"),
              code: "CALC.FIRST-PRINCIPLES",
              feedback: "The coefficient 3 does not depend on h, so it stays.",
            },
          ],
          solution: [{ say: "As h → 0, 3xh + h² → 0, so f′(x) = 3x²." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zoe says you can find the derivative of ",
            A.math("x^2"),
            " by putting h = 0 straight into ",
            A.math("\\frac{(x + h)^2 - x^2}{h}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. h = 0 gives 0/0. First simplify to 2x + h, then let h tend to 0 to get 2x.",
              correct: true,
            },
            { text: "True. The derivative is the value at h = 0.", code: "CALC.FIRST-PRINCIPLES" },
            { text: "True. Any fraction with h = 0 is 0.", code: "CALC.FIRST-PRINCIPLES" },
          ],
          solution: [
            { say: "A derivative is a limit: simplify the chord gradient, then let h → 0." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return Math.abs(numberAnswer(question) - (2 * p.a + p.h)) < 1e-9;
    if (question.key.depth === 2)
      return chosenText(question) === "3x^2" || chosenText(question).includes("3x^2");
    return true;
  },
});
