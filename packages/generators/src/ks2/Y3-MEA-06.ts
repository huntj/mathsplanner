/**
 * @statement Y3-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-06: Know the number of seconds in a minute and the number of days in each month, year and
// leap year
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { MONTHS, MONTH_DAYS } from "../shared/mea.ts";

interface Params {
  minutes: number;
  seconds: number;
  month: number;
  year: number;
}

const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export default defineGenerator<Params>({
  id: "Y3-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.TIME.FACTS", "MEA.TIME.DECIMAL"],

  params(rng, numbers) {
    return {
      minutes: rng.int(1, numbers === "friendly" ? 3 : 6),
      seconds: numbers === "friendly" ? 0 : rng.int(1, 11) * 5,
      month: rng.int(0, 11),
      year: rng.int(2001, 2040),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = 60 * p.minutes + p.seconds;
        const said = p.seconds
          ? `${p.minutes} minute${p.minutes === 1 ? "" : "s"} and ${p.seconds} seconds`
          : `${p.minutes} minute${p.minutes === 1 ? "" : "s"}`;
        return A.standard({
          question: `How many seconds are there in ${said}?`,
          answer: A.number(total, { units: "s" }),
          wrong: wrongs(total, [
            {
              code: "MEA.TIME.FACTS",
              value: A.number(100 * p.minutes + p.seconds, { units: "s" }),
              feedback: "There are 60 seconds in a minute, not 100.",
            },
          ]),
          solution: [
            {
              say: `${p.minutes} × 60 = ${60 * p.minutes}${p.seconds ? `, and ${60 * p.minutes} + ${p.seconds} = ${total}` : ""} seconds.`,
            },
          ],
        });
      }
      case 2: {
        const days = MONTH_DAYS[p.month] ?? 30;
        const name = MONTHS[p.month] ?? "January";
        const other = days === 31 ? 30 : days === 30 ? 31 : 30;
        return A.standard({
          question: `How many days are there in ${name}${p.month === 1 ? " in a year that is not a leap year" : ""}?`,
          answer: A.number(days),
          wrong: [
            {
              code: "MEA.TIME.FACTS",
              value: A.number(other),
              feedback: `"30 days has September, April, June and November. All the rest have 31, except February."`,
            },
          ],
          solution: [{ say: `${name} has ${days} days.` }],
        });
      }
      default: {
        const truth = leap(p.year);
        return A.trueOrFalseWhy({
          rng,
          statement: `Ada says ${p.year} is a leap year, with 366 days.`,
          truth,
          reasons: truth
            ? [
                {
                  text: `True. ${p.year} divides exactly by 4, so February has 29 days that year.`,
                  correct: true,
                },
                { text: "False. Every year has 365 days.", code: "MEA.TIME.FACTS" },
                { text: "False. Leap years only happen every 10 years.", code: "MEA.TIME.FACTS" },
              ]
            : [
                {
                  text: `False. ${p.year} does not divide exactly by 4, so it has 365 days.`,
                  correct: true,
                },
                { text: "True. Every year has 366 days.", code: "MEA.TIME.FACTS" },
                { text: "True. Every odd year is a leap year.", code: "MEA.TIME.FACTS" },
              ],
          solution: [
            { say: `Leap years come every 4 years: ${p.year} ÷ 4 = ${(p.year / 4).toString()}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === 60 * p.minutes + p.seconds || n === MONTH_DAYS[p.month];
  },
});
