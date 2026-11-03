/**
 * @statement Y7-ALG-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-04.b: Multiply a single term over a bracket
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  a: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-04.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.EXPAND.NEGATIVE"],

  params(rng) {
    return { k: rng.int(2, 9), a: rng.int(2, 6), c: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = linear([
          [p.k, "x"],
          [p.k * p.c, ""],
        ]);
        return A.standard({
          question: ["Expand ", A.math(`${p.k}(x + ${p.c})`), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.exact(
                linear([
                  [p.k, "x"],
                  [p.c, ""],
                ]),
              ),
              feedback: `Multiply both terms in the bracket by ${p.k}.`,
            },
          ],
          solution: [{ say: "", math: `${p.k} \\times x + ${p.k} \\times ${p.c} = ${right}` }],
        });
      }
      case 2: {
        const right = linear([
          [p.k * p.a, "x"],
          [-p.k * p.c, ""],
        ]);
        return A.variedForm({
          rng,
          forms: [{ question: ["Expand ", A.math(`${p.k}(${p.a}x - ${p.c})`), "."] }],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.exact(
                linear([
                  [p.k * p.a, "x"],
                  [-p.c, ""],
                ]),
              ),
              feedback: `${p.k} multiplies the ${p.c} as well.`,
            },
          ],
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ben says ",
                A.math(`-${p.k}(x - ${p.c}) = -${p.k}x - ${p.k * p.c}`),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. −${p.k} × −${p.c} = +${p.k * p.c}, so it is −${p.k}x + ${p.k * p.c}.`,
                  correct: true,
                },
                { text: "True. The minus sign goes on every term.", code: "ALG.EXPAND.NEGATIVE" },
                {
                  text: `True. Multiply ${p.c} by ${p.k} and keep the sign from the bracket.`,
                  code: "ALG.EXPAND.NEGATIVE",
                },
              ],
              solution: [{ say: "A negative times a negative is positive." }],
            }),
          [
            {
              statement: `Ana says $${p.k}(x + ${p.c}) = ${p.k}x + ${p.k * p.c}$.`,
              truth: true,
              right: `True. Multiply both terms by ${p.k}: ${p.k} × x and ${p.k} × ${p.c}.`,
              wrong: [
                [`False. It is ${p.k}x + ${p.c}.`, "ALG.EXPAND.FIRST-ONLY"],
                [`False. It is ${p.k}x + ${p.k + p.c}.`],
              ],
            },
            {
              statement: `Tom says $${p.a}(${p.k}x - ${p.c}) = ${p.a * p.k}x - ${p.c}$.`,
              truth: false,
              right: `False. The ${p.a} multiplies both terms: ${p.a * p.k}x − ${p.a * p.c}.`,
              wrong: [
                ["True. Only the first term is multiplied.", "ALG.EXPAND.FIRST-ONLY"],
                ["True. The number after a minus sign stays the same.", "ALG.EXPAND.FIRST-ONLY"],
              ],
            },
            {
              claim: "$a(b + c) = ab + ac$",
              truth: "always",
              right: "Always. a lots of b and c together is a lots of b plus a lots of c.",
              wrong: [
                ["Sometimes. Only when the numbers are positive.", "ALG.EXPAND.NEGATIVE"],
                ["Never. It is ab + c.", "ALG.EXPAND.FIRST-ONLY"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        exactAnswer(question) ===
        linear([
          [p.k, "x"],
          [p.k * p.c, ""],
        ])
      );
    if (question.key.depth === 2)
      return (
        exactAnswer(question) ===
        linear([
          [p.k * p.a, "x"],
          [-p.k * p.c, ""],
        ])
      );
    return true;
  },
});
