/**
 * @statement Y7-NPV-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-05.b: Include powers and roots in the order of operations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-05.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng) {
    return { a: rng.int(2, 6), b: rng.int(2, 6), c: rng.int(2, 9), s: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.c * p.b * p.b;
        return A.standard({
          question: ["Work out ", A.math(`${p.c} \\times ${p.b}^2`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.c * p.b) ** 2),
              feedback: `Only the ${p.b} is squared: powers come before multiplying.`,
            },
          ]),
          solution: [{ say: "", math: `${p.c} \\times ${p.b * p.b} = ${v}` }],
        });
      }
      case 2: {
        const v = p.c + p.a * p.s;
        return A.variedForm({
          rng,
          forms: [{ question: ["Work out ", A.math(`${p.c} + ${p.a}\\sqrt{${p.s * p.s}}`), "."] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.c + p.a) * p.s),
              feedback: `Work out the root first, then multiply by ${p.a}, then add.`,
            },
          ]),
          solution: [{ say: "", math: `${p.c} + ${p.a} \\times ${p.s} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [A.math("a^2 + b^2 = (a + b)^2")],
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. It works only if a or b is 0. With a = ${p.a} and b = ${p.b}: ${p.a * p.a + p.b * p.b} is not ${(p.a + p.b) ** 2}.`,
                  correct: true,
                },
                {
                  text: "Always. You can square each part separately.",
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                },
                { text: "Never. The two sides can never be equal." },
              ],
              solution: [{ say: "Brackets first: (a + b)² squares the whole sum." }],
            }),
          [
            {
              statement: `Lou says $${p.c} + ${p.s}^2 = ${p.c + p.s * p.s}$.`,
              truth: true,
              right: `True. Powers come before adding: ${p.s}² = ${p.s * p.s}, then add ${p.c}.`,
              wrong: [
                [
                  `False. Add first: (${p.c} + ${p.s})² = ${(p.c + p.s) ** 2}.`,
                  "NPV.ORDER.LEFT-TO-RIGHT",
                ],
                [`False. ${p.s}² is ${2 * p.s}, so it is ${p.c + 2 * p.s}.`],
              ],
            },
            {
              statement: `Amy says $2 \\times ${p.s}^2 = ${(2 * p.s) ** 2}$.`,
              truth: false,
              right: `False. Square first: ${p.s}² = ${p.s * p.s}, then × 2 = ${2 * p.s * p.s}.`,
              wrong: [
                ["True. Multiply first, then square.", "NPV.ORDER.LEFT-TO-RIGHT"],
                ["True. Work from left to right.", "NPV.ORDER.LEFT-TO-RIGHT"],
              ],
            },
            {
              claim: "$\\sqrt{a^2} = a$, for any positive number $a$.",
              truth: "always",
              right:
                "Always. For a positive number, squaring and then square-rooting gets you back where you started.",
              wrong: [
                ["Sometimes. Only when a is a square number."],
                ["Never. A square root halves the number."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.c * p.b * p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.c + p.a * p.s;
    return true;
  },
});
