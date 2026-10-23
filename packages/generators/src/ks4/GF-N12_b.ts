/**
 * @statement GF-N12.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N12.b: Use percentages as operators and multipliers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  amount: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-N12.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.MULTIPLIER", "RAT.PERCENT.UNDO"],

  params(rng) {
    return { p: rng.int(2, 60), amount: rng.int(4, 80) * 5 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r(1 + p.p / 100);
        return A.standard({
          question: [`What decimal multiplier increases an amount by ${p.p}%?`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(r(p.p / 100)),
              feedback: `× ${r(p.p / 100)} finds ${p.p}% of the amount. To increase, keep the 100% too: ${100 + p.p}%.`,
            },
          ]),
          solution: [{ say: `${100 + p.p}% = `, math: String(v) }],
        });
      }
      case 2: {
        const v = r((p.amount * (100 - p.p)) / 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A price of £${p.amount} is reduced by ${p.p}%.`],
              ask: "Use a multiplier to find the new price, in pounds.",
            },
            {
              question: [`A car worth £${p.amount * 100} loses ${p.p}% of its value.`],
              ask: "Find its new value in hundreds of pounds.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(r((p.amount * p.p) / 100)),
              feedback: `That is the decrease. Multiply by ${r(1 - p.p / 100)} to find what is left.`,
            },
          ]),
          solution: [{ say: "", math: `${p.amount} \\times ${r(1 - p.p / 100)} = ${v}` }],
        });
      }
      default: {
        const end = r(100 * (1 + p.p / 100) * (1 - p.p / 100));
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Gil says increasing an amount by ${p.p}% and then decreasing it by ${p.p}% gets back to the start.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The decrease is ${p.p}% of a bigger amount. Starting from 100: 100 × ${r(1 + p.p / 100)} × ${r(1 - p.p / 100)} = ${end}.`,
              correct: true,
            },
            { text: "True. The two changes cancel out.", code: "RAT.PERCENT.UNDO" },
            {
              text: "True. Adding and subtracting the same thing gets back to the start.",
              code: "RAT.PERCENT.UNDO",
            },
          ],
          solution: [
            {
              say: "Combine the multipliers: ",
              math: `${r(1 + p.p / 100)} \\times ${r(1 - p.p / 100)} = ${r((1 + p.p / 100) * (1 - p.p / 100))}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r(1 + p.p / 100);
    if (question.key.depth === 2)
      return numberAnswer(question) === r((p.amount * (100 - p.p)) / 100);
    return true;
  },
});
