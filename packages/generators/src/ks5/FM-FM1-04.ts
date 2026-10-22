/**
 * @statement FM-FM1-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM1-04: Solve direct elastic collisions with Newton's law of restitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  u: number;
  e: number;
  m1: number;
  m2: number;
}

const vB = (p: Params) => round((p.m1 * p.u * (1 + p.e)) / (p.m1 + p.m2), 2);

export default defineGenerator<Params>({
  id: "FM-FM1-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.RESTITUTION"],

  params(rng) {
    return {
      u: rng.int(3, 15),
      e: rng.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]),
      m1: rng.int(1, 6),
      m2: rng.int(1, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round(p.e * p.u, 2);
        return A.standard({
          question: [
            `A ball hits horizontal ground at ${p.u} m/s. The coefficient of restitution is ${p.e}.`,
          ],
          ask: "Find the speed at which it rebounds.",
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.RESTITUTION",
              value: A.number(round(p.u / p.e, 2), { units: "m/s", accuracy: { dp: 2 } }),
              feedback: "Speed of separation = e × speed of approach: multiply by e.",
            },
          ]),
          solution: [{ say: "", math: `${p.e} \\times ${p.u} = ${v}` }],
        });
      }
      case 2: {
        const v = vB(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Sphere A (${p.m1} kg) moving at ${p.u} m/s hits sphere B (${p.m2} kg), which is at rest, directly. The coefficient of restitution is ${p.e}.`,
              ],
              ask: "Find the speed of B after the collision, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.RESTITUTION",
              value: A.number(round(p.e * p.u, 2), { units: "m/s", accuracy: { dp: 2 } }),
              feedback:
                "e × approach speed gives the separation speed v_B − v_A, not v_B alone. Use momentum too.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.m1}v_A + ${p.m2}v_B = ${p.m1 * p.u}, \\quad v_B - v_A = ${round(p.e * p.u, 2)}`,
            },
            { say: `Solving, v_B = ${v} m/s.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says that a coefficient of restitution of 1 means the spheres stick together.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. e = 1 is a perfectly elastic collision, with no loss of kinetic energy. Spheres that stick together have e = 0.",
              correct: true,
            },
            { text: "True. e = 1 means they move as one.", code: "MECH.RESTITUTION" },
            { text: "True. 1 is the strongest bond.", code: "MECH.RESTITUTION" },
          ],
          solution: [
            { say: "Speed of separation = e × speed of approach; e = 0 gives no separation." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round(p.e * p.u, 2);
    if (question.key.depth === 2) return numberAnswer(question) === vB(p);
    return true;
  },
});
