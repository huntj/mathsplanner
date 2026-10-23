/**
 * @statement Y9-ALG-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-05.b: Interpret gradients and intercepts graphically and algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  rate: number;
  fixed: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-05.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "RAT.PROPORTION.LINEAR-INTERCEPT", "ALG.GRADIENT.STEEPNESS"],

  params(rng) {
    return { rate: rng.int(2, 9) * 5, fixed: rng.int(2, 12) * 5, h: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "A plumber's charge, C pounds, for a job lasting h hours is ",
            A.math(`C = ${p.rate}h + ${p.fixed}`),
            ".",
          ],
          ask: `What does the ${p.fixed} stand for?`,
          correct: "A fixed call-out charge",
          distractors: [
            {
              content: "The cost of each hour",
              code: "ALG.LINE.M-C",
              feedback: `The cost per hour is the number with h, ${p.rate}.`,
            },
            {
              content: "The number of hours worked",
              feedback: "h stands for the number of hours.",
            },
          ],
          solution: [{ say: `When h = 0, C = ${p.fixed}: the charge before any work is done.` }],
        });
      case 2: {
        const total = p.fixed + p.rate * p.h;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The graph of a plumber's charges is a straight line through (0, ${p.fixed}) and (${p.h}, ${total}).`,
              ],
              ask: "How much does the plumber charge per hour, in pounds?",
            },
          ],
          answer: A.number(p.rate),
          wrong: wrongs(p.rate, [
            {
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
              value: A.number(Math.round((total / p.h) * 100) / 100),
              feedback: `The line does not start at 0: the rate is the gradient, (${total} − ${p.fixed}) ÷ ${p.h}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${total} - ${p.fixed}}{${p.h}} = ${p.rate}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A line with a bigger gradient is steeper."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. y = 2x is steeper than y = x, but y = −5x is steeper than both, despite its smaller (negative) gradient. Steepness depends on the size of the gradient.",
              correct: true,
            },
            { text: "Always. A bigger number means steeper.", code: "ALG.GRADIENT.STEEPNESS" },
            { text: "Never. Bigger gradients are flatter.", code: "ALG.GRADIENT.STEEPNESS" },
          ],
          solution: [{ say: "Compare the gradients ignoring their signs." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === "A fixed call-out charge";
    if (question.key.depth === 2) return numberAnswer(question) === p.rate;
    return true;
  },
});
