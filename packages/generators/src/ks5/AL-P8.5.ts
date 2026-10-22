/**
 * @statement AL-P8.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.5: Understand integration as the limit of a sum
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
}

const sumSquares = (from: number, to: number) => {
  let s = 0;
  for (let i = from; i <= to; i++) s += i * i;
  return s;
};

export default defineGenerator<Params>({
  id: "AL-P8.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.LIMIT-SUM"],

  params(rng) {
    return { n: rng.int(3, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The interval from a to b is split into strips of width ",
            A.math("\\delta x"),
            ".",
          ],
          ask: [
            "What does ",
            A.math("\\sum f(x)\\,\\delta x"),
            " tend to as ",
            A.math("\\delta x \\to 0"),
            "?",
          ],
          correct: A.math("\\int_a^b f(x)\\,dx"),
          distractors: [
            {
              content: A.math("f(b) - f(a)"),
              code: "CALC.LIMIT-SUM",
              feedback:
                "The sum of the strip areas tends to the area under the curve: the integral.",
            },
            {
              content: A.math("0"),
              code: "CALC.LIMIT-SUM",
              feedback:
                "Each strip gets thinner, but there are more of them; their total tends to the area.",
            },
            {
              content: A.math("f'(x)"),
              code: "CALC.LIMIT-SUM",
              feedback: "Summing areas gives an integral, not a derivative.",
            },
          ],
          solution: [{ say: "Integration is the limit of a sum of strip areas." }],
        });
      case 2: {
        const left = sumSquares(0, p.n - 1);
        const right = sumSquares(1, p.n);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Use ${p.n} rectangles of width 1, with heights taken at the left end of each strip, to estimate `,
                A.math(`\\int_0^{${p.n}} x^2\\,dx`),
                ".",
              ],
            },
          ],
          answer: A.number(left),
          wrong: wrongs(left, [
            {
              code: "CALC.LIMIT-SUM",
              value: A.number(right),
              feedback: "Left ends: use x = 0, 1, 2, … for the heights.",
            },
          ]),
          solution: [
            {
              say: `Heights 0², 1², …, ${p.n - 1}²: total ${left}. (The exact value is ${p.n ** 3}/3.)`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Lee says that using more, thinner rectangles makes the estimate of an area under a curve less accurate, because there are more rectangles to make errors.",
          truth: false,
          reasons: [
            {
              text: "False. Thinner rectangles follow the curve more closely; as their width tends to 0 the total tends to the exact area.",
              correct: true,
            },
            { text: "True. Each rectangle adds a little error.", code: "CALC.LIMIT-SUM" },
            { text: "True. The best estimate uses one big rectangle.", code: "CALC.LIMIT-SUM" },
          ],
          solution: [{ say: "The integral is defined as the limit of these sums." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === sumSquares(0, p.n - 1);
    if (question.key.depth === 1) return chosenText(question).includes("\\int_a^b");
    return true;
  },
});
