/**
 * @statement FM-FM2-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM2-04: Use Newton's laws with forces depending on time, displacement or velocity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  k: number;
  m: number;
  T: number;
  u: number;
  d: number;
}

const speedAt = (p: Params) => round(Math.sqrt(p.u * p.u - (p.k * p.d * p.d) / p.m), 2);

export default defineGenerator<Params>({
  id: "FM-FM2-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.VARIABLE-FORCE"],

  params(rng) {
    const p = {
      k: rng.int(2, 12),
      m: rng.int(1, 6),
      T: rng.int(2, 6),
      u: rng.int(5, 15),
      d: round(rng.int(5, 30) / 10, 1),
    };
    if (p.u * p.u - (2 * p.k * p.d * p.d) / p.m <= 1)
      reject("a particle that is still moving, even with the slip");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round((p.k * p.T * p.T) / (2 * p.m), 2);
        return A.standard({
          question: [
            `A particle of mass ${p.m} kg starts from rest. At time t seconds, the only force on it is ${p.k}t N, in its direction of motion.`,
          ],
          ask: `Find its speed when t = ${p.T}, to 2 decimal places.`,
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.VARIABLE-FORCE",
              value: A.number(round((p.k * p.T * p.T) / p.m, 2), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "The force varies, so integrate a = kt/m with respect to t: v = kt²/2m.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `v = \\int_0^{${p.T}} \\frac{${p.k}t}{${p.m}}\\,dt = \\frac{${p.k} \\times ${p.T}^2}{2 \\times ${p.m}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = speedAt(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A particle of mass ${p.m} kg moves along the x-axis under a force of −${p.k}x N. It passes through the origin with speed ${p.u} m/s.`,
              ],
              ask: `Find its speed when x = ${p.d}, to 2 decimal places.`,
            },
          ],
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.VARIABLE-FORCE",
              value: A.number(round(Math.sqrt(p.u * p.u - (2 * p.k * p.d * p.d) / p.m), 2), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "Integrating v dv/dx = −kx/m gives ½v² − ½u² = −kx²/2m: the halves cancel.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `v\\frac{dv}{dx} = -\\frac{${p.k}x}{${p.m}} \\Rightarrow v^2 = ${p.u}^2 - \\frac{${p.k}}{${p.m}}x^2 \\Rightarrow v = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jon says that when a force depends on displacement x, you should write a = dv/dt and integrate with respect to t.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. If F depends on x, write a = v dv/dx, so you can separate the variables and integrate with respect to x.",
              correct: true,
            },
            {
              text: "True. Acceleration is always dv/dt, so integrate with respect to t.",
              code: "MECH.VARIABLE-FORCE",
            },
            {
              text: "True. Treat the force as constant and use suvat.",
              code: "MECH.VARIABLE-FORCE",
            },
          ],
          solution: [{ say: "dv/dt = (dv/dx)(dx/dt) = v dv/dx by the chain rule." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === round((p.k * p.T * p.T) / (2 * p.m), 2);
    if (question.key.depth === 2) return numberAnswer(question) === speedAt(p);
    return true;
  },
});
