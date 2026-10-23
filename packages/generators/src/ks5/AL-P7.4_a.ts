/**
 * @statement AL-P7.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.4.a: Use the chain rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P7.4.ts";

const OUTERS = [
  {
    y: (k: number) => `e^{${k}x^2}`,
    right: (k: number) => `${2 * k}xe^{${k}x^2}`,
    slip: (k: number) => `e^{${k}x^2}`,
  },
  {
    y: (k: number) => `\\sin(${k}x^2)`,
    right: (k: number) => `${2 * k}x\\cos(${k}x^2)`,
    slip: (k: number) => `\\cos(${k}x^2)`,
  },
  {
    y: (k: number) => `\\ln(${k}x^2 + 1)`,
    right: (k: number) => `\\frac{${2 * k}x}{${k}x^2 + 1}`,
    slip: (k: number) => `\\frac{1}{${k}x^2 + 1}`,
  },
];

interface Params {
  o: number;
  k: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P7.4.a",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["CALC.CHAIN"],

  params(rng) {
    return { o: rng.int(0, OUTERS.length - 1), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const o = OUTERS[p.o] ?? OUTERS[0];
    if (!o) throw new Error("no function");
    if (depth === 2) {
      return A.choice({
        rng,
        archetype: "varied-form",
        question: ["Differentiate ", A.math(`y = ${o.y(p.k)}`), "."],
        correct: A.math(o.right(p.k)),
        distractors: [
          {
            content: A.math(o.slip(p.k)),
            code: "CALC.CHAIN",
            feedback: `Multiply by the derivative of the inside, ${p.k}x², which is ${2 * p.k}x.`,
          },
          {
            content: A.math(o.right(p.k).replace(`${2 * p.k}x`, `${p.k}x`)),
            code: "CALC.CHAIN",
            feedback: `The derivative of ${p.k}x² is ${2 * p.k}x.`,
          },
        ],
        solution: [
          {
            say: "Differentiate the outside, keep the inside, then multiply by the derivative of the inside.",
            math: `\\frac{dy}{dx} = ${o.right(p.k)}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Will says the derivative of ",
        A.math(o.y(p.k)),
        " is ",
        A.math(o.slip(p.k)),
        ".",
      ],
      truth: false,
      reasons: [
        {
          text: `False. By the chain rule, multiply by the derivative of the inside, ${2 * p.k}x: ${o.right(p.k).replace(/\\/g, "")}.`,
          correct: true,
        },
        {
          text: "True. Differentiate the outside function and leave the inside alone.",
          code: "CALC.CHAIN",
        },
        { text: "True. The inside is a constant, so it does not matter.", code: "CALC.CHAIN" },
      ],
      solution: [{ say: "", math: `\\frac{d}{dx}\\left(${o.y(p.k)}\\right) = ${o.right(p.k)}` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || chosenText(question) === OUTERS[p.o]?.right(p.k);
  },
};

export default defineGenerator(
  mixFamilies("AL-P7.4.a", { 1: { ...parent.definition, id: "AL-P7.4.a" }, 2: own, 4: own }),
);
