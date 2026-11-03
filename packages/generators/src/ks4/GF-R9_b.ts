/**
 * @statement GF-R9.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R9.b: Use percentages over 100%
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  pct: number;
  amount: number;
}

export default defineGenerator<Params>({
  id: "GF-R9.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return { pct: rng.int(22, 50) * 5, amount: rng.int(2, 30) * 20 };
  },

  build(p, depth, rng): QuestionDraft {
    const v = (p.amount * p.pct) / 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: [`Find ${p.pct}% of ${p.amount}.`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number((p.amount * (p.pct - 100)) / 100),
              feedback: `${p.pct}% is more than the whole amount: multiply by ${p.pct / 100}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.amount} \\times ${p.pct / 100} = ${v}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A house was bought for £${p.amount}k. It is now worth £${v}k.`],
              ask: "Write its value now as a percentage of what it was bought for.",
            },
            {
              question: [`A plant was ${p.amount} mm tall. It is now ${v} mm tall.`],
              ask: "Write its height now as a percentage of its height before.",
            },
          ],
          answer: A.number(p.pct, { units: "%" }),
          wrong: wrongs(p.pct, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(p.pct - 100, { units: "%" }),
              feedback:
                "That is the increase. The question asks for the whole new value as a percentage.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${v}}{${p.amount}} \\times 100 = ${p.pct}\\%` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A percentage can be more than 100%."],
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. A test score cannot be more than 100%, but a value can grow to ${p.pct}% of what it was.`,
                  correct: true,
                },
                {
                  text: "Never. 100% is the whole, so you cannot have more.",
                  code: "RAT.PERCENT.MULTIPLIER",
                },
                { text: "Always. Any number can be a percentage." },
              ],
              solution: [
                { say: "Comparing a new value with an old one can give a percentage over 100." },
              ],
            }),
          [
            {
              statement: "Leo says to increase £60 by 15%, multiply by 1.15.",
              truth: true,
              right: "True. 100% + 15% = 115% = 1.15.",
              wrong: [
                ["False. Multiply by 0.15.", "RAT.PERCENT.MULTIPLIER"],
                ["False. Multiply by 1.5.", "RAT.PERCENT.MULTIPLIER"],
              ],
            },
            {
              claim: "Multiplying by 0.9 decreases an amount by 10%.",
              truth: "always",
              right: "Always. 0.9 is 90%, so 10% is taken off.",
              wrong: [
                ["Never. It decreases by 90%.", "RAT.PERCENT.MULTIPLIER"],
                ["Sometimes. Only for whole numbers."],
              ],
            },
            {
              statement: "Ana says to decrease an amount by 4%, multiply by 0.4.",
              truth: false,
              right: "False. 100% − 4% = 96%: multiply by 0.96.",
              wrong: [
                ["True. 4% is 0.4.", "RAT.PERCENT.MULTIPLIER"],
                ["True. Multiply by the percentage.", "RAT.PERCENT.MULTIPLIER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.amount * p.pct) / 100;
    if (question.key.depth === 2) return numberAnswer(question) === p.pct;
    return true;
  },
});
