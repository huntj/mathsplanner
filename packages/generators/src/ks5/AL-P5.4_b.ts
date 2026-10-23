/**
 * @statement AL-P5.4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.4.b: Use arcsin, arccos and arctan, with their domains and ranges
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.4.ts";

// [function, value, principal answer, a second angle with the same value outside the range]
const CASES: [string, string, string, string][] = [
  ["\\arcsin", "\\frac{1}{2}", "\\frac{\\pi}{6}", "\\frac{5\\pi}{6}"],
  ["\\arcsin", "-\\frac{1}{2}", "-\\frac{\\pi}{6}", "\\frac{7\\pi}{6}"],
  ["\\arccos", "\\frac{1}{2}", "\\frac{\\pi}{3}", "-\\frac{\\pi}{3}"],
  ["\\arccos", "-\\frac{1}{2}", "\\frac{2\\pi}{3}", "\\frac{4\\pi}{3}"],
  ["\\arctan", "1", "\\frac{\\pi}{4}", "\\frac{5\\pi}{4}"],
  ["\\arctan", "-1", "-\\frac{\\pi}{4}", "\\frac{3\\pi}{4}"],
];

interface Params {
  c: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.4.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["ALG.FUNCTION.DOMAIN-RANGE"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [fn, value, right, other] = CASES[p.c] ?? CASES[0] ?? ["", "", "", ""];
    const range =
      fn === "\\arccos"
        ? "0 \\le y \\le \\pi"
        : fn === "\\arcsin"
          ? "-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}"
          : "-\\frac{\\pi}{2} < y < \\frac{\\pi}{2}";
    if (depth === 1) {
      return A.choice({
        rng,
        question: ["Find the exact value of ", A.math(`${fn}\\left(${value}\\right)`), "."],
        correct: A.math(right),
        distractors: [
          {
            content: A.math(other),
            code: "ALG.FUNCTION.DOMAIN-RANGE",
            feedback:
              "That angle has the right value but is outside the range of the inverse function.",
          },
          {
            content: A.math(`\\frac{1}{${value}}`),
            feedback: "An inverse function gives an angle, not a reciprocal.",
          },
        ],
        solution: [{ say: "The answer must lie in the range ", math: range }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Pia says ",
        A.math(`${fn}\\left(${value}\\right) = ${other}`),
        ", because the function of that angle gives the right value.",
      ],
      truth: false,
      reasons: [
        {
          text: `False. ${fn.slice(1)} only gives angles in its range, so the answer is the one in that range.`,
          correct: true,
        },
        {
          text: "True. Any angle with the right value will do.",
          code: "ALG.FUNCTION.DOMAIN-RANGE",
        },
        {
          text: "True. Inverse trig functions have no restricted range.",
          code: "ALG.FUNCTION.DOMAIN-RANGE",
        },
      ],
      solution: [{ say: "", math: `${fn}\\left(${value}\\right) = ${right}` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || chosenText(question) === CASES[p.c]?.[2];
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.4.b", { 1: own, 2: { ...parent.definition, id: "AL-P5.4.b" }, 4: own }),
);
