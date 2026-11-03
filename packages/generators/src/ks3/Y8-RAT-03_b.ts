/**
 * @statement Y8-RAT-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-03.b: Find percentage increases and decreases
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  amount: number;
  up: number;
  down: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-03.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP", "RAT.PERCENT.MULTIPLIER", "RAT.COMPOUND.SIMPLE"],

  params(rng) {
    return {
      amount: rng.int(4, 60) * 5,
      up: rng.pick([5, 10, 15, 20, 25, 30, 40]),
      down: rng.pick([5, 10, 15, 20, 25, 30, 35]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r2((p.amount * (100 + p.up)) / 100);
        return A.standard({
          question: [`A gym membership costs £${p.amount}. The price goes up by ${p.up}%.`],
          ask: "What is the new price, in pounds?",
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(r2((p.amount * p.up) / 100), { units: "£" }),
              feedback: "That is the increase. Add it to the original price.",
            },
          ]),
          solution: [{ say: "", math: `${p.amount} \\times ${r2(1 + p.up / 100)} = ${v}` }],
        });
      }
      case 2: {
        const v = r2((p.amount * (100 - p.down)) / 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A jacket costs £${p.amount}. In a sale it is reduced by ${p.down}%.`],
              ask: "What is the sale price, in pounds?",
            },
            {
              question: [
                `A car park had ${p.amount} cars on Monday. On Tuesday there were ${p.down}% fewer.`,
              ],
              ask: "How many cars were there on Tuesday?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(r2((p.amount * (100 + p.down)) / 100)),
              feedback: `A decrease leaves ${100 - p.down}%: multiply by ${r2(1 - p.down / 100)}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.amount} \\times ${r2(1 - p.down / 100)} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Ben says increasing a price by ${p.up}% and then by another ${p.up}% is the same as one increase of ${2 * p.up}%.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The second ${p.up}% is of the bigger price, so the total rise is ${r2(((1 + p.up / 100) ** 2 - 1) * 100)}%.`,
                  correct: true,
                },
                { text: "True. Percentages add up.", code: "RAT.COMPOUND.SIMPLE" },
                { text: `True. ${p.up} + ${p.up} = ${2 * p.up}.`, code: "RAT.COMPOUND.SIMPLE" },
              ],
              solution: [
                { say: "", math: `${r2(1 + p.up / 100)}^2 = ${r2((1 + p.up / 100) ** 2)}` },
              ],
            }),
          [
            {
              statement: "To increase £80 by 15%, Ian works out $80 \\times 1.15$.",
              truth: true,
              right: "True. 100% + 15% = 115%, which is 1.15.",
              wrong: [
                ["False. He should work out 80 × 0.15.", "RAT.PERCENT.MULTIPLIER"],
                ["False. He should work out 80 × 1.5."],
              ],
            },
            {
              statement: "Gia decreases £60 by 25% and says the new price is £15.",
              truth: false,
              right: "False. £15 is the decrease. The new price is £60 − £15 = £45.",
              wrong: [
                ["True. 25% of 60 is 15.", "AS.MULTISTEP.ONE-STEP"],
                ["True. Multiply by 0.25 to take off 25%.", "RAT.PERCENT.MULTIPLIER"],
              ],
            },
            {
              claim:
                "Increasing an amount by 10% and then decreasing the result by 10% gets back to the start.",
              truth: "never",
              right: "Never. The decrease is 10% of a bigger amount: 100 → 110 → 99.",
              wrong: [
                ["Always. The two changes cancel out.", "RAT.COMPOUND.SIMPLE"],
                ["Sometimes. Only for multiples of 10."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2((p.amount * (100 + p.up)) / 100);
    if (question.key.depth === 2)
      return numberAnswer(question) === r2((p.amount * (100 - p.down)) / 100);
    return true;
  },
});
