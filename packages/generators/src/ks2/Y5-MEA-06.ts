/**
 * @statement Y5-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-06: Solve problems involving converting between units of time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { duration, time24 } from "../shared/mea.ts";

interface Params {
  minutes: number;
  seconds: number;
  total: number;
  start: number;
  end: number;
  days: number;
}

export default defineGenerator<Params>({
  id: "Y5-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["MEA.TIME.DECIMAL", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const total = rng.int(numbers === "friendly" ? 70 : 100, numbers === "friendly" ? 150 : 400);
    if (total % 60 === 0) reject("minutes left over");
    const start = rng.int(8, 9) * 60 + rng.int(0, 11) * 5;
    const end = rng.int(14, 15) * 60 + rng.int(0, 11) * 5;
    return { minutes: rng.int(2, 9), seconds: rng.int(5, 55), total, start, end, days: 5 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = p.minutes * 60 + p.seconds;
        return A.standard({
          question: `A song lasts ${p.minutes} minutes ${p.seconds} seconds.`,
          ask: "How long is that in seconds?",
          answer: A.number(s, { units: "s" }),
          wrong: wrongs(s, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(p.minutes * 100 + p.seconds, { units: "s" }),
              feedback: "There are 60 seconds in a minute, not 100.",
            },
          ]),
          solution: [
            {
              say: `${p.minutes} × 60 = ${p.minutes * 60}, and ${p.minutes * 60} + ${p.seconds} = ${s} seconds.`,
            },
          ],
        });
      }
      case 2: {
        const right = duration(p.total);
        const h = Math.floor(p.total / 100);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Write ${p.total} minutes in hours and minutes.`,
          correct: right,
          distractors: [
            {
              content: duration(h * 60 + (p.total % 100)),
              code: "MEA.TIME.DECIMAL",
              feedback: "An hour is 60 minutes, not 100.",
            },
            {
              content: `${(p.total / 60).toFixed(2)} hours`,
              code: "MEA.TIME.DECIMAL",
              feedback: `The decimal part of ${(p.total / 60).toFixed(2)} is a fraction of an hour, not minutes.`,
            },
          ].filter((d) => d.content !== right),
          solution: [
            {
              say: `${Math.floor(p.total / 60)} × 60 = ${Math.floor(p.total / 60) * 60}, and ${p.total} − ${Math.floor(p.total / 60) * 60} = ${p.total % 60}: ${right}.`,
            },
          ],
        });
      }
      default: {
        const day = p.end - p.start;
        const week = day * p.days;
        return A.multiStepContext({
          context: `The school day runs from ${time24(Math.floor(p.start / 60), p.start % 60)} to ${time24(Math.floor(p.end / 60), p.end % 60)}, ${p.days} days a week.`,
          parts: [
            {
              ask: "How many minutes long is one school day?",
              answer: A.number(day, { units: "minutes" }),
            },
            {
              ask: "How many hours is that in a week?",
              answer: A.number(week / 60, { units: "hours" }),
              wrong: wrongs(week / 60, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(Math.round((day / 60) * 100) / 100, { units: "hours" }),
                  feedback: `That is one day. Multiply by ${p.days}.`,
                },
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(week / 100, { units: "hours" }),
                  feedback: "There are 60 minutes in an hour.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${duration(day)} = ${day} minutes.` },
            { say: `${day} × ${p.days} = ${week} minutes, and ${week} ÷ 60 = ${week / 60} hours.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === p.minutes * 60 + p.seconds;
    if (question.archetype === "varied-form") return chosenText(question) === duration(p.total);
    return Math.abs(numberAnswer(question, 1) * 60 - (p.end - p.start) * p.days) < 1e-6;
  },
});
