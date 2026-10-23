/**
 * @statement Y7-NPV-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-07.a: Use squares and square roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-07.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SQUARE.DOUBLES", "NPV.POWER.ROOT-HALF"],

  params(rng) {
    return { n: rng.int(11, 15), s: rng.int(3, 13) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.n * p.n;
        return A.standard({
          question: ["Work out ", A.math(`${p.n}^2`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MD.SQUARE.DOUBLES",
              value: A.number(2 * p.n),
              feedback: `${p.n}² means ${p.n} × ${p.n}, not ${p.n} × 2.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} \\times ${p.n} = ${v}` }],
        });
      }
      case 2: {
        const area = p.s * p.s;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A square has an area of ${area} cm².`],
              ask: "How long is each side, in cm?",
            },
            {
              question: [`A square garden has an area of ${area} m².`],
              ask: "What is the length of one side, in m?",
            },
          ],
          answer: A.number(p.s),
          wrong: wrongs(p.s, [
            {
              code: "NPV.POWER.ROOT-HALF",
              value: A.number(area / 2),
              feedback: `The side is the number that squares to ${area}: its square root.`,
            },
            {
              code: "NPV.POWER.ROOT-HALF",
              value: A.number(area / 4),
              feedback: "Dividing by 4 shares a perimeter, not an area. Find the square root.",
            },
          ]),
          solution: [{ say: "", math: `\\sqrt{${area}} = ${p.s}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A square number is even."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. ${p.s % 2 === 0 ? p.s : p.s + 1}² = ${(p.s % 2 === 0 ? p.s : p.s + 1) ** 2} is even, but ${p.s % 2 === 1 ? p.s : p.s + 1}² = ${(p.s % 2 === 1 ? p.s : p.s + 1) ** 2} is odd.`,
              correct: true,
            },
            { text: "Always. Squaring doubles a number.", code: "MD.SQUARE.DOUBLES" },
            { text: "Never. Square numbers are always odd." },
          ],
          solution: [{ say: "Odd × odd is odd; even × even is even." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n * p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.s;
    return true;
  },
});
