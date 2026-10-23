/**
 * @statement Y3-AS-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-03.b: Use inverse operations to check answers
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-AS-03.ts";

interface Params {
  a: number;
  b: number;
  add: boolean;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-AS-03.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["AS.INVERSE.SAME-OPERATION"],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 120 : 210, numbers === "friendly" ? 499 : 899);
    const b = rng.int(numbers === "friendly" ? 11 : 101, numbers === "friendly" ? 99 : 499);
    const add = rng.bool();
    if (add && a + b > 999) reject("a 3-digit total");
    if (!add && b >= a - 50) reject("a clear difference");
    return { a, b, add };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.add ? p.a + p.b : p.a - p.b;
    const sign = p.add ? "+" : "-";
    const inverse = p.add ? "-" : "+";
    if (depth === 1) {
      return A.standard({
        question: [
          "Kim works out ",
          A.math(`${p.a} ${sign} ${p.b} = ${c}`),
          ". To check, she works out ",
          A.math(`${c} ${inverse} ${p.b}`),
          ".",
        ],
        ask: "What answer should she get if she is right?",
        answer: A.number(p.a),
        wrong: wrongs(p.a, [
          {
            code: "AS.INVERSE.SAME-OPERATION",
            value: A.number(p.add ? c + p.b : c - p.b),
            feedback: `The check undoes the calculation: ${c} ${inverse === "-" ? "−" : "+"} ${p.b} should take you back to ${p.a}.`,
          },
        ]),
        solution: [{ say: "", math: `${c} ${inverse} ${p.b} = ${p.a}` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Ali checks ",
        A.math(`${p.a} ${sign} ${p.b} = ${c}`),
        " by working out ",
        A.math(`${c} ${sign} ${p.b}`),
        ".",
      ],
      truth: false,
      reasons: [
        {
          text: `False. To check ${p.add ? "an addition" : "a subtraction"}, use the inverse: ${c} ${inverse === "-" ? "−" : "+"} ${p.b} should give ${p.a}.`,
          correct: true,
        },
        {
          text: "True. You check a calculation by doing the same thing again.",
          code: "AS.INVERSE.SAME-OPERATION",
        },
        { text: "True. Any calculation with the same numbers is a check." },
      ],
      solution: [{ say: "", math: `${c} ${inverse} ${p.b} = ${p.a}` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || numberAnswer(question) === p.a;
  },
};

export default defineGenerator(
  mixFamilies("Y3-AS-03.b", { 1: own, 2: { ...parent.definition, id: "Y3-AS-03.b" }, 4: own }),
);
