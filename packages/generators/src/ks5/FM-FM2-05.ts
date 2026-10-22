/**
 * @statement FM-FM2-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM2-05: Solve further kinematics problems with variable acceleration using calculus
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  c: number;
  T: number;
  k: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "FM-FM2-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CALCULUS", "MECH.VARIABLE-FORCE"],

  params(rng) {
    const p = { c: rng.int(1, 9), T: rng.int(2, 6), k: rng.int(2, 6), d: rng.int(2, 9) };
    if (3 * p.T * p.T - p.c * p.T === 6 * p.T - p.c)
      reject("a velocity that differs from the acceleration");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 3 * p.T * p.T - p.c * p.T;
        return A.standard({
          question: [
            `A particle starts from rest. Its acceleration at time t seconds is (6t − ${p.c}) m/s².`,
          ],
          ask: `Find its velocity when t = ${p.T}.`,
          answer: A.number(v, { units: "m/s" }),
          wrong: signedWrongs(v, [
            {
              code: "MECH.CALCULUS",
              value: A.number(6 * p.T - p.c, { units: "m/s" }),
              feedback: "That is the acceleration at that time. Integrate to find the velocity.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `v = \\int_0^{${p.T}} (6t - ${p.c})\\,dt = 3(${p.T})^2 - ${p.c}(${p.T}) = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const a = p.k * p.k * p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A particle moves along a line so that its velocity is v = ${p.k}x m/s when its displacement is x m.`,
              ],
              ask: `Find its acceleration when x = ${p.d}.`,
            },
          ],
          answer: A.number(a, { units: "m/s²" }),
          wrong: wrongs(a, [
            {
              code: "MECH.VARIABLE-FORCE",
              value: A.number(p.k, { units: "m/s²" }),
              feedback: "dv/dx is not the acceleration. Use a = v dv/dx.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `a = v\\frac{dv}{dx} = ${p.k}x \\times ${p.k} = ${p.k * p.k}x = ${a}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kay says that if v = ${p.k}t² m/s, the distance travelled in the first ${p.T} seconds is ${p.k * p.T * p.T} × ${p.T} m.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Distance = speed × time only for constant speed. Here, integrate: ∫₀^${p.T} ${p.k}t² dt = ${p.k * p.T ** 3}/3 m.`,
              correct: true,
            },
            { text: "True. Distance is always speed times time.", code: "MECH.CALCULUS" },
            { text: "True. Use the final speed for the whole journey.", code: "MECH.CALCULUS" },
          ],
          solution: [{ say: "Displacement is the area under the velocity–time graph." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 3 * p.T * p.T - p.c * p.T;
    if (question.key.depth === 2) return numberAnswer(question) === p.k * p.k * p.d;
    return true;
  },
});
