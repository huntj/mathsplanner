/**
 * @statement GF-R5.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R5.c: Apply ratio to conversion, comparison, scaling, mixing and concentrations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  s: number;
  t: number;
  u: number;
  a: number;
  b: number;
  k: number;
  rate: number;
  pounds: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-R5.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.UNITS.DIRECTION"],

  params(rng) {
    const p = {
      s: rng.int(2, 6),
      t: rng.int(3, 12),
      u: rng.int(2, 9) * 25,
      a: rng.int(1, 5),
      b: rng.int(2, 7),
      k: rng.int(2, 8),
      rate: rng.pick([1.1, 1.15, 1.2, 1.25]),
      pounds: rng.int(2, 20) * 20,
    };
    if (p.s === p.t || p.a === p.b) reject("different amounts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.t * p.u;
        return A.standard({
          question: [`A recipe for ${p.s} people uses ${p.s * p.u} g of flour.`],
          ask: `How much flour is needed for ${p.t} people?`,
          answer: A.number(v, { units: "g" }),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.s * p.u + (p.t - p.s), { units: "g" }),
              feedback: `Find the flour for 1 person, ${p.u} g, then multiply by ${p.t}.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.s * p.u} \\div ${p.s} \\times ${p.t} = ${v} \\text{ g}` },
          ],
        });
      }
      case 2: {
        const v = p.b * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Green paint is made by mixing blue and yellow in the ratio ${p.a} : ${p.b}. Jo uses ${p.a * p.k} litres of blue.`,
              ],
              ask: "How many litres of yellow does she need?",
            },
            {
              question: [
                `A drink is made from squash and water in the ratio ${p.a} : ${p.b}. Kit uses ${p.a * p.k} ml of squash.`,
              ],
              ask: "How much water, in ml, does he need?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.a * p.k + (p.b - p.a)),
              feedback: `The ratio is multiplied by ${p.k}, so multiply both parts by ${p.k}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} : ${p.b} = ${p.a * p.k} : ${v}` }],
        });
      }
      default: {
        const euros = r(p.pounds * p.rate);
        return A.trueOrFalseWhy({
          rng,
          statement: [`£1 = €${p.rate}. Ella says €${euros} is worth £${r(euros * p.rate)}.`],
          truth: false,
          reasons: [
            {
              text: `False. Each pound buys more than one euro, so divide: ${euros} ÷ ${p.rate} = £${p.pounds}.`,
              correct: true,
            },
            { text: `True. Multiply by the rate, ${p.rate}.`, code: "RAT.UNITS.DIRECTION" },
            { text: "True. Converting always means multiplying.", code: "RAT.UNITS.DIRECTION" },
          ],
          solution: [{ say: "Check: there should be fewer pounds than euros." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.t * p.u;
    if (question.key.depth === 2) return numberAnswer(question) === p.b * p.k;
    return true;
  },
});
