/**
 * @statement CM-SG6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG6: Find nth terms of linear and quadratic sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  d: number;
  N: number;
  A2: number;
  B: number;
  C: number;
  r: number;
}

const quad = (p: Params, n: number) => p.A2 * n * n + p.B * n + p.C;

export default defineGenerator<Params>({
  id: "CM-SG6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.SEQUENCE.POSITION-RULE",
    "ALG.SEQUENCE.QUADRATIC-HALF",
    "ALG.SEQUENCE.TYPE",
  ],

  params(rng) {
    const p = {
      a: rng.int(-5, 12),
      d: rng.int(-6, 9),
      N: rng.int(20, 100),
      A2: rng.int(1, 5),
      B: rng.int(-6, 6),
      C: rng.int(-5, 9),
      r: rng.int(2, 3),
    };
    if (p.d === 0) reject("a changing sequence");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a + (p.N - 1) * p.d;
        const terms = [0, 1, 2, 3].map((k) => p.a + k * p.d);
        return A.standard({
          question: [`A sequence begins ${terms.join(", ")}, …`],
          ask: `Find the ${p.N}th term.`,
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a + p.N * p.d),
              feedback: `The nth term is ${p.d}n ${p.a - p.d < 0 ? "−" : "+"} ${Math.abs(p.a - p.d)}: the first term has n = 1, so add ${p.N - 1} differences to it.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} + (${p.N} - 1) \\times ${p.d} = ${v}` }],
        });
      }
      case 2: {
        const terms = [1, 2, 3, 4, 5].map((n) => quad(p, n));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A quadratic sequence begins ${terms.join(", ")}, …`],
              ask: "Find the coefficient of n² in its nth term.",
            },
          ],
          answer: A.number(p.A2),
          wrong: signedWrongs(p.A2, [
            {
              code: "ALG.SEQUENCE.QUADRATIC-HALF",
              value: A.number(2 * p.A2),
              feedback: `The second difference is ${2 * p.A2}; the coefficient of n² is half of it.`,
            },
          ]),
          solution: [
            {
              say: `The second differences are all ${2 * p.A2}, so the coefficient of n² is ${2 * p.A2} ÷ 2 = ${p.A2}.`,
            },
          ],
        });
      }
      default: {
        const g = [0, 1, 2, 3].map((k) => p.r ** (k + 1));
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Jas says the sequence ${g.join(", ")}, … is linear, because it increases each time.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The differences (${g
                .slice(1)
                .map((x, i) => x - (g[i] ?? 0))
                .join(
                  ", ",
                )}) are not constant. Each term is ${p.r} times the one before: it is geometric.`,
              correct: true,
            },
            { text: "True. Any increasing sequence is linear.", code: "ALG.SEQUENCE.TYPE" },
            {
              text: "True. The terms go up by the same amount each time.",
              code: "ALG.SEQUENCE.TYPE",
            },
          ],
          solution: [{ say: "A linear sequence has a constant first difference." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a + (p.N - 1) * p.d;
    if (question.key.depth === 2) return numberAnswer(question) === p.A2;
    return true;
  },
});
