/**
 * @statement Y8-RAT-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-04.a: Solve direct proportion problems numerically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  rate: number;
  pounds: number;
  h1: number;
  pay: number;
  h2: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION", "RAT.ADDITIVE"],

  params(rng) {
    const p = {
      rate: rng.pick([1.1, 1.2, 1.25, 1.4, 1.5]),
      pounds: rng.int(2, 40) * 10,
      h1: rng.int(2, 8),
      pay: rng.int(9, 15),
      h2: rng.int(3, 20),
    };
    if (p.h1 === p.h2) reject("different hours");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r2(p.pounds * p.rate);
        return A.standard({
          question: [`The exchange rate is £1 = €${p.rate}.`],
          ask: `How many euros do you get for £${p.pounds}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(r2(p.pounds / p.rate)),
              feedback: `Each pound is worth €${p.rate}, so multiply.`,
            },
          ]),
          solution: [{ say: "", math: `${p.pounds} \\times ${p.rate} = ${v}` }],
        });
      }
      case 2: {
        const earned = p.pay * p.h1;
        const v = p.pay * p.h2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`Sam earns £${earned} for ${p.h1} hours of work.`],
              ask: `How much does he earn for ${p.h2} hours, in pounds?`,
            },
            {
              question: [`${p.h1} m of fabric costs £${earned}.`],
              ask: `How much do ${p.h2} m cost, in pounds?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(earned + (p.h2 - p.h1)),
              feedback: `Find the cost of 1 first (£${p.pay}), then multiply by ${p.h2}.`,
            },
          ]),
          solution: [{ say: "", math: `${earned} \\div ${p.h1} \\times ${p.h2} = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["If y is directly proportional to x, then when x goes up by 2, y goes up by 2."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. y = kx goes up by 2k, so it is 2 only when k = 1. With y = 3x, y goes up by 6.",
              correct: true,
            },
            {
              text: "Always. Proportional means they change by the same amount.",
              code: "RAT.ADDITIVE",
            },
            { text: "Never. y always goes up by more than x.", code: "RAT.ADDITIVE" },
          ],
          solution: [{ say: "Direct proportion keeps the ratio y ÷ x fixed, not the difference." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.pounds * p.rate);
    if (question.key.depth === 2) return numberAnswer(question) === p.pay * p.h2;
    return true;
  },
});
