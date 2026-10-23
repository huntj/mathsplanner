/**
 * @statement Y7-NPV-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-07.b: Use cubes and cube roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  e: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-07.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SQUARE.DOUBLES", "NPV.POWER.ROOT-HALF", "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    return { n: rng.int(2, 6), e: rng.pick([2, 3, 4, 5, 6, 10]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.n ** 3;
        return A.standard({
          question: ["Work out ", A.math(`${p.n}^3`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MD.SQUARE.DOUBLES",
              value: A.number(3 * p.n),
              feedback: `${p.n}³ means ${p.n} × ${p.n} × ${p.n}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} \\times ${p.n} \\times ${p.n} = ${v}` }],
        });
      }
      case 2: {
        const vol = p.e ** 3;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A cube has a volume of ${vol} cm³.`],
              ask: "How long is each edge, in cm?",
            },
            {
              question: [`A box shaped like a cube holds ${vol} cm³.`],
              ask: "What is the length of one of its edges, in cm?",
            },
          ],
          answer: A.number(p.e),
          wrong: wrongs(p.e, [
            Number.isInteger(vol / 3)
              ? {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(vol / 3),
                  feedback:
                    "The edge is the cube root: the number that multiplies by itself three times to give the volume.",
                }
              : {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(vol / 2),
                  feedback: "The edge is the cube root, not half the volume.",
                },
          ]),
          solution: [{ say: "", math: `\\sqrt[3]{${vol}} = ${p.e}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Dan says ", A.math(`(-${p.n})^3 = ${p.n ** 3}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. (−${p.n}) × (−${p.n}) = ${p.n * p.n}, then × (−${p.n}) gives −${p.n ** 3}. An odd power of a negative number is negative.`,
              correct: true,
            },
            {
              text: "True. Powers always give positive answers.",
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
            },
            { text: "True. The negatives cancel out.", code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE" },
          ],
          solution: [{ say: "Count the negative signs: three of them make a negative." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n ** 3;
    if (question.key.depth === 2) return numberAnswer(question) === p.e;
    return true;
  },
});
