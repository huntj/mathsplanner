/**
 * @statement GF-R16.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R16.c: Calculate compound interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  principal: number;
  rate: number;
  years: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R16.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return { principal: rng.int(5, 80) * 100, rate: rng.int(2, 6), years: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const m = (1 + p.rate / 100).toFixed(2);
    const amount = r2(p.principal * (1 + p.rate / 100) ** p.years);
    switch (depth) {
      case 1:
        return A.standard({
          question: [`£${p.principal} is invested at ${p.rate}% compound interest per year.`],
          ask: `How much is the investment worth after ${p.years} years? Give your answer to the nearest penny.`,
          answer: A.number(amount, { units: "£" }),
          wrong: wrongs(amount, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(r2(p.principal * (1 + (p.rate * p.years) / 100)), { units: "£" }),
              feedback: "That is simple interest. Compound interest is paid on the interest too.",
            },
          ]),
          solution: [
            { say: "", math: `${p.principal} \\times ${m}^{${p.years}} = ${amount.toFixed(2)}` },
          ],
        });
      case 2: {
        const interest = r2(amount - p.principal);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`Ada saves £${p.principal} at ${p.rate}% compound interest per year.`],
              ask: `How much interest does she earn in ${p.years} years, to the nearest penny?`,
            },
            {
              question: [
                `A loan of £${p.principal} grows at ${p.rate}% compound interest per year.`,
              ],
              ask: `How much interest is added in ${p.years} years, to the nearest penny?`,
            },
          ],
          answer: A.number(interest, { units: "£" }),
          wrong: wrongs(interest, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(r2((p.principal * p.rate * p.years) / 100), { units: "£" }),
              feedback: "Each year's interest is on the new total, so it grows each year.",
            },
          ]),
          solution: [
            { say: "", math: `${amount.toFixed(2)} - ${p.principal} = ${interest.toFixed(2)}` },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: [
            `Ben works out the value of £${p.principal} after ${p.years} years at ${p.rate}% compound interest.`,
          ],
          lines: [
            [A.math(`\\text{multiplier} = ${(p.rate / 100).toFixed(2)}`)],
            [
              A.math(
                `${p.principal} \\times ${(p.rate / 100).toFixed(2)}^{${p.years}} = ${r2(p.principal * (p.rate / 100) ** p.years)}`,
              ),
            ],
          ],
          mistake: 0,
          code: "RAT.PERCENT.MULTIPLIER",
          feedback: `The multiplier keeps the 100% too: ${m}. So it is ${p.principal} × ${m}^${p.years} = £${amount.toFixed(2)}.`,
        });
    }
  },

  verify(p, question) {
    const amount = r2(p.principal * (1 + p.rate / 100) ** p.years);
    if (question.key.depth === 1) return numberAnswer(question) === amount;
    if (question.key.depth === 2) return numberAnswer(question) === r2(amount - p.principal);
    return true;
  },
});
