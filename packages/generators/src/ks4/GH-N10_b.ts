/**
 * @statement GH-N10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-N10.b: Change fractions into recurring decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  n: number;
  d: number;
  t: number;
  u: number;
  e: number;
}

export default defineGenerator<Params>({
  id: "GH-N10.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.RECURRING.TRUNCATE"],

  params(rng) {
    const d = rng.pick([3, 7, 9, 11]);
    const p = {
      n: rng.int(1, d - 1),
      d,
      t: rng.pick([1, 3, 5, 7]),
      u: rng.pick([1, 3, 7, 9, 11]),
      e: rng.int(1, 10),
    };
    if (gcdOf(p.n, d) > 1) reject("a fraction in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which of these fractions gives a recurring decimal?"],
          correct: A.math(`\\frac{${p.n}}{${p.d}}`),
          distractors: [
            {
              content: A.math(`\\frac{${p.t}}{8}`),
              code: "FR.RECURRING.TRUNCATE",
              feedback: `${p.t}/8 = ${p.t / 8}: the decimal stops, because 8 = 2³.`,
            },
            {
              content: A.math(`\\frac{${p.u}}{20}`),
              code: "FR.RECURRING.TRUNCATE",
              feedback: `${p.u}/20 = ${p.u / 20}: the decimal stops, because 20 = 2² × 5.`,
            },
          ],
          solution: [
            {
              say: `A fraction in its simplest form terminates only when the denominator has no prime factors other than 2 and 5. ${p.d} does.`,
            },
          ],
        });
      case 2: {
        const digits = String(9 * p.e).padStart(2, "0");
        const [x, y] = digits;
        const right = `0.\\dot{${x}}\\dot{${y}}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write ", A.math(`\\frac{${p.e}}{11}`), " as a decimal."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`0.${x}${y}`),
              code: "FR.RECURRING.TRUNCATE",
              feedback: `0.${x}${y} = ${x}${y}/100. The digits ${x}${y} repeat for ever.`,
            },
            {
              content: A.math(`0.${x}\\dot{${y}}`),
              feedback: `Divide ${p.e} by 11: both digits ${x} and ${y} repeat.`,
            },
          ],
          solution: [{ say: `${p.e} ÷ 11 = 0.${x}${y}${x}${y}… = `, math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A fraction with denominator 12 gives a recurring decimal."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. 1/12 = 0.0833… recurs, but 3/12 = 1/4 = 0.25 stops: simplify first, then look at the denominator.",
              correct: true,
            },
            { text: "Always. 12 has a factor of 3.", code: "FR.RECURRING.TRUNCATE" },
            {
              text: "Never. Every fraction gives a decimal that stops.",
              code: "FR.RECURRING.TRUNCATE",
            },
          ],
          solution: [{ say: "Only the simplified denominator matters." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `\\frac{${p.n}}{${p.d}}`;
    if (question.key.depth === 2) {
      const [x, y] = String(9 * p.e).padStart(2, "0");
      return chosenText(question) === `0.\\dot{${x}}\\dot{${y}}`;
    }
    return true;
  },
});
