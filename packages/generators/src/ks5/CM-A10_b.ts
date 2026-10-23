/**
 * @statement CM-A10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-A10.b: Handle tied ranks
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./CM-A10.ts";

interface Params {
  /** The rank position where three tied values start. */
  start: number;
}

const own: GeneratorDefinition<Params> = {
  id: "CM-A10.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["STA.MEDIAN.UNORDERED"],

  params(rng) {
    return { start: rng.int(2, 6) };
  },

  build(p, _depth, rng): QuestionDraft {
    const mean = p.start + 1;
    return A.trueOrFalseWhy({
      rng,
      statement: `Three scores are tied for ranks ${p.start}, ${p.start + 1} and ${p.start + 2}. Leo gives all three the rank ${p.start}, and the next score the rank ${p.start + 1}.`,
      truth: false,
      reasons: [
        {
          text: `False. Tied values share the mean of the ranks they fill: (${p.start} + ${p.start + 1} + ${p.start + 2}) ÷ 3 = ${mean}. The next score is ranked ${p.start + 3}.`,
          correct: true,
        },
        {
          text: "True. Tied values take the first rank and the next value carries on from there.",
          code: "STA.MEDIAN.UNORDERED",
        },
        { text: "True. Any rank will do, as long as tied values match." },
      ],
      solution: [
        {
          say: `Each tied score gets rank ${mean}; the ranks ${p.start} to ${p.start + 2} are used up.`,
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("CM-A10.b", { 1: { ...parent.definition, id: "CM-A10.b" }, 4: own }),
);
