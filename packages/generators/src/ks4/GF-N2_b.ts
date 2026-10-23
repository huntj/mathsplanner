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
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r((p.a * p.b) / 100);
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
