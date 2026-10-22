/**
 * @statement AL-M7.4a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.4a: Use calculus in kinematics for motion in a straight line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  T: number;
}

export default defineGenerator<Params>({
  id: "AL-M7.4a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CALCULUS"],

  params(rng) {
    return { a: rng.int(1, 4), b: rng.int(2, 9), T: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // s = t³ − b t², v = 3t² − 2b t
        const s = p.T ** 3 - p.b * p.T * p.T;
        const v = 3 * p.T * p.T - 2 * p.b * p.T;
        return A.standard({
          question: [
            "A particle moves in a straight line with displacement ",
            A.math(`s = t^3 - ${p.b}t^2`),
            " metres at time t seconds.",
          ],
          ask: `Find its velocity when t = ${p.T}.`,
          answer: A.number(v, { units: "m/s" }),
          wrong: signedWrongs(v, [
            {
              code: "MECH.CALCULUS",
              value: A.number(s, { units: "m/s" }),
              feedback: "Velocity is the rate of change of displacement: differentiate s.",
            },
          ]),
          solution: [{ say: "", math: `v = \\frac{ds}{dt} = 3t^2 - ${2 * p.b}t = ${v}` }],
        });
      }
      case 2: {
        // v = 3a t² + 2b t, s(0) = 0 ⇒ s = a t³ + b t²
        const s = p.a * p.T ** 3 + p.b * p.T * p.T;
        const acc = 6 * p.a * p.T + 2 * p.b;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A particle starts at the origin and moves in a straight line with velocity ",
                A.math(`v = ${3 * p.a}t^2 + ${2 * p.b}t`),
                " m s⁻¹.",
              ],
              ask: `Find its displacement when t = ${p.T}.`,
            },
          ],
          answer: A.number(s, { units: "m" }),
          wrong: signedWrongs(s, [
            {
              code: "MECH.CALCULUS",
              value: A.number(acc, { units: "m" }),
              feedback:
                "To go from velocity to displacement, integrate (and use s = 0 when t = 0).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `s = \\int v\\,dt = ${p.a === 1 ? "" : p.a}t^3 + ${p.b}t^2 + c,\\ c = 0 \\Rightarrow s = ${s}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Dan says that when a particle's velocity is zero, its acceleration must also be zero.",
          truth: false,
          reasons: [
            {
              text: "False. A ball thrown upwards has v = 0 at the top, but its acceleration is still g downwards.",
              correct: true,
            },
            { text: "True. Acceleration is velocity divided by time.", code: "MECH.CALCULUS" },
            { text: "True. If it is not moving, nothing is changing.", code: "MECH.CALCULUS" },
          ],
          solution: [
            { say: "Acceleration is the rate of change of velocity, not the velocity itself." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 3 * p.T * p.T - 2 * p.b * p.T;
    return true;
  },
});
