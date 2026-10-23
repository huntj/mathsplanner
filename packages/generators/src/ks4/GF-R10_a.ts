/**
 * @statement GF-R10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R10.a: Solve direct proportion problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n1: number;
  n2: number;
  unit: number;
  k: number;
  x1: number;
  x2: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R10.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.PROPORTION.LINEAR-INTERCEPT"],

  params(rng) {
    const p = {
      n1: rng.int(2, 8),
      n2: rng.int(3, 15),
      unit: rng.int(15, 95),
      k: rng.int(2, 9),
      x1: rng.int(2, 8),
      x2: rng.int(9, 20),
    };
    if (p.n1 === p.n2) reject("different amounts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r2((p.unit * p.n2) / 100);
        return A.standard({
          question: [`${p.n1} kg of apples cost £${((p.unit * p.n1) / 100).toFixed(2)}.`],
          ask: `How much do ${p.n2} kg cost, in pounds?`,
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(r2((p.unit * p.n1) / 100 + (p.n2 - p.n1)), { units: "£" }),
              feedback: "Find the cost of 1 kg first, then multiply.",
            },
          ]),
          solution: [{ say: `1 kg costs ${p.unit}p, so ${p.n2} kg cost £${v.toFixed(2)}.` }],
        });
      }
      case 2: {
        const y1 = p.k * p.x1;
        const v = p.k * p.x2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.math("y"),
                " is directly proportional to ",
                A.math("x"),
                ". When ",
                A.math(`x = ${p.x1}`),
                ", ",
                A.math(`y = ${y1}`),
                ".",
              ],
              ask: ["Find ", A.math("y"), " when ", A.math(`x = ${p.x2}`), "."],
            },
            {
              question: [
                `The length of a spring's stretch is proportional to the mass hung on it. A ${p.x1} kg mass stretches it ${y1} mm.`,
              ],
              ask: `How far, in mm, does a ${p.x2} kg mass stretch it?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(y1 + (p.x2 - p.x1)),
              feedback: `Direct proportion multiplies: y = ${p.k}x.`,
            },
          ]),
          solution: [
            { say: "", math: `y = ${p.k}x \\Rightarrow y = ${p.k} \\times ${p.x2} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A taxi charges £3 plus £${p.k} per mile. Ola says the cost is directly proportional to the number of miles.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A journey of 0 miles still costs £3, so doubling the miles does not double the cost. Its graph does not go through the origin.",
              correct: true,
            },
            {
              text: "True. The cost goes up by the same amount for every mile.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
            {
              text: "True. Its graph is a straight line.",
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
            },
          ],
          solution: [{ say: "Direct proportion: a straight line through the origin." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2((p.unit * p.n2) / 100);
    if (question.key.depth === 2) return numberAnswer(question) === p.k * p.x2;
    return true;
  },
});
