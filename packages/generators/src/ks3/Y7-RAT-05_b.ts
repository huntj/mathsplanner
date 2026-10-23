/**
 * @statement Y7-RAT-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-05.b: Interpret percentage changes as fractions or decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-RAT-05.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return { p: rng.int(2, 18) * 5, q: rng.pick([10, 20, 25, 50, 75]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r(1 - p.p / 100);
        return A.standard({
          question: [`What decimal do you multiply by to decrease an amount by ${p.p}%?`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(r(p.p / 100)),
              feedback: `× ${r(p.p / 100)} finds the ${p.p}% taken off. What is left is ${100 - p.p}%.`,
            },
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(r(1 + p.p / 100)),
              feedback: "That increases the amount.",
            },
          ]),
          solution: [{ say: `${100 - p.p}% is left: `, math: String(v) }],
        });
      }
      case 2: {
        const v = frac(100 + p.q, 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A ${p.q}% increase is the same as multiplying by which fraction?`],
              ask: "Give your answer in its simplest form.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.exact(frac(p.q, 100)),
              feedback: `That finds only the increase. The new amount is ${100 + p.q}% of the old one.`,
            },
          ],
          solution: [
            { say: "", math: `${100 + p.q}\\% = \\frac{${100 + p.q}}{100} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Rae says multiplying by 0.8 decreases an amount by 20%."],
          truth: true,
          reasons: [
            { text: "True. 0.8 = 80%, so 80% is left and 20% has been taken away.", correct: true },
            { text: "False. It decreases it by 80%.", code: "RAT.PERCENT.MULTIPLIER" },
            {
              text: "False. Multiplying always increases an amount.",
              code: "RAT.PERCENT.MULTIPLIER",
            },
          ],
          solution: [{ say: "Multiplier = 1 − the decrease as a decimal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r(1 - p.p / 100);
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(100 + p.q, 100));
    return true;
  },
});
