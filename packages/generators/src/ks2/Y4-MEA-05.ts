/**
 * @statement Y4-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-05: Read, write and convert time between analogue and digital 12- and 24-hour clocks
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ClockSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { ampm, clock, h12, time24 } from "../shared/mea.ts";

export interface Params {
  /** 0 to 23. */
  hour: number;
  minutes: number;
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "00:15 is a quarter past midnight.",
    truth: true,
    why: "The 24-hour day starts at 00:00, midnight, so 00:15 is 15 minutes after midnight.",
  },
  {
    text: "12:30 is half past midnight.",
    truth: false,
    why: "12:30 is half past noon, in the afternoon. Half past midnight is 00:30.",
  },
  {
    text: "18:45 is a quarter to 7 in the evening.",
    truth: true,
    why: "18 − 12 = 6, so 18:45 is 6:45 pm, a quarter to 7.",
  },
  {
    text: "21:10 is 9:10 am.",
    truth: false,
    why: "21 is after 12, so it is pm: 21 − 12 = 9, so 9:10 pm.",
  },
];

export default defineGenerator<Params>({
  id: "Y4-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.TIME.24-HOUR", "MEA.CLOCK.HOUR-AHEAD"],

  params(rng, numbers) {
    const hour = rng.int(13, 23);
    const minutes = numbers === "friendly" ? rng.int(0, 11) * 5 : rng.int(1, 59);
    if (minutes < 31 && numbers !== "friendly" && rng.bool())
      reject("more times in the second half of the hour");
    return { hour, minutes, claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const right = time24(p.hour, p.minutes);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "It is the afternoon or evening. What is the time on this clock as a 24-hour time?",
            A.figure(clock(p.hour, p.minutes)),
          ],
          correct: right,
          distractors: [
            {
              content: time24(p.hour - 12, p.minutes),
              code: "MEA.TIME.24-HOUR",
              feedback: "Afternoon and evening times add 12 to the hour.",
            },
            {
              content: time24(p.hour + 1, p.minutes),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: `The hour hand has passed ${h12(p.hour)} but not reached ${h12(p.hour + 1)}.`,
            },
            {
              content: time24(p.hour - 2, p.minutes),
              code: "MEA.TIME.24-HOUR",
              feedback: `Add 12: ${h12(p.hour)} + 12 = ${p.hour}.`,
            },
          ].filter((d) => d.content !== right),
          solution: [
            { say: `The clock shows ${ampm(p.hour, p.minutes)}. Add 12 to the hour: ${right}.` },
          ],
        });
      case 2: {
        const twelve = ampm(p.hour, p.minutes);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A train leaves at ${right}.`,
          ask: "What is this as a 12-hour time?",
          correct: twelve,
          distractors: [
            {
              content: ampm(p.hour - 10, p.minutes).replace("am", "pm"),
              code: "MEA.TIME.24-HOUR",
              feedback: "Take away 12 from the hour, not 10.",
            },
            {
              content: twelve.replace("pm", "am"),
              code: "MEA.TIME.24-HOUR",
              feedback: "Hours from 12 to 23 are pm.",
            },
          ].filter((d) => d.content !== twelve),
          solution: [{ say: `${p.hour} − 12 = ${p.hour - 12}, so ${right} is ${twelve}.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which clock shows ${right}?`],
          correct: clock(p.hour, p.minutes),
          distractors: [
            {
              figure: clock(p.hour - 2, p.minutes),
              code: "MEA.TIME.24-HOUR",
              feedback: `${p.hour} is ${p.hour - 12} pm, so the hour hand should be near ${p.hour - 12}.`,
            },
            {
              figure: clock(p.hour + 1, p.minutes),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: `The hour hand should be between ${h12(p.hour)} and ${h12(p.hour + 1)}, not past ${h12(p.hour + 1)}.`,
            },
          ],
          solution: [{ say: `${right} is ${ampm(p.hour, p.minutes)}.` }],
        });
      default: {
        const c = (CLAIMS[p.claim] ?? CLAIMS[0]) as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Omar says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. 24-hour times take away 10 to give the 12-hour time.`,
              code: "MEA.TIME.24-HOUR",
            },
            {
              text: `${c.truth ? "False" : "True"}. Times beginning with 12 are always midnight.`,
              code: "MEA.TIME.24-HOUR",
            },
          ],
          solution: [
            {
              say: "00:00 is midnight and 12:00 is noon. From 13:00, take away 12 for the pm time.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === time24(p.hour, p.minutes);
    if (question.archetype === "varied-form")
      return chosenText(question) === ampm(p.hour, p.minutes);
    if (question.archetype === "choose-the-diagram") {
      const c = chosenFigure(question) as ClockSpec | undefined;
      return h12(c?.hours ?? -1) === h12(p.hour) && c?.minutes === p.minutes;
    }
    return true;
  },
});
