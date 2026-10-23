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

interface Params {
  pct: number;
  amount: number;
}

export default defineGenerator<Params>({
  id: "GF-R9.b",
  version: "1.0.0",
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
        return A.alwaysSometimesNever({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.amount * p.pct) / 100;
    if (question.key.depth === 2) return numberAnswer(question) === p.pct;
    return true;
  },
});
