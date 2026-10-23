/**
 * @statement Y1-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-01.a: Count forwards to and across 100 from any number
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
  id: "Y1-NPV-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SEQUENCE.DECADE"],

  params(rng, numbers) {
    const tens =
      numbers === "friendly"
        ? rng.int(2, 5)
        : numbers === "standard"
          ? rng.int(3, 9)
          : rng.pick([10, 10, 11]);
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
              feedback: `After ${p.t - 1} the ones go back to 0 and the tens go up by one: ${p.t}.`,
            },
          ]),
          solution: [{ say: `After ${p.t - 1} comes ${p.t}.` }],
        });
      case 2:
        return A.missingValue({
          intro: "Count on in ones. What number is missing?",
          relation: [p.t - 2, ",", p.t - 1, ",", p.t, ",", p.t + 1, ",", p.t + 2],
          hide: 6,
          wrong: [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(p.t - 9),
              feedback: `${p.t} comes after ${p.t - 1}, so the next number is ${p.t + 1}.`,
            },
          ],
          solution: [{ say: `Count on: ${p.t - 2}, ${p.t - 1}, ${p.t}, ${p.t + 1}, ${p.t + 2}.` }],
        });
      default: {
        const claimed = p.right ? p.t : p.t - 10;
        return A.trueOrFalseWhy({
          rng,
          statement: `Zak counts on: "${p.t - 2}, ${p.t - 1}, ${claimed}". He says that is right.`,
          truth: p.right,
          reasons: p.right
            ? [
                {
                  text: `After ${p.t - 1}, the ones go back to 0 and the tens go up by one: ${p.t}.`,
                  correct: true,
                },
                { text: `After ${p.t - 1} comes ${p.t - 10}.`, code: "NPV.SEQUENCE.DECADE" },
                { text: "You cannot count on across a ten." },
              ]
            : [
                { text: `After ${p.t - 1} comes ${p.t}, not ${p.t - 10}.`, correct: true },
                {
                  text: `${p.t - 10} comes next because the ones go back to 0.`,
                  code: "NPV.SEQUENCE.DECADE",
                },
                { text: "Counting on always lands on a number ending in 9." },
              ],
          solution: [{ say: `Counting on in ones: ${p.t - 2}, ${p.t - 1}, ${p.t}, ${p.t + 1}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.t;
    if (question.key.depth === 2) return numberAnswer(question) === p.t + 1;
    return true;
  },
});
