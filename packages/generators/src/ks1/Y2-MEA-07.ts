/**
 * @statement Y2-MEA-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-07: Know the number of minutes in an hour and the number of hours in a day
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  hours: number;
  days: number;
  extra: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y2-MEA-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.TIME.FACTS", "MEA.TIME.DECIMAL"],

  params(rng, numbers) {
    return {
      hours: rng.int(1, numbers === "friendly" ? 2 : 5),
      days: rng.int(1, numbers === "friendly" ? 2 : 4),
      extra: rng.int(1, 5) * 5,
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `How many minutes are there in ${p.hours === 1 ? "1 hour" : `${p.hours} hours`}?`,
          answer: A.number(60 * p.hours),
          wrong: wrongs(60 * p.hours, [
            {
              code: "MEA.TIME.FACTS",
              value: A.number(100 * p.hours),
              feedback: "There are 60 minutes in an hour, not 100.",
            },
          ]),
          solution: [{ say: `60 minutes in each hour: ${p.hours} × 60 = ${60 * p.hours}.` }],
        });
      case 2:
        return A.standard({
          question: `How many hours are there in ${p.days === 1 ? "1 day" : `${p.days} days`}?`,
          answer: A.number(24 * p.days),
          wrong: wrongs(24 * p.days, [
            {
              code: "MEA.TIME.FACTS",
              value: A.number(12 * p.days),
              feedback:
                "A day is 24 hours: 12 from midnight to midday, then 12 more back to midnight.",
            },
          ]),
          solution: [{ say: `24 hours in each day: ${p.days} × 24 = ${24 * p.days}.` }],
        });
      default: {
        const right = 60 + p.extra;
        const said = p.claimTrue ? `1 hour and ${p.extra} minutes` : `${100 + p.extra} minutes`;
        return A.trueOrFalseWhy({
          rng,
          statement: `Max says ${right} minutes is the same as ${said}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. 60 minutes make 1 hour, and ${p.extra} minutes are left over.`,
                  correct: true,
                },
                { text: `False. It is ${right / 60} hours.`, code: "MEA.TIME.DECIMAL" },
                { text: "False. There are 100 minutes in an hour.", code: "MEA.TIME.FACTS" },
              ]
            : [
                {
                  text: `False. 1 hour is 60 minutes, so ${100 + p.extra} minutes is more than ${right} minutes.`,
                  correct: true,
                },
                { text: "True. An hour is 100 minutes.", code: "MEA.TIME.FACTS" },
                { text: "True. You add 100 for each hour.", code: "MEA.TIME.FACTS" },
              ],
          solution: [
            {
              say: `${right} minutes = 60 minutes + ${p.extra} minutes = 1 hour ${p.extra} minutes.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === 60 * p.hours || n === 24 * p.days;
  },
});
