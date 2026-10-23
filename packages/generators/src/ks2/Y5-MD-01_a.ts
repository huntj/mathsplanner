/**
 * @statement Y5-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-01.a: Identify multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  /** Depth 1: the multiple to find among non-multiples. */
  k: number;
  /** Depth 2: which multiple to give. */
  which: number;
}

export default defineGenerator<Params>({
  id: "Y5-MD-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.FACTOR.FACTOR-MULTIPLE"],

  params(rng, numbers) {
    const n = rng.int(numbers === "friendly" ? 3 : 6, numbers === "stretch" ? 15 : 12);
    return {
      n,
      k: rng.int(numbers === "friendly" ? 3 : 6, 12),
      which: rng.int(4, numbers === "friendly" ? 6 : 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const m = p.n * p.k;
    switch (depth) {
      case 1: {
        const near = [m + 1, m - 1, m + Math.ceil(p.n / 2)].filter((x) => x % p.n !== 0);
        const factor = [2, 3, 4, 5].find((f) => p.n % f === 0 && f !== p.n);
        const distractors = [
          ...(factor
            ? [
                {
                  content: String(factor),
                  code: "MD.FACTOR.FACTOR-MULTIPLE",
                  feedback: `${factor} is a factor of ${p.n}, not a multiple. Multiples are in the ${p.n} times table.`,
                },
              ]
            : []),
          ...near.map((x) => ({
            content: String(x),
            feedback: `${x} is not in the ${p.n} times table.`,
          })),
        ].slice(0, 3);
        if (distractors.length < 3) return reject("three wrong answers");
        return A.choice({
          rng,
          question: [`Which of these is a multiple of ${p.n}?`],
          correct: String(m),
          distractors,
          solution: [{ say: `${m} = ${p.k} × ${p.n}, so it is a multiple of ${p.n}.` }],
        });
      }
      case 2: {
        const answer = p.n * p.which;
        return A.standard({
          question: `The multiples of ${p.n} are ${p.n}, ${2 * p.n}, ${3 * p.n}, …`,
          ask: `What is multiple number ${p.which} in the list?`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "MD.FACTOR.FACTOR-MULTIPLE",
              value: A.number(p.n + p.which),
              feedback: `Multiples go up in ${p.n}s: multiple number ${p.which} is ${p.which} × ${p.n}.`,
            },
          ]),
          solution: [{ say: `${p.which} × ${p.n} = ${answer}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Lena says ${p.n} is a multiple of ${m}.`,
          truth: false,
          reasons: [
            {
              text: `False. ${m} is a multiple of ${p.n}, because ${m} = ${p.k} × ${p.n}. ${p.n} is a factor of ${m}.`,
              correct: true,
            },
            {
              text: `True. ${p.n} goes into ${m}, so it is a multiple.`,
              code: "MD.FACTOR.FACTOR-MULTIPLE",
            },
            {
              text: "True. Factors and multiples mean the same thing.",
              code: "MD.FACTOR.FACTOR-MULTIPLE",
            },
          ],
          solution: [
            { say: "A multiple is in the times table; a factor divides into the number exactly." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return Number(chosenText(question)) % p.n === 0;
    if (question.key.depth === 2) return numberAnswer(question) === p.n * p.which;
    return true;
  },
});
