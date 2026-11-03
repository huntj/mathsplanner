/**
 * @statement Y8-RAT-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-05.a: Solve problems with speed
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  s: number;
  t: number;
  kmh: number;
  v1: number;
  v2: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-05.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT", "RAT.UNITS.DIRECTION", "RAT.SPEED.MEAN"],

  params(rng) {
    return {
      s: rng.int(4, 20) * 5,
      t: rng.pick([1.5, 2, 2.5, 3, 4]),
      kmh: rng.int(1, 8) * 18,
      v1: rng.int(2, 5) * 10,
      v2: rng.int(6, 9) * 10,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.s * p.t;
        return A.standard({
          question: [`A coach travels at an average speed of ${p.s} km/h for ${p.t} hours.`],
          ask: "How far does it travel, in km?",
          answer: A.number(v, { units: "km" }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r2(p.s / p.t), { units: "km" }),
              feedback: "Distance = speed × time.",
            },
          ]),
          solution: [{ say: "", math: `${p.s} \\times ${p.t} = ${v} \\text{ km}` }],
        });
      }
      case 2: {
        const v = p.kmh / 3.6;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A cyclist rides at ${p.kmh} km/h.`],
              ask: "What is this speed in metres per second?",
            },
          ],
          answer: A.number(v, { units: "m/s" }),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(r2(p.kmh * 3.6), { units: "m/s" }),
              feedback: `${p.kmh} km/h is ${p.kmh * 1000} m in 3600 s: divide by 3.6.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.kmh} \\times 1000}{3600} = ${v} \\text{ m/s}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Kit drives for one hour at ${p.v1} km/h and then for another hour at ${p.v2} km/h. She says her average speed is ${(p.v1 + p.v2) / 2} km/h.`,
              ],
              truth: true,
              reasons: [
                {
                  text: `True. She spends equal times at each speed: (${p.v1} + ${p.v2}) km in 2 hours = ${(p.v1 + p.v2) / 2} km/h.`,
                  correct: true,
                },
                {
                  text: "False. You can never find an average speed by averaging speeds.",
                  code: "RAT.SPEED.MEAN",
                },
                {
                  text: `False. It is ${p.v1 + p.v2} km/h.`,
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                },
              ],
              solution: [
                {
                  say: "Average speed = total distance ÷ total time. With equal times, that is the mean of the speeds.",
                },
              ],
            }),
          [
            {
              statement: "Sid walks 6 km in 2 hours. He says his speed is 12 km/h.",
              truth: false,
              right: "False. Speed = distance ÷ time = 6 ÷ 2 = 3 km/h.",
              wrong: [
                ["True. Speed = distance × time.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["True. 6 km in 2 hours is 12 km in one hour."],
              ],
            },
            {
              statement: "A train travels at 80 km/h for 30 minutes. Ann says it goes 40 km.",
              truth: true,
              right: "True. 30 minutes is half an hour, and 80 × 0.5 = 40 km.",
              wrong: [
                ["False. 80 × 30 = 2400 km.", "RAT.UNITS.DIRECTION"],
                ["False. 80 ÷ 30 is about 2.7 km.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
              ],
            },
            {
              claim:
                "Going somewhere at 30 km/h and coming back the same way at 60 km/h gives an average speed of 45 km/h.",
              truth: "never",
              right:
                "Never. The slow way takes twice as long. For 60 km each way: 120 km in 2 + 1 = 3 hours is 40 km/h.",
              wrong: [
                ["Always. Find the mean of the two speeds.", "RAT.SPEED.MEAN"],
                ["Sometimes. Only for short journeys."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.s * p.t;
    if (question.key.depth === 2) return numberAnswer(question) === p.kmh / 3.6;
    return true;
  },
});
