/**
 * @statement CM-P6.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// CM-P6.c: Use the multiplication rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./CM-P6.ts";

interface Params {
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "CM-P6.c",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["PRO.INDEPENDENT.EXCLUSIVE"],

  params(rng) {
    return { a: rng.int(2, 8) / 10, b: rng.int(2, 8) / 10 };
  },

  build(p, _depth, rng): QuestionDraft {
    const both = Math.round(p.a * p.b * 100) / 100;
    return A.trueOrFalseWhy({
      rng,
      statement: `Events A and B are independent, with P(A) = ${p.a} and P(B) = ${p.b}. Zoe says P(A and B) = 0, because independent events cannot happen together.`,
      truth: false,
      reasons: [
        {
          text: `False. That describes mutually exclusive events. For independent events P(A and B) = P(A) × P(B) = ${both}.`,
          correct: true,
        },
        {
          text: "True. Independent means the events never happen at the same time.",
          code: "PRO.INDEPENDENT.EXCLUSIVE",
        },
        {
          text: "True. P(A and B) is always 0 for two different events.",
          code: "PRO.INDEPENDENT.EXCLUSIVE",
        },
      ],
      solution: [{ say: "", math: `P(A \\cap B) = ${p.a} \\times ${p.b} = ${both}` }],
    });
  },
};

export default defineGenerator(
  mixFamilies("CM-P6.c", { 2: { ...parent.definition, id: "CM-P6.c" }, 4: own }),
);
