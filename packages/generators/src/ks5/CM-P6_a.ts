/**
 * @statement CM-P6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-P6.a: Use P(A′) = 1 − P(A)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** P(A) in hundredths. */
  a: number;
  /** Depth 2: probabilities of two of three outcomes, in hundredths. */
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "CM-P6.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.COMPLEMENT"],

  params(rng) {
    const p = { a: rng.int(11, 89), x: rng.int(10, 50), y: rng.int(10, 40) };
    if (p.a % 10 === 0 || p.x + p.y >= 95)
      reject("a two-digit probability and room for a third outcome");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // Taking the tenths digit from 10 and keeping the hundredths, e.g. 1 − 0.35 = 0.75.
    const slip = Math.round(((10 - Math.floor(p.a / 10)) / 10 + (p.a % 10) / 100) * 100) / 100;
    switch (depth) {
      case 1: {
        const v = (100 - p.a) / 100;
        return A.standard({
          question: `The probability that a train is late is ${p.a / 100}.`,
          ask: "What is the probability that it is not late?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number(slip),
              feedback:
                "Take the whole probability from 1: 1 − P(late), not each digit separately.",
            },
          ]),
          solution: [{ say: `1 − ${p.a / 100} = ${v}.` }],
        });
      }
      case 2: {
        const z = (100 - p.x - p.y) / 100;
        return A.standard({
          question: `A spinner lands on red, blue or green. P(red) = ${p.x / 100} and P(blue) = ${p.y / 100}.`,
          ask: "Find the probability that it does not land on red or blue.",
          answer: A.number(z),
          wrong: wrongs(z, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number((100 - p.x) / 100),
              feedback: "Take both red and blue away from 1.",
            },
          ]),
          solution: [{ say: `1 − ${p.x / 100} − ${p.y / 100} = ${z}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `The probability of rain tomorrow is ${p.a / 100}. Nick says the probability of no rain is ${slip}.`,
          truth: false,
          reasons: [
            {
              text: `False. Rain and no rain cover every outcome, so P(no rain) = 1 − ${p.a / 100} = ${(100 - p.a) / 100}.`,
              correct: true,
            },
            { text: "True. Take each digit away from 10.", code: "PRO.COMPLEMENT" },
            {
              text: "True. Probabilities of different events never add up to 1.",
              code: "PRO.COMPLEMENT",
            },
          ],
          solution: [{ say: "", math: "P(A') = 1 - P(A)" }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (100 - p.a) / 100;
    if (question.key.depth === 2) return numberAnswer(question) === (100 - p.x - p.y) / 100;
    return true;
  },
});
