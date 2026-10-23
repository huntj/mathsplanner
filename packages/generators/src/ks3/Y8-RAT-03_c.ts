/**
 * @statement Y8-RAT-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-03.c: Find an original value (reverse percentages)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  orig: number;
  off: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-03.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.REVERSE"],

  params(rng) {
    return { orig: rng.int(3, 50) * 20, off: rng.pick([10, 15, 20, 25, 30, 40]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const now = r2(p.orig * 1.2);
        return A.standard({
          question: [`A TV costs £${now} including VAT at 20%.`],
          ask: "What is the price before VAT, in pounds?",
          answer: A.number(p.orig, { units: "£" }),
          wrong: wrongs(p.orig, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(r2(now * 0.8), { units: "£" }),
              feedback: `The 20% was added to the original price, not to £${now}. £${now} is 120%, so divide by 1.2.`,
            },
          ]),
          solution: [{ say: "", math: `${now} \\div 1.2 = ${p.orig}` }],
        });
      }
      case 2: {
        const now = r2((p.orig * (100 - p.off)) / 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`In a sale everything is ${p.off}% off. A sofa now costs £${now}.`],
              ask: "What was its original price, in pounds?",
            },
            {
              question: [`After a ${p.off}% discount a laptop costs £${now}.`],
              ask: "What was the price before the discount, in pounds?",
            },
          ],
          answer: A.number(p.orig, { units: "£" }),
          wrong: wrongs(p.orig, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(r2((now * (100 + p.off)) / 100), { units: "£" }),
              feedback: `£${now} is ${100 - p.off}% of the original: divide by ${r2(1 - p.off / 100)}.`,
            },
          ]),
          solution: [{ say: "", math: `${now} \\div ${r2(1 - p.off / 100)} = ${p.orig}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["To undo a 20% increase, take 20% off the new amount."],
          truth: "never",
          reasons: [
            {
              text: "Never. 20% of the new, bigger amount is more than the original increase. Divide by 1.2 instead.",
              correct: true,
            },
            { text: "Always. Doing the opposite undoes it.", code: "RAT.PERCENT.REVERSE" },
            { text: "Sometimes. It works for small amounts.", code: "RAT.PERCENT.REVERSE" },
          ],
          solution: [{ say: "Check: £100 → £120, but 20% off £120 is £96." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.orig;
    return true;
  },
});
