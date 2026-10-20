/**
 * @statement R-NPV-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-09: Verbally count beyond 20, recognising the pattern of the counting system (ELG)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** The tens digit of the decade being crossed: 2 means 29 to 30. */
  tens: number;
  right: boolean;
}

export default defineGenerator<Params>({
  id: "R-NPV-09",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SEQUENCE.DECADE"],

  params(rng, numbers) {
    return {
      tens: numbers === "friendly" ? 2 : numbers === "standard" ? rng.int(2, 4) : rng.int(3, 8),
      right: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const last = p.tens * 10 + 9;
    const next = last + 1;
    const wrongDecade = p.tens * 10;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Count on: ${last - 2}, ${last - 1}, ${last}, …`,
          ask: `What number comes after ${last}?`,
          answer: A.number(next),
          wrong: wrongs(next, [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(wrongDecade),
              feedback: `After ${last} the ones start again and the tens go up: ${next}.`,
            },
          ]),
          solution: [{ say: `After ${p.tens}9 comes the next ten: ${next}.` }],
        });
      case 2:
        return A.missingValue({
          intro: "Count on. What number is missing?",
          relation: [last - 1, ",", last, ",", next, ",", next + 1],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(wrongDecade),
              feedback: `After ${last} comes ${next}: the tens go up by one.`,
            },
          ],
          solution: [
            {
              say: `${last - 1}, ${last}, ${next}, ${next + 1}: after ${last} the next ten starts.`,
            },
          ],
        });
      default: {
        const claimed = p.right ? next : wrongDecade;
        return A.trueOrFalseWhy({
          rng,
          statement: `Max counts: "${last - 1}, ${last}, ${claimed}". He says that is right.`,
          truth: p.right,
          reasons: p.right
            ? [
                {
                  text: `After ${last} the ones go back to 0 and the tens go up, so ${next} is next.`,
                  correct: true,
                },
                { text: `After ${last} comes ${wrongDecade}.`, code: "NPV.SEQUENCE.DECADE" },
                { text: `After ${last} comes ${p.tens}10.`, code: "NPV.SEQUENCE.DECADE" },
              ]
            : [
                {
                  text: `After ${last} comes ${next}, not ${wrongDecade}: the tens go up by one.`,
                  correct: true,
                },
                {
                  text: `${wrongDecade} has the same tens as ${last}, so it comes next.`,
                  code: "NPV.SEQUENCE.DECADE",
                },
                { text: "Any number with a 0 can come next." },
              ],
          solution: [
            { say: `The pattern: ${p.tens}7, ${p.tens}8, ${p.tens}9, then the next ten, ${next}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    return numberAnswer(question) === p.tens * 10 + 10;
  },
});
