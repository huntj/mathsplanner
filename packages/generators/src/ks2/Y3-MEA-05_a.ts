/**
 * @statement Y3-MEA-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-05.a: Read the time to the nearest minute
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import type { ClockSpec } from "@mathsplanner/diagrams";
import { chosenFigure } from "../shared/counting.ts";
import { clock, digital, h12 } from "../shared/mea.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-MEA-05.ts";

interface Params {
  hour: number;
  /** Minutes past, from 1 to 11, so the minute hand is near the number it might be misread as. */
  minutes: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-05.a",
  version: "1.0.0",
  depths: [3],
  misconceptions: ["MEA.CLOCK.MINUTE-NUMBER", "MEA.CLOCK.HANDS"],

  params(rng) {
    const p = { hour: rng.int(2, 11), minutes: rng.int(1, 11) };
    if (p.minutes === 5 || p.minutes === 10 || p.minutes === p.hour) reject("distinct clocks");
    return p;
  },

  build(p, _depth, rng): QuestionDraft {
    return A.chooseTheDiagram({
      rng,
      question: [`Which clock shows ${digital(p.hour, p.minutes)}?`],
      correct: clock(p.hour, p.minutes),
      distractors: [
        {
          figure: clock(p.hour, 5 * p.minutes),
          code: "MEA.CLOCK.MINUTE-NUMBER",
          feedback: `That minute hand points at ${p.minutes}, which means ${5 * p.minutes} minutes.`,
        },
        {
          figure: clock(p.minutes, 5 * p.hour),
          code: "MEA.CLOCK.HANDS",
          feedback: "The hands are swapped: the short hand shows the hour.",
        },
      ],
      solution: [
        {
          say: `For ${digital(p.hour, p.minutes)}, the minute hand is ${p.minutes} small marks past 12 and the hour hand is just past ${h12(p.hour)}.`,
        },
      ],
    });
  },

  verify(p, question) {
    const c = chosenFigure(question) as ClockSpec | undefined;
    return c?.hours === p.hour && c.minutes === p.minutes;
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-05.a", { 1: { ...parent.definition, id: "Y3-MEA-05.a" }, 3: own }),
);
