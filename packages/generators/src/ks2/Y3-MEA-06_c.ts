/**
 * @statement Y3-MEA-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-06.c: Know the number of days in a year and a leap year
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-MEA-06.ts";

interface Params {
  /** Depth 2: how many years, one of them a leap year. */
  years: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-06.c",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["MEA.TIME.FACTS"],

  params(rng) {
    return { years: rng.int(2, 4) };
  },

  build(p, depth): QuestionDraft {
    if (depth === 1) {
      return A.standard({
        question: "February has 29 days in a leap year instead of 28.",
        ask: "How many days are there in a leap year?",
        answer: A.number(366, { units: "days" }),
        wrong: wrongs(366, [
          {
            code: "MEA.TIME.FACTS",
            value: A.number(365, { units: "days" }),
            feedback: "365 days is an ordinary year. A leap year has one extra day.",
          },
        ]),
        solution: [
          { say: "An ordinary year has 365 days, so a leap year has 365 + 1 = 366 days." },
        ],
      });
    }
    const total = 365 * p.years + 1;
    return A.standard({
      question: `Ella counts the days in ${p.years} years in a row. One of them is a leap year.`,
      ask: "How many days are there altogether?",
      answer: A.number(total, { units: "days" }),
      wrong: wrongs(total, [
        {
          code: "MEA.TIME.FACTS",
          value: A.number(365 * p.years, { units: "days" }),
          feedback: "The leap year has 366 days, one more than the others.",
        },
      ]),
      solution: [
        { say: `${p.years} × 365 = ${365 * p.years}, plus 1 for the leap day: ${total}.` },
      ],
    });
  },

  verify(p, question) {
    return numberAnswer(question) === (question.key.depth === 1 ? 366 : 365 * p.years + 1);
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-06.c", { 1: own, 2: own, 4: { ...parent.definition, id: "Y3-MEA-06.c" } }),
);
