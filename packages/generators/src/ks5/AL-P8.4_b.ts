/**
 * @statement AL-P8.4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P8.4.b: Integrate e^(kx)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P8.4.ts";

interface Params {
  k: number;
  a: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P8.4.b",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["CALC.STANDARD-INTEGRAL"],

  params(rng) {
    return { k: rng.int(2, 6), a: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 2) {
      const coeff = p.a * p.k;
      return A.choice({
        rng,
        archetype: "varied-form",
        question: ["Find ", A.math(`\\int ${coeff}e^{${p.k}x}\\,dx`), "."],
        correct: A.math(`${p.a}e^{${p.k}x} + c`),
        distractors: [
          {
            content: A.math(`${coeff * p.k}e^{${p.k}x} + c`),
            code: "CALC.STANDARD-INTEGRAL",
            feedback: `Integrating divides by ${p.k}; differentiating would multiply by it.`,
          },
          {
            content: A.math(`${coeff}e^{${p.k}x} + c`),
            code: "CALC.STANDARD-INTEGRAL",
            feedback: `Differentiate your answer: you need to divide by ${p.k}.`,
          },
        ],
        solution: [
          {
            say: "",
            math: `\\int ${coeff}e^{${p.k}x}\\,dx = \\frac{${coeff}}{${p.k}}e^{${p.k}x} + c = ${p.a}e^{${p.k}x} + c`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: ["Dan says ", A.math(`\\int e^{${p.k}x}\\,dx = ${p.k}e^{${p.k}x} + c`), "."],
      truth: false,
      reasons: [
        {
          text: `False. Differentiating ${p.k}e^(${p.k}x) gives ${p.k * p.k}e^(${p.k}x). Integrating divides by ${p.k}: (1/${p.k})e^(${p.k}x) + c.`,
          correct: true,
        },
        {
          text: "True. Bring the power down in front, as when differentiating.",
          code: "CALC.STANDARD-INTEGRAL",
        },
        {
          text: "True. e to a power integrates to itself, times the power.",
          code: "CALC.STANDARD-INTEGRAL",
        },
      ],
      solution: [{ say: "", math: `\\int e^{${p.k}x}\\,dx = \\frac{1}{${p.k}}e^{${p.k}x} + c` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || chosenText(question) === `${p.a}e^{${p.k}x} + c`;
  },
};

export default defineGenerator(
  mixFamilies("AL-P8.4.b", { 1: { ...parent.definition, id: "AL-P8.4.b" }, 2: own, 4: own }),
);
