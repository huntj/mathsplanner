/**
 * @statement AL-M8.6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-M8.6.b: Use friction in dynamics
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-M8.6.ts";

interface Params {
  m: number;
  /** μ in tenths. */
  mu: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-M8.6.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["MECH.FRICTION"],

  params(rng) {
    return { m: rng.int(2, 15), mu: rng.int(1, 6) };
  },

  build(p, _depth, rng): QuestionDraft {
    const mu = p.mu / 10;
    return A.trueOrFalseWhy({
      rng,
      statement: `A box of mass ${p.m} kg slides across a rough horizontal floor with μ = ${mu}. Ella says the friction force is μ × ${p.m} = ${Math.round(mu * p.m * 10) / 10} N.`,
      truth: false,
      reasons: [
        {
          text: `False. Friction is μR, and the normal reaction is R = mg = ${Math.round(p.m * 9.8 * 10) / 10} N, so F = ${Math.round(mu * p.m * 9.8 * 100) / 100} N.`,
          correct: true,
        },
        { text: "True. Friction is μ times the mass.", code: "MECH.FRICTION" },
        {
          text: "True. Once the box is moving, friction no longer depends on the reaction.",
          code: "MECH.FRICTION",
        },
      ],
      solution: [
        { say: "Sliding friction is limiting: F = μR, with R = mg on a horizontal floor." },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-M8.6.b", { 2: { ...parent.definition, id: "AL-M8.6.b" }, 4: own }),
);
