/**
 * @statement FM-FM1-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM1-05: Solve oblique elastic collisions, including with a smooth plane
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";
import { deg, rad } from "../shared/trig.ts";

interface Params {
  u: number;
  theta: number;
  e: number;
}

const speed = (p: Params) =>
  round(Math.hypot(p.u * Math.cos(rad(p.theta)), p.e * p.u * Math.sin(rad(p.theta))), 2);
const angle = (p: Params) => round(deg(Math.atan(p.e * Math.tan(rad(p.theta)))), 1);

export default defineGenerator<Params>({
  id: "FM-FM1-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.RESTITUTION"],

  params(rng) {
    return {
      u: rng.int(4, 20),
      theta: rng.pick([20, 30, 35, 40, 45, 50, 60]),
      e: rng.pick([0.25, 0.4, 0.5, 0.6, 0.75]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `A smooth sphere hits a smooth vertical wall at ${p.u} m/s, moving at ${p.theta}° to the wall. The coefficient of restitution is ${p.e}.`;
    switch (depth) {
      case 1: {
        const v = speed(p);
        return A.standard({
          question: [intro],
          ask: "Find its speed after the impact, to 2 decimal places.",
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.RESTITUTION",
              value: A.number(round(p.e * p.u, 2), { units: "m/s", accuracy: { dp: 2 } }),
              feedback:
                "Only the component perpendicular to the wall is multiplied by e; the parallel component is unchanged.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\text{parallel: } ${p.u}\\cos ${p.theta}^\\circ, \\quad \\text{perpendicular: } ${p.e} \\times ${p.u}\\sin ${p.theta}^\\circ`,
            },
            { say: `Speed = ${v} m/s.` },
          ],
        });
      }
      case 2: {
        const a = angle(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [intro],
              ask: "Find the angle between its new direction and the wall, to 1 decimal place.",
            },
          ],
          answer: A.number(a, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.RESTITUTION",
              value: A.number(p.theta, { units: "°", accuracy: { dp: 1 } }),
              feedback:
                "The perpendicular component shrinks by e, so the sphere leaves at a smaller angle: tan α = e tan θ.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tan\\alpha = ${p.e}\\tan ${p.theta}^\\circ \\Rightarrow \\alpha = ${a}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Flo says that when a sphere bounces off a smooth wall, its velocity component parallel to the wall is multiplied by e.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A smooth wall exerts no force along itself, so the parallel component is unchanged. Only the perpendicular component is reversed and multiplied by e.",
              correct: true,
            },
            { text: "True. Restitution affects the whole velocity.", code: "MECH.RESTITUTION" },
            { text: "True. Both components lose energy equally.", code: "MECH.RESTITUTION" },
          ],
          solution: [{ say: "The impulse from a smooth wall is perpendicular to the wall." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === speed(p);
    if (question.key.depth === 2) return numberAnswer(question) === angle(p);
    return true;
  },
});
