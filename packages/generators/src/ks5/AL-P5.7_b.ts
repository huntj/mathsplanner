/**
 * @statement AL-P5.7.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.7.b: Solve quadratic equations in trig functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.7.ts";

interface Params {
  cos: boolean;
}

const list = (xs: number[]) => xs.map((x) => `${x}^\\circ`).join(",\\ ");

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.7.b",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["ALG.QUADRATIC.ONE-ROOT", "GEO.TRIG.IDENTITY"],

  params(rng) {
    return { cos: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      const fn = p.cos ? "cos" : "sin";
      const zeros = p.cos ? [90, 270] : [0, 180];
      const ones = p.cos ? [60, 300] : [30, 150];
      const all = [...zeros, ...ones].sort((a, b) => a - b);
      return A.choice({
        rng,
        question: [
          "Solve ",
          A.math(`2\\${fn}^2 x = \\${fn} x`),
          " for ",
          A.math("0^\\circ \\le x < 360^\\circ"),
          ".",
        ],
        correct: A.math(list(all)),
        distractors: [
          {
            content: A.math(list(ones)),
            code: "ALG.QUADRATIC.ONE-ROOT",
            feedback: `Do not divide by ${fn} x: it could be 0. Factorise: ${fn} x(2 ${fn} x − 1) = 0.`,
          },
          {
            content: A.math(list(zeros)),
            code: "ALG.QUADRATIC.ONE-ROOT",
            feedback: `There is a second factor, 2 ${fn} x − 1 = 0, as well.`,
          },
        ],
        solution: [
          { say: "", math: `\\${fn} x(2\\${fn} x - 1) = 0 \\Rightarrow x = ${list(all)}` },
        ],
      });
    }
    return A.choice({
      rng,
      archetype: "varied-form",
      question: [
        "Solve ",
        A.math("2\\cos^2 x + \\sin x - 1 = 0"),
        " for ",
        A.math("0^\\circ \\le x < 360^\\circ"),
        ", using ",
        A.math("\\cos^2 x = 1 - \\sin^2 x"),
        ".",
      ],
      correct: A.math(list([90, 210, 330])),
      distractors: [
        {
          content: A.math(list([90])),
          code: "ALG.QUADRATIC.ONE-ROOT",
          feedback:
            "The quadratic 2 sin² x − sin x − 1 = 0 has two roots: sin x = 1 and sin x = −½.",
        },
        {
          content: A.math(list([30, 90, 150])),
          code: "GEO.TRIG.IDENTITY",
          feedback: "Check the sign: (2 sin x + 1)(sin x − 1) = 0 gives sin x = −½, not ½.",
        },
      ],
      solution: [
        {
          say: "",
          math: "2\\sin^2 x - \\sin x - 1 = 0 \\Rightarrow (2\\sin x + 1)(\\sin x - 1) = 0",
        },
      ],
    });
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question) === list([90, 210, 330]);
    return chosenText(question) === list(p.cos ? [60, 90, 270, 300] : [0, 30, 150, 180]);
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.7.b", { 1: own, 2: own, 4: { ...parent.definition, id: "AL-P5.7.b" } }),
);
