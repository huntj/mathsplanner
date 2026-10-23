/**
 * @statement FM-FM2-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM2-01: Model motion in a circle with constant and variable speed, horizontally and vertically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  v: number;
  r: number;
  mu: number;
  R: number;
}

const maxSpeed = (p: Params) => round(Math.sqrt(p.mu * 9.8 * p.R), 2);

export default defineGenerator<Params>({
  id: "FM-FM2-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CIRCULAR"],

  params(rng) {
    return {
      v: rng.int(2, 15),
      r: round(rng.int(5, 50) / 10, 1),
      mu: rng.pick([0.2, 0.3, 0.4, 0.5, 0.6]),
      R: 5 * rng.int(4, 30),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const a = round((p.v * p.v) / p.r, 2);
        return A.standard({
          question: [
            `A particle moves in a horizontal circle of radius ${p.r} m at a constant speed of ${p.v} m/s.`,
          ],
          ask: "Find the magnitude of its acceleration, to 2 decimal places.",
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.CIRCULAR",
              value: A.number(round(p.v / p.r, 2), { units: "m/s²", accuracy: { dp: 2 } }),
              feedback: "The acceleration towards the centre is v²/r.",
            },
          ]),
          solution: [{ say: "", math: `a = \\frac{v^2}{r} = \\frac{${p.v}^2}{${p.r}} = ${a}` }],
        });
      }
      case 2: {
        const v = maxSpeed(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A car drives round a horizontal bend, an arc of a circle of radius ${p.R} m. The coefficient of friction between the tyres and the road is ${p.mu}. Take g = 9.8 m/s².`,
              ],
              ask: "Find the greatest speed at which it can go round without slipping, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.CIRCULAR",
              value: A.number(round(p.mu * 9.8 * p.R, 2), { units: "m/s", accuracy: { dp: 2 } }),
              feedback: "μmg = mv²/r gives v² = μgr: take the square root.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\mu mg = \\frac{mv^2}{r} \\Rightarrow v = \\sqrt{${p.mu} \\times 9.8 \\times ${p.R}} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Gus says a particle moving round a circle at a steady ${p.v} m/s has no acceleration, because its speed does not change.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Its direction keeps changing, so its velocity changes: it accelerates towards the centre at v²/r.",
              correct: true,
            },
            { text: "True. Acceleration is the rate of change of speed.", code: "MECH.CIRCULAR" },
            {
              text: "True. No force is needed to keep it moving in a circle.",
              code: "MECH.CIRCULAR",
            },
          ],
          solution: [{ say: "Velocity is a vector, so a change of direction is an acceleration." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round((p.v * p.v) / p.r, 2);
    if (question.key.depth === 2) return numberAnswer(question) === maxSpeed(p);
    return true;
  },
});
