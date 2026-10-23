/**
 * @statement Y1-MEA-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-06.c: Draw the hands on a clock face for o'clock and half past
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { ClockSpec } from "@mathsplanner/diagrams";
import { chosenFigure } from "../shared/counting.ts";
import { clock, h12, timeWords } from "../shared/mea.ts";

interface Params {
  hour: number;
}

const showing = (spec: unknown, h: number, m: number) => {
  const c = spec as ClockSpec | undefined;
  return c !== undefined && h12(c.hours) === h12(h) && c.minutes === m;
};

export default defineGenerator<Params>({
  id: "Y1-MEA-06.c",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.CLOCK.HANDS", "MEA.CLOCK.HOUR-AHEAD"],

  params(rng, numbers) {
    return { hour: rng.int(1, numbers === "friendly" ? 6 : 11) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.chooseTheDiagram({
          rng,
          question: [`Which clock shows ${timeWords(p.hour, 0)}?`],
          correct: clock(p.hour, 0),
          distractors: [
            {
              figure: clock(12, p.hour * 5),
              code: "MEA.CLOCK.HANDS",
              feedback: "The hands are swapped. The long minute hand points to 12 at o'clock.",
            },
            { figure: clock(p.hour, 30), feedback: `That clock shows half past ${p.hour}.` },
          ],
          solution: [
            {
              say: `For ${timeWords(p.hour, 0)}, the long minute hand points to 12 and the short hour hand to ${p.hour}.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which clock shows half past ${p.hour}?`],
          correct: clock(p.hour, 30),
          distractors: [
            {
              figure: clock(p.hour + 1, 30),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: `That clock shows half past ${h12(p.hour + 1)}. The hour hand should be just past ${p.hour}.`,
            },
            {
              figure: clock(p.hour, 0),
              feedback: `That clock shows ${p.hour} o'clock. At half past, the minute hand points to 6.`,
            },
          ],
          solution: [
            {
              say: `At half past ${p.hour}, the minute hand points to 6 and the hour hand is halfway between ${p.hour} and ${h12(p.hour + 1)}.`,
            },
          ],
        });
      default:
        return A.spotTheMistake({
          question: [`Nia draws the hands to show half past ${p.hour}.`],
          lines: [
            "The long minute hand goes to 6, halfway round.",
            `The short hour hand goes exactly on ${p.hour}.`,
            `So the clock shows half past ${p.hour}.`,
          ],
          mistake: 1,
          code: "MEA.CLOCK.HOUR-AHEAD",
          feedback: `Half an hour after ${p.hour} o'clock, the hour hand has moved on halfway between ${p.hour} and ${h12(p.hour + 1)}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return showing(chosenFigure(question), p.hour, 0);
    if (question.key.depth === 3) return showing(chosenFigure(question), p.hour, 30);
    return true;
  },
});
