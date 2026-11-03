/**
 * @statement Y9-RAT-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-RAT-03.b: Calculate depreciation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  value: number;
  d: number;
  years: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y9-RAT-03.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return { value: rng.int(5, 30) * 1000, d: rng.pick([10, 15, 20, 25]), years: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const m = 1 - p.d / 100;
    switch (depth) {
      case 1: {
        const v = Math.round(p.value * m ** p.years);
        return A.standard({
          question: [`A van is worth £${p.value}. It depreciates by ${p.d}% each year.`],
          ask: `Find its value after ${p.years} years, to the nearest pound.`,
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.round(p.value * (1 - (p.d * p.years) / 100)), { units: "£" }),
              feedback: "Each year it loses a percentage of its new, lower value.",
            },
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(Math.round(p.value * (1 + p.d / 100) ** p.years), { units: "£" }),
              feedback: `Depreciation is a decrease: multiply by ${m}, not ${1 + p.d / 100}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.value} \\times ${m}^{${p.years}} \\approx ${v}` }],
        });
      }
      case 2: {
        const v = r2(m * m * 100);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A phone loses ${p.d}% of its value each year.`],
              ask: "What percentage of its original value is it worth after 2 years?",
            },
          ],
          answer: A.number(v, { units: "%" }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(100 - 2 * p.d, { units: "%" }),
              feedback: `The second ${p.d}% is taken from a smaller value: ${m} × ${m} = ${r2(m * m)}.`,
            },
          ]),
          solution: [{ say: "", math: `${m}^2 = ${r2(m * m)} = ${v}\\%` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Abi says that a car losing ${p.d}% of its value every year will be worth nothing after ${100 / p.d} years.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Each year it keeps ${100 - p.d}% of its value, so it gets smaller and smaller but never reaches zero: after ${100 / p.d} years it is worth about ${r2(m ** (100 / p.d) * 100)}% of the original.`,
                  correct: true,
                },
                { text: `True. ${100 / p.d} × ${p.d}% = 100%.`, code: "RAT.COMPOUND.SIMPLE" },
                { text: "True. Depreciation always ends at zero.", code: "RAT.COMPOUND.SIMPLE" },
              ],
              solution: [
                {
                  say: "Repeated percentage decrease multiplies; it never subtracts the whole value.",
                },
              ],
            }),
          [
            {
              statement:
                "A £20 000 car loses 15% of its value each year. Tom works out its value after 2 years as $20\\,000 \\times 0.85^2$.",
              truth: true,
              right: "True. Losing 15% leaves 85%, so multiply by 0.85 for each year.",
              wrong: [
                ["False. It is 20 000 × 0.7, taking off 30%.", "RAT.COMPOUND.SIMPLE"],
                ["False. It is 20 000 × 0.15².", "RAT.PERCENT.MULTIPLIER"],
              ],
            },
            {
              statement:
                "A phone loses 20% of its value each year. Ella says after 2 years it has lost 40% of its value.",
              truth: false,
              right: "False. It keeps 0.8 × 0.8 = 0.64 of its value, so it has lost 36%.",
              wrong: [
                ["True. 20% + 20% = 40%.", "RAT.COMPOUND.SIMPLE"],
                ["True. Depreciation is the same as simple interest."],
              ],
            },
            {
              claim:
                "Something losing a fixed percentage of its value each year eventually reaches £0.",
              truth: "never",
              right: "Never. Each year it keeps a fraction of what it had, which is never zero.",
              wrong: [
                ["Always. It keeps losing value.", "RAT.COMPOUND.SIMPLE"],
                ["Sometimes. Only if the percentage is big."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(p.value * (1 - p.d / 100) ** p.years);
    if (question.key.depth === 2) return numberAnswer(question) === r2((1 - p.d / 100) ** 2 * 100);
    return true;
  },
});
