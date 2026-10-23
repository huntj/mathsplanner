/**
 * @statement GF-R16.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R16.b: Solve decay problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  value: number;
  rate: number;
  years: number;
}

const halfYears = (rate: number) => {
  let n = 0;
  for (let v = 1; v >= 0.5; v *= 1 - rate / 100) n++;
  return n;
};

export default defineGenerator<Params>({
  id: "GF-R16.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return {
      value: rng.int(8, 40) * 1000,
      rate: rng.pick([10, 15, 20, 25, 30]),
      years: rng.int(2, 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const m = (1 - p.rate / 100).toFixed(2);
    switch (depth) {
      case 1: {
        const v = Math.round(p.value * (1 - p.rate / 100) ** p.years);
        return A.standard({
          question: [`A car is worth £${p.value}. It loses ${p.rate}% of its value each year.`],
          ask: `Find its value after ${p.years} years, to the nearest pound.`,
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.round(p.value * (1 - (p.rate * p.years) / 100)), { units: "£" }),
              feedback: "Each year's loss is a percentage of the new, smaller value.",
            },
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(Math.round(p.value * (p.rate / 100) ** p.years), { units: "£" }),
              feedback: `Losing ${p.rate}% leaves ${100 - p.rate}%: multiply by ${m}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.value} \\times ${m}^{${p.years}} \\approx ${v}` }],
        });
      }
      case 2: {
        const v = halfYears(p.rate);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A machine loses ${p.rate}% of its value every year.`],
              ask: "After how many whole years is it first worth less than half its original value?",
            },
            {
              question: [`A medicine's amount in the blood falls by ${p.rate}% every hour.`],
              ask: "After how many whole hours is less than half of it left?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.ceil(50 / p.rate)),
              feedback: `It does not lose ${p.rate}% of the original each time. Keep multiplying by ${m}.`,
            },
          ]),
          solution: [
            { say: `Keep multiplying by ${m}: `, math: `${m}^{${v - 1}} \\ge 0.5 > ${m}^{${v}}` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            `Decreasing by ${p.rate}% one year and ${p.rate}% the next is a ${2 * p.rate}% decrease overall.`,
          ],
          truth: "never",
          reasons: [
            {
              text: `Never. The second ${p.rate}% is of a smaller amount, so the total fall is ${2 * p.rate - (p.rate * p.rate) / 100}%.`,
              correct: true,
            },
            { text: "Always. You lose the same percentage twice.", code: "RAT.COMPOUND.SIMPLE" },
            { text: "Sometimes. It depends on the starting amount." },
          ],
          solution: [{ say: "", math: `${m}^2 = ${Number(((1 - p.rate / 100) ** 2).toFixed(4))}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(p.value * (1 - p.rate / 100) ** p.years);
    if (question.key.depth === 2) return numberAnswer(question) === halfYears(p.rate);
    return true;
  },
});
