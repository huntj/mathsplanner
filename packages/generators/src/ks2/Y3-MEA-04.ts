/**
 * @statement Y3-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-04: Tell and write the time from an analogue clock, including using Roman numerals from I
// to XII, and 12-hour and 24-hour clocks
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { ampm, clock, h12, time24, timeWords } from "../shared/mea.ts";

export interface Params {
  hour: number;
  minutes: number;
  /** Depths 2–4: a time of day, 0 to 23. */
  day: number;
  dayMinutes: number;
  toTwelve: boolean;
  pairs: number[];
}

// Hours where Roman numerals are often misread: IV as VI, IX as XI.
const ROMAN_SWAP: Record<number, number> = { 4: 6, 6: 4, 9: 11, 11: 9 };

export default defineGenerator<Params>({
  id: "Y3-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "NPV.ROMAN.SUBTRACTIVE",
    "MEA.CLOCK.HOUR-AHEAD",
    "MEA.CLOCK.MINUTE-NUMBER",
    "MEA.TIME.24-HOUR",
  ],

  params(rng, numbers) {
    const hour = numbers === "friendly" ? rng.pick([4, 6, 9, 11]) : rng.int(1, 12);
    const minutes = rng.int(1, 11) * 5;
    const day = rng.int(13, 23);
    if (day === 22 || day === 20) reject("an hour whose 24-hour form is not one digit off");
    const pairs = rng.shuffle([13, 14, 15, 16, 17, 18, 19, 21, 23]).slice(0, 3);
    return { hour, minutes, day, dayMinutes: rng.int(0, 11) * 5, toTwelve: rng.bool(), pairs };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = timeWords(p.hour, p.minutes);
        const swap = ROMAN_SWAP[p.hour];
        return A.choice({
          rng,
          question: [
            "What time does the clock show?",
            A.figure(clock(p.hour, p.minutes, { roman: true })),
          ],
          correct: right,
          distractors: [
            swap === undefined
              ? {
                  content: timeWords(p.hour, p.minutes / 5),
                  code: "MEA.CLOCK.MINUTE-NUMBER",
                  feedback: `The minute hand points to ${p.minutes / 5}: count in fives to get ${p.minutes} minutes.`,
                }
              : {
                  content: timeWords(swap, p.minutes),
                  code: "NPV.ROMAN.SUBTRACTIVE",
                  feedback:
                    "A smaller numeral before a bigger one is taken away: IV is 4 and IX is 9.",
                },
            {
              content:
                p.minutes < 30
                  ? timeWords(p.hour + 1, p.minutes)
                  : timeWords(p.hour - 1, p.minutes),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: "Look at which numeral the hour hand has just passed.",
            },
            {
              content: timeWords(p.hour, 60 - p.minutes),
              feedback: "Check whether the minute hand is on the right (past) or left (to).",
            },
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [
            {
              say: `The minute hand shows ${p.minutes} minutes past; the hour hand is just past ${h12(p.hour)}. It is ${right}.`,
            },
          ],
        });
      }
      case 2: {
        const twelve = ampm(p.day, p.dayMinutes);
        const twentyFour = time24(p.day, p.dayMinutes);
        return p.toTwelve
          ? A.choice({
              rng,
              archetype: "varied-form",
              question: `A clock shows ${twentyFour}.`,
              ask: "What is this as a 12-hour time?",
              correct: twelve,
              distractors: [
                {
                  content: ampm(p.day - 10, p.dayMinutes).replace("am", "pm"),
                  code: "MEA.TIME.24-HOUR",
                  feedback: "Take away 12, not 10, to change an afternoon 24-hour time.",
                },
                {
                  content: ampm(p.day, p.dayMinutes).replace("pm", "am"),
                  code: "MEA.TIME.24-HOUR",
                  feedback: "24-hour times from 12:00 are in the afternoon or evening: pm.",
                },
              ].filter((d) => d.content !== twelve),
              solution: [{ say: `${p.day} − 12 = ${p.day - 12}, so ${twentyFour} is ${twelve}.` }],
            })
          : A.choice({
              rng,
              archetype: "varied-form",
              question: `Write ${twelve} as a 24-hour time.`,
              correct: twentyFour,
              distractors: [
                {
                  content: time24(p.day - 12, p.dayMinutes),
                  code: "MEA.TIME.24-HOUR",
                  feedback: "Afternoon times add 12 to the hour in 24-hour time.",
                },
                {
                  content: time24(p.day - 2, p.dayMinutes),
                  code: "MEA.TIME.24-HOUR",
                  feedback: `Add 12 to the hour: ${p.day - 12} + 12 = ${p.day}.`,
                },
              ],
              solution: [{ say: `${p.day - 12} + 12 = ${p.day}, so ${twelve} is ${twentyFour}.` }],
            });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each 12-hour time to the same 24-hour time.",
          pairs: p.pairs.map(
            (h) => [ampm(h, p.dayMinutes), time24(h, p.dayMinutes)] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: "For pm times after 12:59, add 12 to the hour." }],
        });
      default: {
        const wrong = p.day - 10;
        return A.trueOrFalseWhy({
          rng,
          statement: `Finn says ${time24(p.day, 0)} is ${wrong} pm.`,
          truth: false,
          reasons: [
            {
              text: `False. Take away 12, not 10: ${p.day} − 12 = ${p.day - 12}, so it is ${p.day - 12} pm.`,
              correct: true,
            },
            { text: `True. Just drop the 1 from ${p.day}.`, code: "MEA.TIME.24-HOUR" },
            { text: "True. 24-hour times take away 10.", code: "MEA.TIME.24-HOUR" },
          ],
          solution: [
            { say: `There are 12 hours before noon, so ${p.day}:00 is ${p.day - 12} pm.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === timeWords(p.hour, p.minutes);
    if (question.archetype === "varied-form")
      return (
        chosenText(question) ===
        (p.toTwelve ? ampm(p.day, p.dayMinutes) : time24(p.day, p.dayMinutes))
      );
    return true;
  },
});
