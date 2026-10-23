/**
 * @statement AL-P4.5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P4.5.b: Sum geometric series
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P4.5.ts";

interface Params {
  a: number;
  r: number;
  n: number;
}

const sum = (p: Params) => (p.a * (p.r ** p.n - 1)) / (p.r - 1);

const own: GeneratorDefinition<Params> = {
  id: "AL-P4.5.b",
  version: "1.0.0",
  depths: [2, 4],
  misconceptions: ["ALG.SERIES.FORMULA"],

  params(rng) {
    return { a: rng.int(1, 5), r: rng.pick([2, 3]), n: rng.int(4, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    const s = sum(p);
    if (depth === 2) {
      const terms = [0, 1, 2].map((k) => p.a * p.r ** k);
      const last = p.a * p.r ** (p.n - 1);
      return A.standard({
        question: [
          `Find the sum of the geometric series `,
          A.math(`${terms.join(" + ")} + \\dots + ${last}`),
          ".",
        ],
        answer: A.number(s),
        wrong: signedWrongs(s, [
          {
            code: "ALG.SERIES.FORMULA",
            value: A.number((p.a * (p.r ** (p.n - 1) - 1)) / (p.r - 1)),
            feedback: `Count the terms: ${last} = ${p.a} × ${p.r}^${p.n - 1}, so there are ${p.n} terms.`,
          },
        ]),
        solution: [
          {
            say: `There are ${p.n} terms.`,
            math: `S_{${p.n}} = \\frac{${p.a}(${p.r}^{${p.n}} - 1)}{${p.r} - 1} = ${s}`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `Kim adds the first ${p.n} terms of a geometric series with a = ${p.a} and r = ${p.r} using a(rⁿ − 1)/(r − 1) with n = ${p.n - 1}, because the last power is r^${p.n - 1}.`,
      truth: false,
      reasons: [
        {
          text: `False. n is the number of terms, ${p.n}, not the last power. S = ${s}.`,
          correct: true,
        },
        { text: "True. n is always the highest power of r.", code: "ALG.SERIES.FORMULA" },
        {
          text: "True. The formula needs one fewer than the number of terms.",
          code: "ALG.SERIES.FORMULA",
        },
      ],
      solution: [
        { say: "", math: `S_{${p.n}} = \\frac{${p.a}(${p.r}^{${p.n}} - 1)}{${p.r} - 1} = ${s}` },
      ],
    });
  },

  verify(p, question) {
    return question.key.depth !== 2 || numberAnswer(question) === sum(p);
  },
};

export default defineGenerator(
  mixFamilies("AL-P4.5.b", { 1: { ...parent.definition, id: "AL-P4.5.b" }, 2: own, 4: own }),
);
