/**
 * @statement Y9-RAT-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-RAT-03: Solve problems involving percentage change with repeated percentages (compound interest,
// depreciation)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  principal: number;
  rate: number;
  years: number;
  /** Depreciation: value and rate. */
  value: number;
  drop: number;
}

const pennies = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "Y9-RAT-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE"],

  params(rng, numbers) {
    return {
      principal: rng.int(5, numbers === "stretch" ? 200 : 50) * 100,
      rate: rng.pick(numbers === "friendly" ? [2, 5, 10] : [1.5, 2, 3, 4, 5, 6]),
      years: rng.int(2, numbers === "friendly" ? 3 : 8),
      value: rng.int(5, 40) * 1000,
      drop: rng.pick([10, 12, 15, 20, 25]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const m = 1 + p.rate / 100;
        const answer = pennies(p.principal * m ** p.years);
        const simple = pennies(p.principal * (1 + (p.rate * p.years) / 100));
        return A.standard({
          calculator: true,
          question: `£${p.principal.toLocaleString("en-GB")} is invested at ${p.rate}% compound interest per year.`,
          ask: `What is it worth after ${p.years} years, to the nearest penny?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(simple),
              feedback:
                "Compound interest is paid on the interest too, so multiply by the multiplier once for each year.",
            },
          ]),
          solution: [
            {
              say: `Multiplier ${m}, once for each year: £${p.principal.toLocaleString("en-GB")} × ${m}^${p.years} = £${answer.toFixed(2)}.`,
            },
          ],
        });
      }
      case 2: {
        const m = 1 - p.drop / 100;
        const answer = Math.round(p.value * m ** p.years);
        const simple = Math.round(p.value * (1 - (p.drop * p.years) / 100));
        return A.standard({
          calculator: true,
          question: `A car is worth £${p.value.toLocaleString("en-GB")}. It loses ${p.drop}% of its value each year.`,
          ask: `What is it worth after ${p.years} years, to the nearest pound?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(simple),
              feedback: `Each year it loses ${p.drop}% of its value that year, which gets smaller, so multiply by ${m} each year.`,
            },
          ]),
          solution: [
            {
              say: `Multiplier ${m}: £${p.value} × ${m}^${p.years} = £${answer.toLocaleString("en-GB")}.`,
            },
          ],
        });
      }
      default: {
        const once = pennies(100 * (1 + (p.rate * p.years) / 100));
        const compound = pennies(100 * (1 + p.rate / 100) ** p.years);
        return A.trueOrFalseWhy({
          rng,
          statement: `Ines says ${p.rate}% compound interest for ${p.years} years is the same as ${Number((p.rate * p.years).toFixed(1))}% interest paid once.`,
          truth: false,
          reasons: [
            {
              text: `False. Each year's interest also earns interest. On £100: compound gives £${compound.toFixed(2)}, but ${Number((p.rate * p.years).toFixed(1))}% once gives £${once.toFixed(2)}.`,
              correct: true,
            },
            {
              text: `True. ${p.years} lots of ${p.rate}% is ${Number((p.rate * p.years).toFixed(1))}%.`,
              code: "RAT.COMPOUND.SIMPLE",
            },
            { text: "True. Interest is always worked out on the original amount." },
          ],
          solution: [
            {
              say: `Compound: × ${1 + p.rate / 100} each year, not + ${p.rate}% of the original each year.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    if (question.key.depth === 1)
      return (
        Math.abs(numberAnswer(question) - p.principal * (1 + p.rate / 100) ** p.years) <=
        0.005 + 1e-9
      );
    return Math.abs(numberAnswer(question) - p.value * (1 - p.drop / 100) ** p.years) <= 0.5 + 1e-9;
  },
});
