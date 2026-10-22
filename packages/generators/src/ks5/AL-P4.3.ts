/**
 * @statement AL-P4.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.3: Use sigma notation for sums of series
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  n: number;
  k: number;
  c: number;
}

const tri = (n: number) => (n * (n + 1)) / 2;

export default defineGenerator<Params>({
  id: "AL-P4.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIGMA.COUNT"],

  params(rng) {
    return {
      a: rng.int(2, 5),
      b: rng.int(1, 7),
      n: rng.int(10, 30),
      k: rng.int(5, 12),
      c: rng.int(2, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = p.a * tri(p.n) + p.b * p.n;
        return A.standard({
          question: ["Work out ", A.math(`\\sum_{r=1}^{${p.n}} (${poly([p.a, p.b], "r")})`), "."],
          answer: A.number(s),
          wrong: signedWrongs(s, [
            {
              code: "ALG.SIGMA.COUNT",
              value: A.number(p.a * tri(p.n) + p.b),
              feedback: `The ${p.b} is added in every one of the ${p.n} terms: ${p.b} × ${p.n}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} \\times \\frac{${p.n} \\times ${p.n + 1}}{2} + ${p.b} \\times ${p.n} = ${p.a * tri(p.n)} + ${p.b * p.n} = ${s}`,
            },
          ],
        });
      }
      case 2: {
        const top = p.k + 20;
        const s = tri(top) - tri(p.k - 1);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`\\sum_{r=${p.k}}^{${top}} r`), "."] },
            { question: ["Find the value of ", A.math(`\\sum_{r=${p.k}}^{${top}} r`), "."] },
          ],
          answer: A.number(s),
          wrong: signedWrongs(s, [
            {
              code: "ALG.SIGMA.COUNT",
              value: A.number(tri(top) - tri(p.k)),
              feedback: `The sum includes r = ${p.k}, so subtract only the sum up to ${p.k - 1}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sum_{r=1}^{${top}} r - \\sum_{r=1}^{${p.k - 1}} r = ${tri(top)} - ${tri(p.k - 1)} = ${s}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Uma says ", A.math(`\\sum_{r=1}^{${p.n}} ${p.c} = ${p.c}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. There are ${p.n} terms, each equal to ${p.c}: the sum is ${p.c * p.n}.`,
              correct: true,
            },
            {
              text: "True. There is no r to substitute, so it is just the number.",
              code: "ALG.SIGMA.COUNT",
            },
            { text: `False. It is ${p.c} × ${p.n + 1}.`, code: "ALG.SIGMA.COUNT" },
          ],
          solution: [{ say: `Sum ${p.c} once for each r from 1 to ${p.n}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * tri(p.n) + p.b * p.n;
    return true;
  },
});
