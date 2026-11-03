/**
 * @statement GF-N6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N6.b: Use square and cube roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  m: number;
  neg: boolean;
}

export default defineGenerator<Params>({
  id: "GF-N6.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.ROOT-HALF"],

  params(rng) {
    return { n: rng.int(4, 15), m: rng.int(2, 6), neg: rng.int(0, 1) === 1 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Work out ", A.math(`\\sqrt{${p.n * p.n}}`), "."],
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.POWER.ROOT-HALF",
              value: A.number((p.n * p.n) / 2),
              feedback: `The square root is the number that multiplies by itself to give ${p.n * p.n}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} \\times ${p.n} = ${p.n * p.n}` }],
        });
      case 2: {
        const cube = p.m ** 3 * (p.neg ? -1 : 1);
        const v = p.neg ? -p.m : p.m;
        const third = cube / 3;
        return A.variedForm({
          rng,
          forms: [{ question: ["Work out ", A.math(`\\sqrt[3]{${cube}}`), "."] }],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            Number.isInteger(third)
              ? {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(third),
                  feedback: `The cube root is the number that multiplies by itself three times to give ${cube}.`,
                }
              : undefined,
            p.neg
              ? {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(p.m),
                  feedback: `${p.m}³ = ${p.m ** 3}, which is positive. Try a negative number.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `(${v})^3 = ${cube}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A positive number has two square roots."],
              truth: "always",
              reasons: [
                {
                  text: `Always. For example ${p.n}² and (−${p.n})² both equal ${p.n * p.n}, so ${p.n * p.n} has square roots ${p.n} and −${p.n}.`,
                  correct: true,
                },
                { text: "Sometimes. Only square numbers have square roots." },
                {
                  text: "Never. A square root is half of the number.",
                  code: "NPV.POWER.ROOT-HALF",
                },
              ],
              solution: [
                { say: "The √ sign means the positive root, but there is a negative one too." },
              ],
            }),
          [
            {
              statement: "Eli says $\\sqrt{81} = 9$.",
              truth: true,
              right: "True. 9 × 9 = 81.",
              wrong: [["False. It is 40.5.", "NPV.POWER.ROOT-HALF"], ["False. It is 18."]],
            },
            {
              statement: "Ola says the cube root of 27 is 9.",
              truth: false,
              right: "False. 3 × 3 × 3 = 27, so the cube root is 3.",
              wrong: [["True. 27 ÷ 3 = 9.", "NPV.POWER.ROOT-HALF"], ["True. 9 × 3 = 27."]],
            },
            {
              claim: "The square root of a number is half of it.",
              truth: "sometimes",
              right: "Sometimes. √4 = 2 is half of 4, but √9 = 3 is not half of 9.",
              wrong: [
                ["Always. Root means half.", "NPV.POWER.ROOT-HALF"],
                ["Never. Not even for 4."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 2) return numberAnswer(question) === (p.neg ? -p.m : p.m);
    return true;
  },
});
