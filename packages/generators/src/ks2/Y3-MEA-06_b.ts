/**
 * @statement Y3-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-06.b: Know the number of days in each month
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { MONTHS, MONTH_DAYS } from "../shared/mea.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-MEA-06.ts";

const THIRTY = [3, 5, 8, 10];

interface Params {
  /** A 30-day month and three 31-day months to choose from. */
  thirty: number;
  others: number[];
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-MEA-06.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["MEA.TIME.FACTS"],

  params(rng) {
    return { thirty: rng.pick(THIRTY), others: rng.sample([0, 2, 4, 6, 7, 9, 11], 3) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Which month has 30 days?"],
        correct: MONTHS[p.thirty] ?? "",
        distractors: p.others.map((m) => ({
          content: MONTHS[m] ?? "",
          code: "MEA.TIME.FACTS",
          feedback: `${MONTHS[m]} has ${MONTH_DAYS[m]} days.`,
        })),
        solution: [{ say: "30 days has September, April, June and November." }],
      });
    }
    return A.alwaysSometimesNever({
      rng,
      claim: ["A month has 31 days."],
      truth: "sometimes",
      reasons: [
        {
          text: "Sometimes. Seven months have 31 days, four have 30, and February has 28 or 29.",
          correct: true,
        },
        { text: "Always. Every month is the same length.", code: "MEA.TIME.FACTS" },
        { text: "Never. Every month has 30 days.", code: "MEA.TIME.FACTS" },
      ],
      solution: [{ say: "January, March, May, July, August, October and December have 31 days." }],
    });
  },

  verify(_p, question) {
    return question.key.depth !== 1 || MONTH_DAYS[MONTHS.indexOf(chosenText(question))] === 30;
  },
};

export default defineGenerator(
  mixFamilies("Y3-MEA-06.b", { 1: own, 2: { ...parent.definition, id: "Y3-MEA-06.b" }, 4: own }),
);
