/**
 * @statement Y3-MEA-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-04.b: Use the 12-hour clock
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { ampm, clock } from "../shared/mea.ts";

interface Params {
  hour: number;
  minutes: number;
  evening: boolean;
  /** Depth 2: a film from start to end, in minutes after midnight. */
  start: number;
  length: number;
}

export default defineGenerator<Params>({
  id: "Y3-MEA-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.TIME.DECIMAL", "MEA.TIME.24-HOUR", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    const start = rng.int(13, 19) * 60 + rng.int(6, 11) * 5;
    const length = rng.int(numbers === "friendly" ? 4 : 7, 14) * 5;
    // The film crosses an hour, so treating times as decimals gives a different answer.
    if (Math.floor(start / 60) === Math.floor((start + length) / 60)) reject("cross an hour");
    return {
      hour: rng.int(1, 11),
      minutes: rng.int(1, 11) * 5,
      evening: rng.bool(),
      start,
      length,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const h = p.evening ? p.hour + 12 : p.hour;
        const right = ampm(h, p.minutes);
        return A.choice({
          rng,
          question: [
            `It is ${p.evening ? "evening" : "morning"}. The clock shows the time.`,
            A.figure(clock(p.hour, p.minutes)),
          ],
          ask: "How do you write the time on the 12-hour clock?",
          correct: right,
          distractors: [
            {
              content: ampm(p.evening ? p.hour : p.hour + 12, p.minutes),
              code: "MEA.TIME.24-HOUR",
              feedback: "am is from midnight to noon (morning); pm is from noon to midnight.",
            },
            ...(p.evening
              ? [
                  {
                    content: `${h}:${String(p.minutes).padStart(2, "0")}`,
                    code: "MEA.TIME.24-HOUR",
                    feedback: "That is the 24-hour time. The 12-hour clock uses am or pm.",
                  },
                ]
              : []),
          ],
          solution: [{ say: `In the ${p.evening ? "evening" : "morning"}, it is ${right}.` }],
        });
      }
      case 2: {
        const end = p.start + p.length;
        const decimal =
          Math.floor(end / 60) * 100 +
          (end % 60) -
          (Math.floor(p.start / 60) * 100 + (p.start % 60));
        return A.standard({
          question: `A film starts at ${ampm(Math.floor(p.start / 60), p.start % 60)} and finishes at ${ampm(Math.floor(end / 60), end % 60)}.`,
          ask: "How many minutes long is the film?",
          answer: A.number(p.length, { units: "minutes" }),
          wrong: wrongs(p.length, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(decimal, { units: "minutes" }),
              feedback:
                "There are 60 minutes in an hour, not 100. Count on to the next o'clock, then on to the end.",
            },
          ]),
          solution: [
            {
              say: `Count on: to the next o'clock is ${60 - (p.start % 60)} minutes, then ${end % 60} more, making ${p.length} minutes.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Lucy says there are 12 hours in a day, because a clock face goes up to 12.",
          truth: false,
          reasons: [
            {
              text: "False. The hour hand goes round twice a day, once for am and once for pm: 24 hours.",
              correct: true,
            },
            { text: "True. The clock only shows 12 hours.", code: "MEA.TIME.FACTS" },
            { text: "True. The 12-hour clock covers the whole day once.", code: "MEA.TIME.FACTS" },
          ],
          solution: [{ say: "A day has 24 hours: 12 am hours and 12 pm hours." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === ampm(p.evening ? p.hour + 12 : p.hour, p.minutes);
    if (question.key.depth === 2) return numberAnswer(question) === p.length;
    return true;
  },
});
