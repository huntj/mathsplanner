/**
 * @statement GF-R16.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R16.a: Solve growth problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  start: number;
  rate: number;
  years: number;
}

const mult = (rate: number) => (1 + rate / 100).toFixed(2);

export default defineGenerator<Params>({
  id: "GF-R16.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    return { start: rng.int(10, 90) * 100, rate: rng.int(2, 15), years: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = Math.round(p.start * (1 + p.rate / 100) ** p.years);
        return A.standard({
          question: [`A town has ${p.start} people. Its population grows by ${p.rate}% each year.`],
          ask: `Estimate the population after ${p.years} years, to the nearest whole number.`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.round(p.start * (1 + (p.rate * p.years) / 100))),
              feedback:
                "Each year's growth is on the new, bigger population: multiply by the multiplier once for each year.",
            },
          ]),
          solution: [
            { say: "", math: `${p.start} \\times ${mult(p.rate)}^{${p.years}} \\approx ${v}` },
          ],
        });
      }
      case 2: {
        const right = `${p.start} \\times ${mult(p.rate)}^{${p.years}}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A colony of ${p.start} bacteria grows by ${p.rate}% each hour.`],
          ask: `Which calculation gives the number after ${p.years} hours?`,
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${p.start} \\times ${(p.rate / 100).toFixed(2)}^{${p.years}}`),
              code: "RAT.PERCENT.MULTIPLIER",
              feedback: `To increase by ${p.rate}%, multiply by ${mult(p.rate)}, not ${(p.rate / 100).toFixed(2)}.`,
            },
            {
              content: A.math(`${p.start} \\times ${mult(p.rate)} \\times ${p.years}`),
              code: "RAT.COMPOUND.SIMPLE",
              feedback: "The growth repeats, so the multiplier is raised to a power.",
            },
          ],
          solution: [{ say: "Multiply by the multiplier once for each hour: ", math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Eli says growing by ${p.rate}% a year for 2 years is the same as growing by ${2 * p.rate}%.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${mult(p.rate)}² = ${Number(((1 + p.rate / 100) ** 2).toFixed(4))}, an increase of ${Number((((1 + p.rate / 100) ** 2 - 1) * 100).toFixed(2))}%: the second year grows the first year's growth too.`,
              correct: true,
            },
            { text: "True. Two lots of the same percentage add up.", code: "RAT.COMPOUND.SIMPLE" },
            { text: `False. It is less than ${2 * p.rate}%.`, code: "RAT.COMPOUND.SIMPLE" },
          ],
          solution: [{ say: "Repeated percentage change multiplies." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(p.start * (1 + p.rate / 100) ** p.years);
    if (question.key.depth === 2)
      return chosenText(question) === `${p.start} \\times ${mult(p.rate)}^{${p.years}}`;
    return true;
  },
});
