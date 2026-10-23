/**
 * @statement AL-S5.1a.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S5.1a.b: Find critical values and regions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-S5.1a.ts";

interface Params {
  alpha: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-S5.1a.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["STA.HYPOTHESIS.TAIL", "STA.HYPOTHESIS.CONCLUSION"],

  params(rng) {
    return { alpha: rng.pick([1, 5, 10]) };
  },

  build(p, _depth, rng): QuestionDraft {
    return A.trueOrFalseWhy({
      rng,
      statement: `For a two-tailed test at the ${p.alpha}% level, Ravi chooses each critical region so that its probability is as close as possible to ${p.alpha}%.`,
      truth: false,
      reasons: [
        {
          text: `False. In a two-tailed test the ${p.alpha}% is split between the tails, so each tail should have probability at most ${p.alpha / 2}%.`,
          correct: true,
        },
        {
          text: "True. Each tail uses the full significance level.",
          code: "STA.HYPOTHESIS.CONCLUSION",
        },
        {
          text: "True. Two-tailed tests use double the significance level.",
          code: "STA.HYPOTHESIS.TAIL",
        },
      ],
      solution: [
        {
          say: `Halve the significance level for each tail of a two-tailed test: ${p.alpha / 2}% each.`,
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-S5.1a.b", { 2: { ...parent.definition, id: "AL-S5.1a.b" }, 4: own }),
);
