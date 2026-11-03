/**
 * @statement GF-N2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N2.b: Calculate with decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  m: number;
  s: number;
  t: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-N2.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.DECIMAL.POINT-PLACE"],

  params(rng) {
    const s = rng.int(2, 4);
    return {
      a: rng.int(2, 9),
      b: rng.int(2, 9),
      k: rng.int(2, 9),
      m: rng.int(2, 30),
      s,
      t: rng.int(2, Math.floor(9 / s)),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r((p.a * p.b) / 100);
        return A.standard({
          question: ["Work out ", A.math(`0.${p.a} \\times 0.${p.b}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(r((p.a * p.b) / 10)),
              feedback: "Tenths times tenths gives hundredths: the answer has two decimal places.",
            },
          ]),
          solution: [
            {
              say: `${p.a} × ${p.b} = ${p.a * p.b}, and the answer has two decimal places: `,
              math: String(v),
            },
          ],
        });
      }
      case 2: {
        const top = r((p.k * p.m) / 10);
        return A.variedForm({
          rng,
          forms: [{ question: ["Work out ", A.math(`${top} \\div 0.${p.k}`), "."] }],
          answer: A.number(p.m),
          wrong: wrongs(p.m, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(r(p.m / 10)),
              feedback: `Multiply both numbers by 10 first: ${p.k * p.m} ÷ ${p.k}.`,
            },
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(p.m * 10),
              feedback: `Multiply both numbers by 10, not just one: ${p.k * p.m} ÷ ${p.k}.`,
            },
          ]),
          solution: [
            { say: "", math: `${top} \\div 0.${p.k} = ${p.k * p.m} \\div ${p.k} = ${p.m}` },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Ben says ", A.math(`0.${p.s} \\times 0.${p.t} = 0.${p.s * p.t}`), "."],
              truth: false,
              reasons: [
                {
                  text: `False. ${p.s} × ${p.t} = ${p.s * p.t}, and tenths times tenths gives hundredths: 0.0${p.s * p.t}.`,
                  correct: true,
                },
                {
                  text: "True. Multiply the digits and keep one decimal point.",
                  code: "NPV.DECIMAL.POINT-PLACE",
                },
                { text: `False. It is ${p.s * p.t}.`, code: "NPV.DECIMAL.POINT-PLACE" },
              ],
              solution: [
                {
                  say: "Estimate: both numbers are less than 1, so the product is smaller than each of them.",
                },
              ],
            }),
          [
            {
              statement: "Ana says $0.4 \\times 0.2 = 0.08$.",
              truth: true,
              right: "True. 4 × 2 = 8, and the answer needs two decimal places.",
              wrong: [["False. It is 0.8.", "NPV.DECIMAL.POINT-PLACE"], ["False. It is 8."]],
            },
            {
              claim: "Multiplying a number by 0.5 halves it.",
              truth: "always",
              right: "Always. 0.5 is a half.",
              wrong: [
                ["Never. Multiplying makes it bigger.", "NPV.DECIMAL.POINT-PLACE"],
                ["Sometimes. Only for even numbers."],
              ],
            },
            {
              statement: "Leo says $6 \\div 0.2 = 1.2$.",
              truth: false,
              right: "False. Dividing by 0.2 is the same as multiplying by 5: 30.",
              wrong: [
                ["True. 6 × 0.2 = 1.2.", "NPV.DECIMAL.POINT-PLACE"],
                ["True. Dividing always makes smaller."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r((p.a * p.b) / 100);
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
