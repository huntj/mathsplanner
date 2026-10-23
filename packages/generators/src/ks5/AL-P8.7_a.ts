/**
 * @statement AL-P8.7.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P8.7.a: Integrate by substitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P8.7.ts";

interface Params {
  a: number;
  n: number;
  lo: number;
  hi: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P8.7.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["CALC.SUBSTITUTION"],

  params(rng) {
    return { a: rng.int(1, 5), n: rng.int(2, 5), lo: rng.int(0, 1), hi: rng.int(2, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const integral = `\\int_{${p.lo}}^{${p.hi}} 2x(x^2 + ${p.a})^${p.n}\\,dx`;
    const [ulo, uhi] = [p.lo * p.lo + p.a, p.hi * p.hi + p.a];
    if (depth === 1) {
      return A.choice({
        rng,
        question: [
          "Using ",
          A.math(`u = x^2 + ${p.a}`),
          ", which integral is equal to ",
          A.math(integral),
          "?",
        ],
        correct: A.math(`\\int_{${ulo}}^{${uhi}} u^${p.n}\\,du`),
        distractors: [
          {
            content: A.math(`\\int_{${p.lo}}^{${p.hi}} u^${p.n}\\,du`),
            code: "CALC.SUBSTITUTION",
            feedback: `Change the limits too: when x = ${p.lo}, u = ${ulo}; when x = ${p.hi}, u = ${uhi}.`,
          },
          {
            content: A.math(`\\int_{${ulo}}^{${uhi}} 2xu^${p.n}\\,du`),
            code: "CALC.SUBSTITUTION",
            feedback: "du = 2x dx, so the 2x dx becomes du.",
          },
        ],
        solution: [
          {
            say: "",
            math: `du = 2x\\,dx,\\ x = ${p.lo} \\Rightarrow u = ${ulo},\\ x = ${p.hi} \\Rightarrow u = ${uhi}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Kai substitutes ",
        A.math(`u = x^2 + ${p.a}`),
        " into ",
        A.math(integral),
        ` and keeps the limits ${p.lo} and ${p.hi}.`,
      ],
      truth: false,
      reasons: [
        {
          text: `False. The limits are values of x. In terms of u they become ${ulo} and ${uhi}.`,
          correct: true,
        },
        { text: "True. Limits never change in a definite integral.", code: "CALC.SUBSTITUTION" },
        { text: "True. You only change dx into du.", code: "CALC.SUBSTITUTION" },
      ],
      solution: [
        {
          say: "Either change the limits to u-values, or substitute back for x before using the original limits.",
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("AL-P8.7.a", { 1: own, 2: { ...parent.definition, id: "AL-P8.7.a" }, 4: own }),
);
