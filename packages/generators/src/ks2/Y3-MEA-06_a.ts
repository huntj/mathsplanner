/**
 * @statement Y3-MEA-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-06.a: Know the number of seconds in a minute
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-MEA-06.ts";

interface Params {
  minutes: number;
  half: boolean;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-06.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["MEA.TIME.FACTS", "MEA.TIME.DECIMAL"],

  params(rng) {
    return { minutes: rng.int(2, 9), half: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const s = 60 * p.minutes;
    if (depth === 2) {
      return A.standard({
        question: `A sand timer runs for ${s} seconds.`,
        ask: "How many minutes is that?",
        answer: A.number(p.minutes, { units: "minutes" }),
        wrong: wrongs(p.minutes, [
          {
            code: "MEA.TIME.FACTS",
            value: A.number(s / 100, { units: "minutes" }),
            feedback: "There are 60 seconds in a minute, so divide by 60, not 100.",
          },
        ]),
        solution: [{ say: `${s} ÷ 60 = ${p.minutes} minutes.` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `Omar says ${p.minutes}.5 minutes is ${p.minutes} minutes and 50 seconds.`,
      truth: false,
      reasons: [
        {
          text: `False. 0.5 of a minute is half of 60 seconds, which is 30 seconds. So it is ${p.minutes} minutes and 30 seconds.`,
          correct: true,
        },
        { text: "True. The digits after the point are the seconds.", code: "MEA.TIME.DECIMAL" },
        { text: "True. A minute has 100 seconds.", code: "MEA.TIME.FACTS" },
      ],
      solution: [{ say: "Half a minute is 30 seconds, because a minute is 60 seconds." }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || numberAnswer(question) === p.minutes;
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-06.a", { 1: { ...parent.definition, id: "Y3-MEA-06.a" }, 2: own, 4: own }),
);
