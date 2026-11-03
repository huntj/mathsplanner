/**
 * @statement GF-R11.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R11.a: Use speed, distance and time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  s: number;
  t: number;
  m: number;
  d: number;
  v1: number;
  v2: number;
}

export default defineGenerator<Params>({
  id: "GF-R11.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT", "MEA.TIME.DECIMAL", "RAT.SPEED.MEAN"],

  params(rng) {
    const p = {
      s: rng.int(3, 16) * 5,
      t: rng.pick([1.5, 2, 2.5, 3, 3.5, 4]),
      m: rng.pick([15, 20, 30, 40, 45]),
      d: rng.int(2, 30),
      v1: rng.int(2, 6) * 10,
      v2: rng.int(2, 6) * 10,
    };
    if (((p.d * 60) / p.m) % 1 !== 0) reject("a whole-number speed");
    if (p.v1 === p.v2) reject("two different speeds");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const dist = p.s * p.t;
        return A.standard({
          question: [`A cyclist rides ${dist} km at an average speed of ${p.s} km/h.`],
          ask: "How many hours does the ride take?",
          answer: A.number(p.t),
          wrong: wrongs(p.t, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(dist * p.s),
              feedback: "Time = distance ÷ speed.",
            },
          ]),
          solution: [{ say: "", math: `${dist} \\div ${p.s} = ${p.t} \\text{ hours}` }],
        });
      }
      case 2: {
        const v = (p.d * 60) / p.m;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A train travels ${p.d} km in ${p.m} minutes.`],
              ask: "Find its average speed in km/h.",
            },
            {
              question: [`Jo drives ${p.d} km to work. It takes her ${p.m} minutes.`],
              ask: "What is her average speed in km/h?",
            },
          ],
          answer: A.number(v, { units: "km/h" }),
          wrong: wrongs(v, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(Math.round((p.d / (p.m / 100)) * 100) / 100, { units: "km/h" }),
              feedback: `${p.m} minutes is ${p.m}/60 of an hour, not 0.${p.m} hours.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.m} \\text{ min} = ${p.m / 60} \\text{ h}, \\; ${p.d} \\div ${p.m / 60} = ${v} \\text{ km/h}`,
            },
          ],
        });
      }
      default: {
        const mean = (p.v1 + p.v2) / 2;
        const real = Math.round(((2 * p.v1 * p.v2) / (p.v1 + p.v2)) * 10) / 10;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Lou drives to a town at ${p.v1} km/h and back along the same road at ${p.v2} km/h. She says her average speed is ${mean} km/h.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. She spends longer on the slower leg, so average speed = total distance ÷ total time ≈ ${real} km/h.`,
                  correct: true,
                },
                {
                  text: "True. The average is the mean of the two speeds.",
                  code: "RAT.SPEED.MEAN",
                },
                {
                  text: "True. Both legs are the same distance, so they count equally.",
                  code: "RAT.SPEED.MEAN",
                },
              ],
              solution: [
                { say: `Try a 120 km road: the times are ${120 / p.v1} h and ${120 / p.v2} h.` },
              ],
            }),
          [
            {
              statement: "A runner covers 10 km in 50 minutes. Kai says her speed is 12 km/h.",
              truth: true,
              right: "True. 50 minutes is 5/6 hour, and 10 ÷ 5/6 = 12.",
              wrong: [
                ["False. It is 0.2 km/h.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["False. 10 ÷ 0.5 = 20 km/h.", "MEA.TIME.DECIMAL"],
              ],
            },
            {
              claim: "Average speed is total distance divided by total time.",
              truth: "always",
              right: "Always. That is its definition.",
              wrong: [
                ["Never. It is the mean of the speeds.", "RAT.SPEED.MEAN"],
                ["Sometimes. Only on one road."],
              ],
            },
            {
              statement: "A bus goes 90 km in 1 hour 30 minutes. Ola says its speed is 69.2 km/h.",
              truth: false,
              right: "False. 1 hour 30 minutes is 1.5 hours: 90 ÷ 1.5 = 60 km/h.",
              wrong: [
                ["True. 90 ÷ 1.3 ≈ 69.2.", "MEA.TIME.DECIMAL"],
                ["True. Divide by the time as written.", "MEA.TIME.DECIMAL"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.t;
    if (question.key.depth === 2) return numberAnswer(question) === (p.d * 60) / p.m;
    return true;
  },
});
