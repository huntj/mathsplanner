/**
 * @statement AL-P8.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P8.4.a: Integrate 1/x
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P8.4.ts";

interface Params {
  k: number;
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P8.4.a",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["CALC.STANDARD-INTEGRAL", "ALG.LOG.LAWS"],

  params(rng) {
    const a = rng.int(1, 4);
    const p = { k: rng.int(2, 9), a, b: a * rng.int(2, 5) };
    if (p.b - p.a === p.b / p.a) reject("a wrong answer that differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Find ", A.math(`\\int \\frac{${p.k}}{x}\\,dx`), "."],
        correct: A.math(`${p.k}\\ln|x| + c`),
        distractors: [
          {
            content: A.math(`-\\frac{${p.k}}{x^2} + c`),
            code: "CALC.STANDARD-INTEGRAL",
            feedback: "That is the derivative of k/x, not its integral.",
          },
          {
            content: A.math(`\\ln|${p.k}x| + c`),
            code: "CALC.STANDARD-INTEGRAL",
            feedback: `The constant ${p.k} multiplies the integral: ${p.k} × ln|x|.`,
          },
          {
            content: A.math(`\\frac{${p.k}}{\\ln x} + c`),
            code: "CALC.STANDARD-INTEGRAL",
            feedback: "∫1/x dx = ln|x| + c.",
          },
        ],
        solution: [{ say: "", math: `\\int \\frac{${p.k}}{x}\\,dx = ${p.k}\\ln|x| + c` }],
      });
    }
    const r = p.b / p.a;
    return A.choice({
      rng,
      archetype: "varied-form",
      question: [
        "Find the exact value of ",
        A.math(`\\int_{${p.a}}^{${p.b}} \\frac{1}{x}\\,dx`),
        ".",
      ],
      correct: A.math(`\\ln ${r}`),
      distractors: [
        {
          content: A.math(`\\ln ${p.b - p.a}`),
          code: "ALG.LOG.LAWS",
          feedback: `ln ${p.b} − ln ${p.a} = ln(${p.b}/${p.a}), not ln(${p.b} − ${p.a}).`,
        },
        {
          content: A.math(`\\frac{1}{${p.a}} - \\frac{1}{${p.b}}`),
          code: "CALC.STANDARD-INTEGRAL",
          feedback: "Integrate 1/x to ln x, then substitute the limits.",
        },
      ],
      solution: [
        { say: "", math: `[\\ln x]_{${p.a}}^{${p.b}} = \\ln ${p.b} - \\ln ${p.a} = \\ln ${r}` },
      ],
    });
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${p.k}\\ln|x| + c`;
    return chosenText(question) === `\\ln ${p.b / p.a}`;
  },
};

export default defineGenerator(
  mixFamilies("AL-P8.4.a", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P8.4.a" } }),
);
