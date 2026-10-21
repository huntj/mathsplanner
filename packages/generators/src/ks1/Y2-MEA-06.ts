/**
 * @statement Y2-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-06: Tell and write the time to five minutes, including quarter past/to the hour and draw
// the hands on a clock face to show these times
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ClockSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { clock, digital, h12, timeWords } from "../shared/mea.ts";

interface Params {
  hour: number;
  minutes: number;
}

export default defineGenerator<Params>({
  id: "Y2-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.CLOCK.MINUTE-NUMBER", "MEA.CLOCK.HOUR-AHEAD", "MEA.CLOCK.PAST-TO"],

  params(rng, numbers) {
    const minutes = numbers === "friendly" ? rng.pick([15, 45, 5, 10, 20]) : rng.int(1, 11) * 5;
    if (minutes === 30) reject("not half past");
    return { hour: rng.int(1, 11), minutes };
  },

  build(p, depth, rng): QuestionDraft {
    const right = timeWords(p.hour, p.minutes);
    const pointsTo = p.minutes / 5;
    const past = p.minutes < 30;
    // Past and to swapped: 20 past 4 read as 20 to 4, and the reverse.
    const swapped = past
      ? timeWords(p.hour - 1, 60 - p.minutes)
      : timeWords(p.hour + 1, 60 - p.minutes);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["What time does the clock show?", A.figure(clock(p.hour, p.minutes))],
          correct: right,
          distractors: [
            {
              content: timeWords(p.hour, pointsTo),
              code: "MEA.CLOCK.MINUTE-NUMBER",
              feedback: `The minute hand points to ${pointsTo}, which means ${p.minutes} minutes past. Count in fives.`,
            },
            past
              ? {
                  content: swapped,
                  code: "MEA.CLOCK.PAST-TO",
                  feedback: `The minute hand is on the right of the clock, so it is minutes past ${p.hour}.`,
                }
              : {
                  content: timeWords(p.hour + 1, p.minutes),
                  code: "MEA.CLOCK.HOUR-AHEAD",
                  feedback: `The hour hand has passed ${p.hour} but not reached ${h12(p.hour + 1)}.`,
                },
            {
              content: past ? timeWords(p.hour + 1, p.minutes) : swapped,
              code: past ? "MEA.CLOCK.HOUR-AHEAD" : "MEA.CLOCK.PAST-TO",
              feedback: past
                ? `The hour hand has only just passed ${p.hour}.`
                : `The minute hand is on the left of the clock, so it is minutes to ${h12(p.hour + 1)}.`,
            },
          ].filter((d) => d.content !== right),
          solution: [
            {
              say: `The minute hand points to ${pointsTo}: ${p.minutes} minutes past, which is ${right}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A digital clock shows ${digital(p.hour, p.minutes)}.`,
          ask: "How do you say this time?",
          correct: right,
          distractors: [
            {
              content: swapped,
              code: "MEA.CLOCK.PAST-TO",
              feedback: `${p.minutes} minutes after ${p.hour} o'clock is ${right}.`,
            },
            {
              content: past ? timeWords(p.hour + 1, p.minutes) : timeWords(p.hour - 1, p.minutes),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: `The hour is ${p.hour}, and ${past ? "past" : "to"} counts from ${past ? p.hour : h12(p.hour + 1)}.`,
            },
          ].filter((d) => d.content !== right),
          solution: [
            {
              say: past
                ? `${p.minutes} minutes after ${p.hour}: ${right}.`
                : `${p.minutes} minutes past ${p.hour} is ${60 - p.minutes} minutes before ${h12(p.hour + 1)}: ${right}.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which clock shows ${right}?`],
          correct: clock(p.hour, p.minutes),
          distractors: [
            {
              figure: clock(p.hour, pointsTo),
              code: "MEA.CLOCK.MINUTE-NUMBER",
              feedback: `The minute hand should point to ${pointsTo}, for ${p.minutes} minutes.`,
            },
            past
              ? {
                  figure: clock(p.hour - 1, 60 - p.minutes),
                  code: "MEA.CLOCK.PAST-TO",
                  feedback: `That clock shows ${swapped}.`,
                }
              : {
                  figure: clock(p.hour + 1, p.minutes),
                  code: "MEA.CLOCK.HOUR-AHEAD",
                  feedback: `That clock shows ${timeWords(p.hour + 1, p.minutes)}.`,
                },
          ].filter((d) => !(h12(d.figure.hours) === h12(p.hour) && d.figure.minutes === p.minutes)),
          solution: [
            {
              say: `The minute hand points to ${pointsTo} and the hour hand is just ${past ? "past" : "before"} ${past ? p.hour : h12(p.hour + 1)}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Look at the clock.",
            A.figure(clock(p.hour, p.minutes)),
            `Kim says it is ${timeWords(p.hour, pointsTo)}, because the minute hand points to ${pointsTo}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Each number on the clock is 5 minutes for the minute hand, so ${pointsTo} means ${pointsTo} × 5 = ${p.minutes} minutes past. It is ${right}.`,
              correct: true,
            },
            {
              text: "True. The minute hand points to the number of minutes.",
              code: "MEA.CLOCK.MINUTE-NUMBER",
            },
            { text: `False. It is ${pointsTo} o'clock.` },
          ],
          solution: [{ say: "Count in fives round the clock to read the minute hand." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" || question.archetype === "varied-form")
      return chosenText(question) === timeWords(p.hour, p.minutes);
    if (question.archetype === "choose-the-diagram") {
      const c = chosenFigure(question) as ClockSpec | undefined;
      return c?.hours === p.hour && c.minutes === p.minutes;
    }
    return true;
  },
});
