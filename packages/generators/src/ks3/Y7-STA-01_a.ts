/**
 * @statement Y7-STA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-STA-01.a: Find the mean
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  xs: number[];
  m: number;
  three: number[];
}

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

export default defineGenerator<Params>({
  id: "Y7-STA-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP", "STA.MEAN.DIVISOR"],

  params(rng) {
    const xs = Array.from({ length: 5 }, () => rng.int(2, 20));
    const p = { xs, m: rng.int(6, 15), three: [rng.int(2, 20), rng.int(2, 20), rng.int(2, 20)] };
    if (sum(xs) % 5 !== 0) reject("a whole-number mean");
    if (4 * p.m - sum(p.three) <= 0) reject("a positive fourth value");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sum(p.xs) / 5;
        return A.standard({
          question: [`Five pupils scored ${p.xs.join(", ")} in a quiz.`],
          ask: "Find the mean score.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(sum(p.xs)),
              feedback: "That is the total. Divide it by the number of pupils, 5.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${sum(p.xs)}}{5} = ${v}` }],
        });
      }
      case 2: {
        const v = 4 * p.m - sum(p.three);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The mean of four numbers is ${p.m}. Three of them are ${p.three.join(", ")}.`,
              ],
              ask: "Find the fourth number.",
            },
            {
              question: [
                `Ali's mean score in four tests is ${p.m}. His first three scores were ${p.three.join(", ")}.`,
              ],
              ask: "What did he score in the fourth test?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(3 * p.m - sum(p.three)),
              feedback: `The total of all four is 4 × ${p.m} = ${4 * p.m}.`,
            },
          ]),
          solution: [{ say: "", math: `4 \\times ${p.m} - ${sum(p.three)} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["The mean of a set of data is one of the data values."],
              truth: "sometimes",
              reasons: [
                {
                  text: "Sometimes. The mean of 2, 4 and 6 is 4, which is in the data, but the mean of 1 and 2 is 1.5, which is not.",
                  correct: true,
                },
                { text: "Always. An average is a typical value.", code: "STA.MEAN.DIVISOR" },
                { text: "Never. The mean is always a decimal." },
              ],
              solution: [
                { say: "The mean shares the total equally; it need not be a value in the list." },
              ],
            }),
          [
            {
              statement: `Jo says the mean of ${p.xs.join(", ")} is ${sum(p.xs) / 5}.`,
              truth: true,
              right: `True. The total is ${sum(p.xs)}, and ${sum(p.xs)} ÷ 5 = ${sum(p.xs) / 5}.`,
              wrong: [
                [`False. Divide by 2: ${sum(p.xs) / 2}.`, "STA.MEAN.DIVISOR"],
                [`False. The mean is the total, ${sum(p.xs)}.`, "AS.MULTISTEP.ONE-STEP"],
              ],
            },
            {
              statement: "Kim says the mean of 3, 5 and 10 is 18 ÷ 2 = 9.",
              truth: false,
              right: "False. There are 3 values, so divide by 3: 18 ÷ 3 = 6.",
              wrong: [
                ["True. Divide the total by 2 to find an average.", "STA.MEAN.DIVISOR"],
                ["True. 9 is between the smallest and largest values."],
              ],
            },
            {
              claim:
                "The mean of a set of data is between its smallest and largest values (or equal to one of them).",
              truth: "always",
              right:
                "Always. Sharing the total out equally can never give more than the largest value or less than the smallest.",
              wrong: [
                ["Sometimes. One very large value can push the mean above them all."],
                ["Never. The mean is always one of the values."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sum(p.xs) / 5;
    if (question.key.depth === 2) return numberAnswer(question) === 4 * p.m - sum(p.three);
    return true;
  },
});
