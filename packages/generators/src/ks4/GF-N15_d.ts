/**
 * @statement GF-N15.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N15.d: Write error intervals for truncation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  i: number;
  d: number;
  w: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-N15.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.BOUNDS.TRUNCATE", "NPV.BOUNDS.ENDS"],

  params(rng) {
    return { i: rng.int(1, 30), d: rng.int(1, 9), w: rng.int(3, 60) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = Number(`${p.i}.${p.d}`);
        return A.standard({
          question: [`A number x is truncated to 1 decimal place. The result is ${v}.`],
          ask: "Write down the upper bound of x.",
          answer: A.number(r(v + 0.1)),
          wrong: wrongs(r(v + 0.1), [
            {
              code: "NPV.BOUNDS.TRUNCATE",
              value: A.number(r(v + 0.05)),
              feedback: `Truncating chops off digits, so x could be anything from ${v} up to (not including) ${r(v + 0.1)}.`,
            },
          ]),
          solution: [{ say: "", math: `${v} \\le x < ${r(v + 0.1)}` }],
        });
      }
      case 2: {
        const right = `${p.w} \\le x < ${p.w + 1}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A calculator display shows x truncated to a whole number: ${p.w}.`],
          ask: "Which is the error interval for x?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${r(p.w - 0.5)} \\le x < ${r(p.w + 0.5)}`),
              code: "NPV.BOUNDS.TRUNCATE",
              feedback:
                "That is for rounding. Truncating only ever removes digits, so x is at least the value shown.",
            },
            {
              content: A.math(`${p.w} \\le x \\le ${p.w + 1}`),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${p.w + 1} would truncate to ${p.w + 1}, so it is not included.`,
            },
          ],
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "Truncating a number to 1 decimal place gives the same answer as rounding it to 1 decimal place.",
          ],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. They agree when the 2nd decimal digit is 0 to 4, like ${p.i}.${p.d}3, but ${p.i}.${p.d}7 truncates to ${p.i}.${p.d} and rounds to ${r(Number(`${p.i}.${p.d}`) + 0.1)}.`,
              correct: true,
            },
            { text: "Always. Both keep one decimal place.", code: "NPV.BOUNDS.TRUNCATE" },
            { text: "Never. Truncating always gives a smaller answer." },
          ],
          solution: [{ say: "Truncating never rounds up." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r(Number(`${p.i}.${p.d}`) + 0.1);
    if (question.key.depth === 2) return chosenText(question) === `${p.w} \\le x < ${p.w + 1}`;
    return true;
  },
});
