/**
 * @statement AL-P2.8.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.8.a: Find the domain and range of a function
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P2.8.ts";

interface Params {
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P2.8.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["ALG.FUNCTION.DOMAIN-RANGE"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(-6, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const f = `f(x) = \\sqrt{x - ${p.a}} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`;
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: ["The function ", A.math(f), " is defined for as many real x as possible."],
        ask: "What is its largest possible domain?",
        correct: A.math(`x \\ge ${p.a}`),
        distractors: [
          {
            content: A.math(`f(x) \\ge ${p.b}`),
            code: "ALG.FUNCTION.DOMAIN-RANGE",
            feedback: "That is the range, the set of outputs. The domain is the set of inputs.",
          },
          { content: A.math(`x \\ge -${p.a}`), feedback: `The square root needs x − ${p.a} ≥ 0.` },
          {
            content: A.math(`x > 0`),
            feedback: `x − ${p.a} must not be negative, so x must be at least ${p.a}.`,
          },
        ],
        solution: [
          {
            say: `A square root needs a value that is not negative: x − ${p.a} ≥ 0, so x ≥ ${p.a}.`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: ["Ellie says the range of ", A.math(f), " is ", A.math(`x \\ge ${p.a}`), "."],
      truth: false,
      reasons: [
        {
          text: `False. x ≥ ${p.a} is the domain. The square root is at least 0, so the range is f(x) ≥ ${p.b}.`,
          correct: true,
        },
        {
          text: "True. The domain and the range are the same thing.",
          code: "ALG.FUNCTION.DOMAIN-RANGE",
        },
        {
          text: `True. The range is always the smallest x the function allows.`,
          code: "ALG.FUNCTION.DOMAIN-RANGE",
        },
      ],
      solution: [{ say: `Domain x ≥ ${p.a}; range f(x) ≥ ${p.b}.` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || chosenText(question).includes(`x \\ge ${p.a}`);
  },
};

export default defineGenerator(
  mixFamilies("AL-P2.8.a", { 1: { ...parent.definition, id: "AL-P2.8.a" }, 2: own, 4: own }),
);
