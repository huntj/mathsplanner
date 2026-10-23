/**
 * @statement GF-R9.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R9.c: Find an original value (reverse percentages)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  orig: number;
  up: number;
  down: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R9.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.REVERSE"],

  params(rng) {
    return {
      orig: rng.int(2, 40) * 20,
      up: rng.pick([5, 10, 15, 20, 25, 40, 50]),
      down: rng.pick([5, 10, 15, 20, 25, 30, 40]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const now = (p.orig * (100 + p.up)) / 100;
        return A.standard({
          question: [`After a ${p.up}% pay rise, Ana earns £${now} a week.`],
          ask: "What did she earn before the rise?",
          answer: A.number(p.orig, { units: "£" }),
          wrong: wrongs(p.orig, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(r2((now * (100 - p.up)) / 100), { units: "£" }),
              feedback: `£${now} is ${100 + p.up}% of the original, so divide by ${(100 + p.up) / 100}.`,
            },
          ]),
          solution: [{ say: "", math: `${now} \\div ${(100 + p.up) / 100} = ${p.orig}` }],
        });
      }
      case 2: {
        const now = (p.orig * (100 - p.down)) / 100;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `In a sale, prices are reduced by ${p.down}%. A bike costs £${now} in the sale.`,
              ],
              ask: "What was its price before the sale?",
            },
            {
              question: [
                `An old bike loses ${p.down}% of its value in a year. It is now worth £${now}.`,
              ],
              ask: "What was it worth a year ago?",
            },
          ],
          answer: A.number(p.orig, { units: "£" }),
          wrong: wrongs(p.orig, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(r2((now * (100 + p.down)) / 100), { units: "£" }),
              feedback: `£${now} is ${100 - p.down}% of the original, so divide by ${(100 - p.down) / 100}.`,
            },
          ]),
          solution: [{ say: "", math: `${now} \\div ${(100 - p.down) / 100} = ${p.orig}` }],
        });
      }
      default: {
        const now = (p.orig * (100 + p.up)) / 100;
        const slip = r2((now * p.up) / 100);
        return A.spotTheMistake({
          question: [`A price is £${now} after a ${p.up}% increase. Raj finds the original price.`],
          lines: [
            [A.math(`${p.up}\\% \\text{ of } ${now} = ${slip}`)],
            [A.math(`${now} - ${slip} = ${r2(now - slip)}`)],
          ],
          mistake: 0,
          code: "RAT.PERCENT.REVERSE",
          feedback: `The ${p.up}% was of the original, not of £${now}. £${now} is ${100 + p.up}%, so the original is ${now} ÷ ${(100 + p.up) / 100} = £${p.orig}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.orig;
    return true;
  },
});
