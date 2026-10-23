/**
 * @statement GF-N13.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N13.b: Use compound measures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  s: number;
  t: number;
  rho: number;
  vol: number;
}

export default defineGenerator<Params>({
  id: "GF-N13.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    return { s: rng.int(4, 18) * 5, t: rng.int(2, 6), rho: rng.int(2, 12), vol: rng.int(5, 50) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = p.s * p.t;
        return A.standard({
          question: [`A coach travels ${d} km in ${p.t} hours.`],
          ask: "Find its average speed in km/h.",
          answer: A.number(p.s, { units: "km/h" }),
          wrong: wrongs(p.s, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(d * p.t, { units: "km/h" }),
              feedback: "Speed = distance ÷ time: kilometres per hour.",
            },
          ]),
          solution: [{ say: "", math: `${d} \\div ${p.t} = ${p.s} \\text{ km/h}` }],
        });
      }
      case 2: {
        const v = p.rho * p.vol;
        const flipped = p.vol / p.rho;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A block has density ${p.rho} g/cm³ and volume ${p.vol} cm³.`],
              ask: "Find its mass in grams.",
            },
            {
              question: [
                `A metal has density ${p.rho} g/cm³. A part made from it has volume ${p.vol} cm³.`,
              ],
              ask: "What is the mass of the part, in grams?",
            },
          ],
          answer: A.number(v, { units: "g" }),
          wrong: wrongs(v, [
            Number.isInteger(flipped)
              ? {
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                  value: A.number(flipped, { units: "g" }),
                  feedback: "Density is grams per cm³, so mass = density × volume.",
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `${p.rho} \\times ${p.vol} = ${v} \\text{ g}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["If you travel twice as far in twice the time, your average speed doubles."],
          truth: "never",
          reasons: [
            {
              text: `Never. Speed = distance ÷ time, and doubling both leaves it the same: ${2 * p.s * p.t} ÷ ${2 * p.t} = ${p.s}.`,
              correct: true,
            },
            { text: "Always. You have gone twice as far.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
            { text: "Sometimes. It depends how fast you started." },
          ],
          solution: [
            { say: "Doubling the top and the bottom of a division does not change the answer." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.s;
    if (question.key.depth === 2) return numberAnswer(question) === p.rho * p.vol;
    return true;
  },
});
