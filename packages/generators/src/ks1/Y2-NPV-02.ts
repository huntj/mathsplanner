/**
 * @statement Y2-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-02: Recognise the place value of each digit in a two-digit number (tens, ones)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, numberAnswer, placeValue } from "../shared/counting.ts";

interface Params {
  tens: number;
  ones: number;
  /** Which digit is asked about at depth 1. */
  place: "tens" | "ones";
}

export default defineGenerator<Params>({
  id: "Y2-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.PLACE.FACE-VALUE", "NPV.PLACE.DIGIT-ORDER"],

  params(rng, numbers) {
    const tens = rng.int(numbers === "friendly" ? 1 : 2, 9);
    const ones = rng.int(1, 9);
    if (tens === ones) reject("digits must differ so the question is clear");
    return {
      tens,
      ones,
      place: numbers === "friendly" ? "tens" : rng.pick(["tens", "ones"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.tens * 10 + p.ones;
    const reversed = p.ones * 10 + p.tens;
    switch (depth) {
      case 1: {
        const digit = p.place === "tens" ? p.tens : p.ones;
        const value = p.place === "tens" ? p.tens * 10 : p.ones;
        return A.standard({
          question: ["Look at the number ", A.math(String(n)), "."],
          ask: ["What is the value of the digit ", A.math(String(digit)), "?"],
          answer: A.number(value),
          wrong: wrongs(value, [
            p.place === "tens"
              ? {
                  code: "NPV.PLACE.FACE-VALUE",
                  value: A.number(digit),
                  feedback: `The ${digit} is in the tens place, so it is worth ${digit} tens: ${value}.`,
                }
              : {
                  code: "NPV.PLACE.FACE-VALUE",
                  value: A.number(digit * 10),
                  feedback: `The ${digit} is in the ones place, so it is worth ${digit}.`,
                },
          ]),
          solution: [
            { say: `${n} is ${p.tens} tens and ${p.ones} ones. The ${digit} is worth ${value}.` },
          ],
        });
      }
      case 2:
        return A.standard({
          question: [
            "What number do the counters show?",
            A.figure(placeValue(n, { hidden: true })),
          ],
          ask: "Write the number.",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "NPV.PLACE.DIGIT-ORDER",
              value: A.number(reversed),
              feedback: "Write the tens digit first, then the ones.",
            },
            {
              code: "NPV.PLACE.FACE-VALUE",
              value: A.number(p.tens + p.ones),
              feedback: "A tens counter is worth 10, not 1.",
            },
          ]),
          solution: [{ say: `${p.tens} tens and ${p.ones} ones make ${n}.` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which picture shows ", A.math(String(n)), "?"],
          ask: "Choose the picture.",
          correct: placeValue(n, { style: "blocks", hidden: true }),
          distractors: [
            {
              figure: placeValue(reversed, { style: "blocks", hidden: true }),
              code: "NPV.PLACE.DIGIT-ORDER",
              feedback: `That shows ${reversed}: ${p.ones} tens and ${p.tens} ones.`,
            },
            ...(p.tens + p.ones < 10
              ? [
                  {
                    figure: placeValue(p.tens + p.ones, { style: "blocks", hidden: true }),
                    code: "NPV.PLACE.FACE-VALUE",
                    feedback: `That shows ${p.tens + p.ones}, as if every digit were ones.`,
                  },
                ]
              : []),
            {
              figure: placeValue(n + 1 === reversed ? n - 1 : n + 1, {
                style: "blocks",
                hidden: true,
              }),
              feedback: "Count the ones again.",
            },
          ],
          solution: [{ say: `${n} is ${p.tens} tens (rods) and ${p.ones} ones (cubes).` }],
        });
      default: {
        const same = p.tens * 11;
        return A.trueOrFalseWhy({
          rng,
          statement: ["In ", A.math(String(same)), `, both ${p.tens}s are worth the same.`],
          truth: false,
          reasons: [
            {
              text: `The first ${p.tens} is ${p.tens} tens, worth ${same - p.tens}; the second is ${p.tens} ones.`,
              correct: true,
            },
            {
              text: "They are the same digit, so they are worth the same.",
              code: "NPV.PLACE.FACE-VALUE",
            },
            { text: "The second one is worth more because it comes last." },
          ],
          solution: [
            {
              say: `A digit's value depends on its place: ${same} = ${same - p.tens} + ${p.tens}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = p.tens * 10 + p.ones;
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === n;
    if (question.archetype === "true-or-false-why") return true;
    if (question.diagrams.length > 0)
      return numberAnswer(question) === countOf(question.diagrams[0]);
    return numberAnswer(question) === (p.place === "tens" ? p.tens * 10 : p.ones);
  },
});
