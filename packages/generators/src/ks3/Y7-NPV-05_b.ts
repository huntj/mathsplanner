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

interface Params {
  a: number;
  b: number;
  c: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-05.b",
  version: "1.0.0",
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
        return A.alwaysSometimesNever({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.c * p.b * p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.c + p.a * p.s;
    return true;
  },
});
