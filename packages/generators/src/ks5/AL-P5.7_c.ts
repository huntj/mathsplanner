/**
 * @statement AL-P5.7.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.7.c: Solve trig equations with multiple angles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.7.ts";

interface Params {
  k: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.7.c",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["GEO.TRIG.MULTIPLE-ANGLE"],

  params(rng) {
    return { k: rng.pick([2, 3, 4]) };
  },

  build(p, _depth, rng): QuestionDraft {
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Mia solves ",
        A.math(`\\sin ${p.k}x = \\frac{1}{2}`),
        " for 0° ≤ x < 360°. She solves sin y = ½ for 0° ≤ y < 360° to get y = 30°, 150°, divides by " +
          p.k +
          ", and says those are all the solutions.",
      ],
      truth: false,
      reasons: [
        {
          text: `False. y = ${p.k}x runs from 0° to ${360 * p.k}°, so she must find every y in that range before dividing: ${2 * p.k} solutions.`,
          correct: true,
        },
        {
          text: "True. Dividing the two solutions by the multiple gives all of them.",
          code: "GEO.TRIG.MULTIPLE-ANGLE",
        },
        {
          text: "True. sin kx has the same number of solutions as sin x.",
          code: "GEO.TRIG.MULTIPLE-ANGLE",
        },
      ],
      solution: [{ say: `Change the interval first: 0° ≤ ${p.k}x < ${360 * p.k}°.` }],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.7.c", { 2: { ...parent.definition, id: "AL-P5.7.c" }, 4: own }),
);
