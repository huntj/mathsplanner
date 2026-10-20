/**
 * @statement Y1-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-NPV-01: Count to and across 100, forwards and backwards, from any number
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** The tens boundary crossed: counting goes …, t − 1, t, t + 1, … */
  t: number;
  right: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SEQUENCE.DECADE"],

  params(rng, numbers) {
    const tens =
      numbers === "friendly"
        ? rng.int(2, 5)
        : numbers === "standard"
          ? rng.int(2, 9)
          : rng.pick([10, 10, 11, 12]);
    return { t: tens * 10, right: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `Count on: ${p.t - 3}, ${p.t - 2}, ${p.t - 1}, …`,
          ask: `What number comes after ${p.t - 1}?`,
          answer: A.number(p.t),
          wrong: wrongs(p.t, [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(p.t - 10),
              feedback: `After ${p.t - 1} the ones go back to 0 and the tens go up: ${p.t}.`,
            },
          ]),
          solution: [{ say: `After ${p.t - 1} comes ${p.t}.` }],
        });
      case 2:
        return A.missingValue({
          intro: "Count back. What number is missing?",
          relation: [p.t + 1, ",", p.t, ",", p.t - 1, ",", p.t - 2],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(p.t - 11),
              feedback: `Counting back from ${p.t} goes to ${p.t - 1}: the tens go down by one and the ones go to 9.`,
            },
          ],
          solution: [{ say: `Count back: ${p.t + 1}, ${p.t}, ${p.t - 1}, ${p.t - 2}.` }],
        });
      default: {
        const claimed = p.right ? p.t - 1 : p.t - 10;
        return A.trueOrFalseWhy({
          rng,
          statement: `Amy counts back: "${p.t + 1}, ${p.t}, ${claimed}". She says that is right.`,
          truth: p.right,
          reasons: p.right
            ? [
                {
                  text: `Going back from ${p.t}, the ones go to 9 and the tens go down by one: ${p.t - 1}.`,
                  correct: true,
                },
                { text: `Back from ${p.t} comes ${p.t - 10}.`, code: "NPV.SEQUENCE.DECADE" },
                { text: "You cannot count back across a ten." },
              ]
            : [
                { text: `Back from ${p.t} comes ${p.t - 1}, not ${p.t - 10}.`, correct: true },
                {
                  text: `${p.t - 10} comes next because the tens go down.`,
                  code: "NPV.SEQUENCE.DECADE",
                },
                { text: "Counting back always lands on a number ending in 0." },
              ],
          solution: [{ say: `Counting back in ones: ${p.t + 1}, ${p.t}, ${p.t - 1}, ${p.t - 2}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.t;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.t - 1;
    return true;
  },
});
