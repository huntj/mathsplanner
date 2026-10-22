/**
 * @statement FM-FM1-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM1-01: Use momentum and impulse, including in two dimensions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  m: number;
  u: number;
  v: number;
  m1: number;
  m2: number;
  u1: number;
  u2: number;
}

const joint = (p: Params) => round((p.m1 * p.u1 - p.m2 * p.u2) / (p.m1 + p.m2), 2);

export default defineGenerator<Params>({
  id: "FM-FM1-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.MOMENTUM"],

  params(rng) {
    const p = {
      m: round(rng.int(1, 8) / 10, 1),
      u: rng.int(4, 15),
      v: rng.int(2, 12),
      m1: rng.int(2, 8),
      m2: rng.int(2, 8),
      u1: rng.int(2, 9),
      u2: rng.int(1, 6),
    };
    if (p.u === p.v || p.m1 * p.u1 === p.m2 * p.u2) reject("different speeds and a moving pair");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round(p.m * (p.u + p.v), 2);
        return A.standard({
          question: [
            `A ball of mass ${p.m} kg hits a wall at ${p.u} m/s and rebounds along the same line at ${p.v} m/s.`,
          ],
          ask: "Find the magnitude of the impulse on the ball, in N s.",
          answer: A.number(v, { units: "N s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.MOMENTUM",
              value: A.number(round(p.m * Math.abs(p.u - p.v), 2), {
                units: "N s",
                accuracy: { dp: 2 },
              }),
              feedback:
                "The velocity reverses: taking away from the wall as positive, the change is v − (−u) = u + v.",
            },
          ]),
          solution: [{ say: "", math: `I = ${p.m}(${p.v} - (-${p.u})) = ${v}` }],
        });
      }
      case 2: {
        const v = joint(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Particle A (${p.m1} kg) moving at ${p.u1} m/s collides directly with particle B (${p.m2} kg) moving at ${p.u2} m/s in the opposite direction. They coalesce.`,
              ],
              ask: "Find their velocity after the collision, in m/s, in A's original direction, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "MECH.MOMENTUM",
              value: A.number(round((p.m1 * p.u1 + p.m2 * p.u2) / (p.m1 + p.m2), 2), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "B moves the other way, so its momentum is negative.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.m1}(${p.u1}) + ${p.m2}(-${p.u2}) = ${p.m1 + p.m2}v \\Rightarrow v = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bo says that because momentum is conserved in a collision, kinetic energy must be conserved too.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Momentum is always conserved in a collision with no external impulse, but kinetic energy is usually lost (to heat and sound) unless the collision is perfectly elastic.",
              correct: true,
            },
            { text: "True. Energy and momentum are the same thing.", code: "MECH.MOMENTUM" },
            { text: "True. Nothing is lost when bodies collide.", code: "MECH.MOMENTUM" },
          ],
          solution: [{ say: "When particles coalesce, kinetic energy is always lost." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round(p.m * (p.u + p.v), 2);
    if (question.key.depth === 2) return numberAnswer(question) === joint(p);
    return true;
  },
});
