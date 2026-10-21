/**
 * @statement Y1-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-06: Tell the time to the hour and half past the hour and draw the hands on a clock face to
// show these times
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { ClockSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { clock, h12, timeWords } from "../shared/mea.ts";

interface Params {
  hour: number;
  half: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.CLOCK.HANDS", "MEA.CLOCK.HOUR-AHEAD", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    return {
      hour: rng.int(1, numbers === "friendly" ? 6 : 11),
      half: numbers === "friendly" ? rng.bool() : true,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const m = p.half ? 30 : 0;
    const right = timeWords(p.hour, m);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["What time does the clock show?", A.figure(clock(p.hour, m))],
          correct: right,
          distractors: p.half
            ? [
                {
                  content: timeWords(p.hour + 1, 30),
                  code: "MEA.CLOCK.HOUR-AHEAD",
                  feedback: `At half past, the hour hand has gone past ${p.hour} but not reached ${h12(p.hour + 1)}. It is half past ${p.hour}.`,
                },
                {
                  content: `${p.hour === 6 ? 12 : 6} o'clock`,
                  code: "MEA.CLOCK.HANDS",
                  feedback: "The long hand is the minute hand. Pointing at 6, it shows half past.",
                },
                {
                  content: timeWords(p.hour, 0),
                  feedback: "The minute hand points at 6, not 12, so it is half past.",
                },
              ]
            : [
                {
                  content: timeWords(p.hour, 30),
                  feedback: "The minute hand points to 12, so it is o'clock.",
                },
                {
                  content: `12 o'clock`,
                  code: "MEA.CLOCK.HANDS",
                  feedback: `The long minute hand is on 12. The short hour hand points to ${p.hour}.`,
                },
                {
                  content: timeWords(p.hour + 1, 0),
                  feedback: `The hour hand points exactly at ${p.hour}.`,
                },
              ].filter((d) => d.content !== right),
          solution: [
            {
              say: p.half
                ? `The minute hand is on 6 and the hour hand is halfway between ${p.hour} and ${h12(p.hour + 1)}: half past ${p.hour}.`
                : `The minute hand is on 12 and the hour hand on ${p.hour}: ${p.hour} o'clock.`,
            },
          ],
        });
      case 2: {
        const later = p.half ? timeWords(p.hour + 1, 0) : timeWords(p.hour, 30);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `It is ${right}.`,
          ask: "What time will it be in half an hour?",
          correct: later,
          distractors: [
            {
              content: p.half ? timeWords(p.hour + 1, 30) : timeWords(p.hour + 1, 0),
              code: "MEA.TIME.FACTS",
              feedback: "That is one hour later. Half an hour is 30 minutes.",
            },
            {
              content: p.half ? timeWords(p.hour, 0) : timeWords(p.hour - 1, 30),
              feedback: "That is half an hour earlier.",
            },
          ],
          solution: [{ say: `Half an hour after ${right} is ${later}.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which clock shows ${right}?`],
          correct: clock(p.hour, m),
          distractors: p.half
            ? [
                {
                  figure: clock(p.hour + 1, 30),
                  code: "MEA.CLOCK.HOUR-AHEAD",
                  feedback: `That clock shows half past ${h12(p.hour + 1)}.`,
                },
                {
                  figure: clock(6, p.hour * 5),
                  code: "MEA.CLOCK.HANDS",
                  feedback: "The hands are swapped. The long hand should point to 6.",
                },
                { figure: clock(p.hour, 0), feedback: `That clock shows ${p.hour} o'clock.` },
              ].filter((d) => !(h12(d.figure.hours) === h12(p.hour) && d.figure.minutes === m))
            : [
                { figure: clock(p.hour, 30), feedback: `That clock shows half past ${p.hour}.` },
                {
                  figure: clock(12, p.hour * 5),
                  code: "MEA.CLOCK.HANDS",
                  feedback: "The hands are swapped. The long minute hand should point to 12.",
                },
              ].filter((d) => !(h12(d.figure.hours) === h12(p.hour) && d.figure.minutes === m)),
          solution: [
            {
              say: p.half
                ? `For half past ${p.hour}, the minute hand points to 6 and the hour hand is halfway between ${p.hour} and ${h12(p.hour + 1)}.`
                : `For ${p.hour} o'clock, the minute hand points to 12 and the hour hand to ${p.hour}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Lily says that at half past ${p.hour}, the hour hand points exactly at ${p.hour}.`,
          truth: false,
          reasons: [
            {
              text: `False. Half an hour has passed since ${p.hour} o'clock, so the hour hand is halfway between ${p.hour} and ${h12(p.hour + 1)}.`,
              correct: true,
            },
            {
              text: `True. It is half past ${p.hour}, so the hour hand points at ${p.hour}.`,
              code: "MEA.CLOCK.HOUR-AHEAD",
            },
            {
              text: `False. The hour hand points at ${h12(p.hour + 1)}.`,
              code: "MEA.CLOCK.HOUR-AHEAD",
            },
          ],
          solution: [
            {
              say: "The hour hand moves slowly all the time, so at half past it is halfway to the next number.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const m = p.half ? 30 : 0;
    if (question.archetype === "standard") return chosenText(question) === timeWords(p.hour, m);
    if (question.archetype === "choose-the-diagram") {
      const c = chosenFigure(question) as ClockSpec | undefined;
      return c?.hours === p.hour && c.minutes === m;
    }
    return true;
  },
});
