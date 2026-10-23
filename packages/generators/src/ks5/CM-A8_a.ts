/**
 * @statement CM-A8.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A8.a: Draw lines of best fit and make predictions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./CM-A8.ts";

interface Params {
  lo: number;
  hi: number;
  far: number;
}

const own: GeneratorDefinition<Params> = {
  id: "CM-A8.a",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["ALG.MODEL.LIMITATION"],

  params(rng) {
    const lo = rng.int(1, 4) * 5;
    const hi = lo + rng.int(3, 6) * 5;
    return { lo, hi, far: hi + rng.int(4, 10) * 10 };
  },

  build(p, _depth, rng): QuestionDraft {
    return A.trueOrFalseWhy({
      rng,
      statement: `A line of best fit is drawn for plants grown for between ${p.lo} and ${p.hi} days. Eve uses it to predict a plant's height after ${p.far} days and says the prediction is reliable.`,
      truth: false,
      reasons: [
        {
          text: `False. ${p.far} days is far outside the data (${p.lo} to ${p.hi} days). Extrapolating assumes the trend carries on, which it may not.`,
          correct: true,
        },
        { text: "True. A line of best fit works for any value.", code: "ALG.MODEL.LIMITATION" },
        {
          text: "True. Predictions are more reliable the further you go.",
          code: "ALG.MODEL.LIMITATION",
        },
      ],
      solution: [
        {
          say: "Predictions inside the range of the data (interpolation) are more reliable than predictions outside it (extrapolation).",
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("CM-A8.a", { 1: { ...parent.definition, id: "CM-A8.a" }, 4: own }),
);
