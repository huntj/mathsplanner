/**
 * @statement AL-P5.6.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.6.c: Write a cos θ + b sin θ as R cos(θ ± α) or R sin(θ ± α)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P5.6.ts";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
];

interface Params {
  t: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.6.c",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.TRIG.IDENTITY"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, R] = TRIPLES[p.t] ?? [3, 4, 5];
    const alpha = Math.round(((Math.atan2(b, a) * 180) / Math.PI) * 10) / 10;
    const expr = `${a}\\cos\\theta + ${b}\\sin\\theta`;
    if (depth === 1) {
      return A.standard({
        question: [
          "Write ",
          A.math(expr),
          " in the form ",
          A.math("R\\cos(\\theta - \\alpha)"),
          ", with R > 0 and 0° < α < 90°.",
        ],
        ask: "Find α, to 1 decimal place.",
        answer: A.number(alpha, { units: "°", accuracy: { dp: 1 } }),
        wrong: wrongs(alpha, [
          {
            code: "GEO.TRIG.IDENTITY",
            value: A.number(Math.round((90 - alpha) * 10) / 10, {
              units: "°",
              accuracy: { dp: 1 },
            }),
            feedback: `R cos α = ${a} and R sin α = ${b}, so tan α = ${b}/${a}.`,
          },
        ]),
        solution: [
          {
            say: "",
            math: `\\tan\\alpha = \\frac{${b}}{${a}} \\Rightarrow \\alpha = ${alpha}^\\circ`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Lou says the greatest value of ",
        A.math(expr),
        ` is ${a + b}, when both cos θ and sin θ are 1.`,
      ],
      truth: false,
      reasons: [
        {
          text: `False. cos θ and sin θ are never both 1. The expression is ${R} cos(θ − ${alpha}°), so its greatest value is R = ${R}.`,
          correct: true,
        },
        { text: "True. Add the largest value of each part.", code: "GEO.TRIG.IDENTITY" },
        { text: `True. R = ${a} + ${b}.`, code: "GEO.TRIG.IDENTITY" },
      ],
      solution: [{ say: "", math: `R = \\sqrt{${a}^2 + ${b}^2} = ${R}` }],
    });
  },

  verify(p, question) {
    const [a, b] = TRIPLES[p.t] ?? [3, 4];
    return (
      question.key.depth !== 1 ||
      numberAnswer(question) === Math.round(((Math.atan2(b, a) * 180) / Math.PI) * 10) / 10
    );
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.6.c", { 1: own, 2: { ...parent.definition, id: "AL-P5.6.c" }, 4: own }),
);
