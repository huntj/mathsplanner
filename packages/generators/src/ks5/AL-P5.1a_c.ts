/**
 * @statement AL-P5.1a.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1a.c: Use the cosine rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { r1, rad } from "../shared/trig.ts";
import parent from "./AL-P5.1a.ts";

interface Params {
  b: number;
  c: number;
  A: number;
}

const side = (p: Params) =>
  r1(Math.sqrt(p.b * p.b + p.c * p.c - 2 * p.b * p.c * Math.cos(rad(p.A))));

const own: GeneratorDefinition<Params> = {
  id: "AL-P5.1a.c",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["GEO.COSINE-RULE.ORDER"],

  params(rng) {
    return { b: rng.int(4, 15), c: rng.int(4, 15), A: rng.int(30, 140) };
  },

  build(p, depth, rng): QuestionDraft {
    const a = side(p);
    const slip = (p.b * p.b + p.c * p.c - 2 * p.b * p.c) * Math.cos(rad(p.A));
    if (depth === 2) {
      return A.standard({
        question: `In triangle ABC, AC = ${p.b} cm, AB = ${p.c} cm and angle BAC = ${p.A}°.`,
        ask: "Find BC, to 1 decimal place.",
        answer: A.number(a, { units: "cm", accuracy: { dp: 1 } }),
        wrong: wrongs(a, [
          {
            code: "GEO.COSINE-RULE.ORDER",
            value: A.number(
              r1(Math.sqrt(p.b * p.b + p.c * p.c + 2 * p.b * p.c * Math.cos(rad(p.A)))),
              { units: "cm", accuracy: { dp: 1 } },
            ),
            feedback: "The rule is a² = b² + c² − 2bc cos A: subtract the last term.",
          },
        ]),
        solution: [
          {
            say: "",
            math: `a^2 = ${p.b}^2 + ${p.c}^2 - 2 \\times ${p.b} \\times ${p.c} \\cos ${p.A}^\\circ \\Rightarrow a = ${a}\\text{ cm}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `Ivan works out a² for AC = ${p.b}, AB = ${p.c} and angle A = ${p.A}° as (${p.b}² + ${p.c}² − 2 × ${p.b} × ${p.c}) × cos ${p.A}°.`,
      truth: false,
      reasons: [
        {
          text: "False. Only the 2bc term is multiplied by cos A: a² = b² + c² − 2bc cos A.",
          correct: true,
        },
        {
          text: "True. Work out the bracket first, then multiply by cos A.",
          code: "GEO.COSINE-RULE.ORDER",
        },
        { text: "True. That is the same as b² + c² − 2bc cos A.", code: "GEO.COSINE-RULE.ORDER" },
      ],
      solution: [{ say: `Ivan's way gives ${r1(slip)}; the cosine rule gives a² = ${r1(a * a)}.` }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || numberAnswer(question) === side(p);
  },
};

export default defineGenerator(
  mixFamilies("AL-P5.1a.c", { 1: { ...parent.definition, id: "AL-P5.1a.c" }, 2: own, 4: own }),
);
