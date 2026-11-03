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
import { orClaims } from "../shared/variety.ts";

interface Params {
  s: number;
  t: number;
  rho: number;
  vol: number;
}

export default defineGenerator<Params>({
  id: "GF-N13.b",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["If you travel twice as far in twice the time, your average speed doubles."],
              truth: "never",
              reasons: [
                {
                  text: `Never. Speed = distance ÷ time, and doubling both leaves it the same: ${2 * p.s * p.t} ÷ ${2 * p.t} = ${p.s}.`,
                  correct: true,
                },
                {
                  text: "Always. You have gone twice as far.",
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                },
                { text: "Sometimes. It depends how fast you started." },
              ],
              solution: [
                {
                  say: "Doubling the top and the bottom of a division does not change the answer.",
                },
              ],
            }),
          [
            {
              statement:
                "A car travels 150 km in 2.5 hours. Ivy says its average speed is 60 km/h.",
              truth: true,
              right: "True. 150 ÷ 2.5 = 60.",
              wrong: [
                ["False. It is 375 km/h.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["False. It is 0.017 km/h.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
              ],
            },
            {
              statement: "A cyclist rides at 12 km/h for 30 minutes. Leo says she goes 360 km.",
              truth: false,
              right: "False. 30 minutes is 0.5 hours: 12 × 0.5 = 6 km.",
              wrong: [
                ["True. 12 × 30 = 360.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["True. Distance is speed times time."],
              ],
            },
            {
              claim: "Doubling your speed for the same distance halves the time.",
              truth: "always",
              right: "Always. time = distance ÷ speed.",
              wrong: [
                ["Never. It doubles the time.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["Sometimes. Only for short trips."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.s;
    if (question.key.depth === 2) return numberAnswer(question) === p.rho * p.vol;
    return true;
  },
});
