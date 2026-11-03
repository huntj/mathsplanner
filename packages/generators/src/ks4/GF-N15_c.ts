/**
 * @statement GF-N15.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N15.c: Write error intervals for rounding
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const ROUNDS: [number, string][] = [
  [100, "the nearest 100"],
  [10, "the nearest 10"],
  [1, "the nearest whole number"],
  [0.1, "1 decimal place"],
];

interface Params {
  u: number;
  k: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-N15.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.BOUNDS.ENDS"],

  params(rng) {
    return { u: rng.int(0, ROUNDS.length - 1), k: rng.int(3, 90) };
  },

  build(p, depth, rng): QuestionDraft {
    const [unit, words] = ROUNDS[p.u] ?? [10, "the nearest 10"];
    const v = r(p.k * unit);
    const lo = r(v - unit / 2);
    const hi = r(v + unit / 2);
    switch (depth) {
      case 1:
        return A.standard({
          question: [`A number x is rounded to ${words}. The result is ${v}.`],
          ask: "Write down the lower bound of x.",
          answer: A.number(lo),
          wrong: signedWrongs(lo, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(r(v - unit)),
              feedback: `Go half a unit down: half of ${unit} is ${r(unit / 2)}.`,
            },
          ]),
          solution: [{ say: "", math: `${v} - ${r(unit / 2)} = ${lo}` }],
        });
      case 2: {
        const right = `${lo} \\le x < ${hi}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`The length x cm is ${v} cm, rounded to ${words}.`],
          ask: "Which is the error interval for x?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${lo} \\le x \\le ${hi}`),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${hi} would round up, so it is not included: use <.`,
            },
            {
              content: A.math(`${r(v - unit)} \\le x < ${r(v + unit)}`),
              code: "NPV.BOUNDS.ENDS",
              feedback: "The bounds are half a unit either side.",
            },
          ],
          solution: [
            { say: "Half a unit either side, including the lower bound only: ", math: right },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `A number rounds to ${v} (to ${words}). Lee says it could be exactly ${hi}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. ${hi} rounds up to ${r(v + unit)}, so it is not included: x < ${hi}.`,
                  correct: true,
                },
                {
                  text: "True. The upper bound is included in the interval.",
                  code: "NPV.BOUNDS.ENDS",
                },
                { text: "True. Both bounds round to the same value.", code: "NPV.BOUNDS.ENDS" },
              ],
              solution: [{ say: "", math: `${lo} \\le x < ${hi}` }],
            }),
          [
            {
              statement:
                "A length is 8 cm to the nearest cm. Raj writes the error interval as $7.5 \\le l < 8.5$.",
              truth: true,
              right: "True. Half a unit either side: 7.5 rounds up to 8, and 8.5 would round to 9.",
              wrong: [
                ["False. It is 7 ≤ l < 9.", "NPV.BOUNDS.ENDS"],
                ["False. It is 7.5 ≤ l ≤ 8.5.", "NPV.BOUNDS.ENDS"],
              ],
            },
            {
              claim: "The lower bound of a rounded measurement is included in its error interval.",
              truth: "always",
              right: "Always. The lower bound rounds up to the value, so it belongs.",
              wrong: [
                ["Never. Neither end is included.", "NPV.BOUNDS.ENDS"],
                ["Sometimes. Only for whole numbers."],
              ],
            },
            {
              statement:
                "A mass is 40 kg to the nearest 10 kg. Bea says the smallest it could be is 39.5 kg.",
              truth: false,
              right: "False. Half of 10 kg is 5 kg: the lower bound is 35 kg.",
              wrong: [
                ["True. Take off half of 1.", "NPV.BOUNDS.ENDS"],
                ["True. Bounds are always 0.5 away."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const [unit] = ROUNDS[p.u] ?? [10];
    const v = r(p.k * unit);
    if (question.key.depth === 1) return numberAnswer(question) === r(v - unit / 2);
    if (question.key.depth === 2)
      return chosenText(question) === `${r(v - unit / 2)} \\le x < ${r(v + unit / 2)}`;
    return true;
  },
});
