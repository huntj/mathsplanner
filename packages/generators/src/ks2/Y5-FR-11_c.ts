/**
 * @statement Y5-FR-11.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-11.c: Write percentages as decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** A two-digit percentage, and a one-digit one. */
  big: number;
  small: number;
  tenths: number;
}

export default defineGenerator<Params>({
  id: "Y5-FR-11.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.PERCENT.DIGITS"],

  params(rng) {
    return { big: rng.int(11, 99), small: rng.int(1, 9), tenths: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const value = p.big / 100;
        return A.standard({
          question: ["Write ", A.math(`${p.big}\\%`), " as a decimal."],
          answer: A.number(value),
          wrong: wrongs(value, [
            {
              code: "FR.PERCENT.DIGITS",
              value: A.number(p.big / 10),
              feedback: "Per cent means out of 100, so divide by 100: two places.",
            },
          ]),
          solution: [{ say: `${p.big}% = ${p.big}/100 = ${value}.` }],
        });
      }
      case 2: {
        const pc = 10 * p.tenths;
        return A.standard({
          question: ["Write ", A.math(`0.${p.tenths}`), " as a percentage."],
          answer: A.number(pc, { units: "%" }),
          wrong: wrongs(pc, [
            {
              code: "FR.PERCENT.DIGITS",
              value: A.number(p.tenths, { units: "%" }),
              feedback: `0.${p.tenths} is ${p.tenths} tenths, which is ${pc} hundredths: ${pc}%.`,
            },
          ]),
          solution: [{ say: `0.${p.tenths} = ${pc}/100 = ${pc}%.` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Jack says ", A.math(`${p.small}\\% = 0.${p.small}`), "."],
              truth: false,
              reasons: [
                {
                  text: `False. ${p.small}% is ${p.small} hundredths, which is 0.0${p.small}. 0.${p.small} is ${10 * p.small}%.`,
                  correct: true,
                },
                {
                  text: "True. You put the digits straight after the point.",
                  code: "FR.PERCENT.DIGITS",
                },
                {
                  text: "True. Percentages and decimals use the same digits.",
                  code: "FR.PERCENT.DIGITS",
                },
              ],
              solution: [{ say: `${p.small}% = ${p.small}/100 = 0.0${p.small}.` }],
            }),
          [
            {
              statement: "Dan says $45\\% = 0.45$.",
              truth: true,
              right: "True. 45% is 45 hundredths, which is 0.45.",
              wrong: [
                ["False. It is 4.5.", "FR.PERCENT.DIGITS"],
                ["False. It is 0.045.", "FR.PERCENT.DIGITS"],
              ],
            },
            {
              claim: "100% is the same as 1.",
              truth: "always",
              right: "Always. 100% is 100 hundredths, which is one whole.",
              wrong: [["Never. 100% is 100.", "FR.PERCENT.DIGITS"], ["Sometimes. Only for money."]],
            },
            {
              statement: "Pia says $0.6 = 6\\%$.",
              truth: false,
              right: "False. 0.6 is 6 tenths, which is 60 hundredths: 60%.",
              wrong: [
                ["True. The digit is 6, so it is 6%.", "FR.PERCENT.DIGITS"],
                ["True. 0.6 and 6% both have a 6."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return Math.abs(numberAnswer(question) - p.big / 100) < 1e-9;
    if (question.key.depth === 2) return numberAnswer(question) === 10 * p.tenths;
    return true;
  },
});
