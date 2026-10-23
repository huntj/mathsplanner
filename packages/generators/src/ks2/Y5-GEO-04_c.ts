/**
 * @statement Y5-GEO-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-GEO-04.c: Recognise multiples of 90°
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  rights: number;
  /** Depth 2: the multiple of 90° among angles that are not. */
  multiple: number;
  others: number[];
}

export default defineGenerator<Params>({
  id: "Y5-GEO-04.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TURNS.FRACTION"],

  params(rng) {
    return {
      rights: rng.int(2, 4),
      multiple: 90 * rng.int(1, 3),
      others: rng.sample([45, 100, 120, 150, 200, 225, 250, 300], 3),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const deg = 90 * p.rights;
        return A.standard({
          question: `A robot turns through ${p.rights} right angles.`,
          ask: "How many degrees has it turned?",
          answer: A.number(deg, { units: "°" }),
          wrong: wrongs(deg, [
            {
              code: "GEO.TURNS.FRACTION",
              value: A.number(100 * p.rights, { units: "°" }),
              feedback: "Each right angle is 90°, not 100°.",
            },
          ]),
          solution: [{ say: `${p.rights} × 90° = ${deg}°.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these angles is a multiple of 90°?"],
          correct: A.math(`${p.multiple}^\\circ`),
          distractors: p.others.map((o) => ({
            content: A.math(`${o}^\\circ`),
            feedback: `${o}° is not a whole number of right angles: ${o} ÷ 90 is not a whole number.`,
          })),
          solution: [{ say: `${p.multiple}° = ${p.multiple / 90} × 90°.` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A reflex angle is a multiple of 90°."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. 270° is reflex and is 3 × 90°, but 200° is reflex and is not a multiple of 90°.",
              correct: true,
            },
            {
              text: "Always. Angles bigger than 180° are made of right angles.",
              code: "GEO.TURNS.FRACTION",
            },
            { text: "Never. Only acute angles can be multiples of 90°." },
          ],
          solution: [{ say: "The multiples of 90° are 90°, 180°, 270° and 360°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 90 * p.rights;
    if (question.key.depth === 2) return chosenText(question).includes(String(p.multiple));
    return true;
  },
});
