/**
 * @statement GF-R16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R16: Set up, solve and interpret the answers in growth and decay problems, including compound
// interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  principal: number;
  rate: number;
  years: number;
  value: number;
  dep: number;
  pop: number;
  growth: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R16",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return {
      principal: rng.int(5, 50) * 100,
      rate: rng.int(2, 6),
      years: rng.int(2, 5),
      value: rng.int(8, 30) * 1000,
      dep: rng.pick([10, 15, 20, 25]),
      pop: rng.int(20, 90) * 100,
      growth: rng.pick([2, 3, 4, 5]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = r2(p.principal * (1 + p.rate / 100) ** p.years);
        const simple = r2(p.principal * (1 + (p.rate * p.years) / 100));
        return A.standard({
          question: `£${p.principal} is invested at ${p.rate}% compound interest per year.`,
          ask: `How much is it worth after ${p.years} years, to the nearest penny?`,
          answer: A.number(total, { units: "£", accuracy: { dp: 2 } }),
          wrong: wrongs(total, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(simple),
              feedback:
                "Compound interest is added to the balance each year, so each year's interest is on a bigger amount.",
            },
          ]),
          solution: [
            { say: `£${p.principal} × ${1 + p.rate / 100}^${p.years} = £${total.toFixed(2)}.` },
          ],
        });
      }
      case 2: {
        const m = (100 - p.dep) / 100;
        const right = `${m}^{n}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A car loses ${p.dep}% of its value every year.`,
          ask: "After n years, its value is the original value multiplied by:",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${p.dep / 100}^{n}`),
              code: "RAT.PERCENT.MULTIPLIER",
              feedback: `The car keeps ${100 - p.dep}% of its value each year.`,
            },
            {
              content: A.math(`1 - ${(p.dep * 1) / 100}n`),
              code: "RAT.COMPOUND.SIMPLE",
              feedback: "The loss is a percentage of the current value, which keeps changing.",
            },
          ],
          solution: [{ say: `Each year × ${m}, so after n years × `, math: right }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `A population of ${p.pop} grows by ${p.growth}% each year. Nia says after 10 years it will have grown by exactly ${p.growth * 10}%.`,
          truth: false,
          reasons: [
            {
              text: `False. Each year's growth is on a larger population: × ${1 + p.growth / 100}¹⁰ ≈ ${r2((1 + p.growth / 100) ** 10)}, a rise of about ${Math.round(((1 + p.growth / 100) ** 10 - 1) * 100)}%.`,
              correct: true,
            },
            {
              text: `True. ${p.growth}% a year for 10 years is ${p.growth * 10}%.`,
              code: "RAT.COMPOUND.SIMPLE",
            },
            {
              text: "True. Growth is always the same amount each year.",
              code: "RAT.COMPOUND.SIMPLE",
            },
          ],
          solution: [
            {
              say: "Repeated percentage change multiplies: use the multiplier to the power of the number of years.",
            },
          ],
        });
      default: {
        const m = (100 - p.dep) / 100;
        const after1 = r2(p.value * m);
        const after3 = r2(p.value * m ** 3);
        return A.multiStepContext({
          context: `A car is worth £${p.value}. It loses ${p.dep}% of its value each year.`,
          parts: [
            {
              ask: "What is it worth after 1 year?",
              answer: A.number(after1, { units: "£" }),
              wrong: wrongs(after1, [
                {
                  code: "RAT.PERCENT.MULTIPLIER",
                  value: A.number(r2((p.value * p.dep) / 100)),
                  feedback: "That is the loss. Subtract it, or multiply by " + m + ".",
                },
              ]),
            },
            {
              ask: "What is it worth after 3 years, to the nearest pound?",
              answer: A.number(Math.round(after3), { units: "£", accuracy: { dp: 0 } }),
              wrong: wrongs(Math.round(after3), [
                {
                  code: "RAT.COMPOUND.SIMPLE",
                  value: A.number(Math.round(p.value * (1 - (3 * p.dep) / 100))),
                  feedback: "The percentage is taken from the new value each year.",
                },
              ]),
            },
          ],
          solution: [
            { say: `£${p.value} × ${m} = £${after1}.` },
            { say: `£${p.value} × ${m}³ = £${after3} ≈ £${Math.round(after3)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - p.principal * (1 + p.rate / 100) ** p.years) < 0.006;
    if (question.archetype === "varied-form")
      return chosenText(question) === `${(100 - p.dep) / 100}^{n}`;
    return true;
  },
});
