/**
 * @statement AL-M8.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.5: Resolve forces in two dimensions, including on inclined planes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  theta: number;
}

const g = 9.8;
const r2 = (x: number) => Math.round(x * 100) / 100;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "AL-M8.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.RESOLVE"],

  params(rng) {
    return { m: rng.int(2, 12), theta: rng.pick([15, 20, 25, 30, 35, 40]) };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `A particle of mass ${p.m} kg is released on a smooth plane inclined at ${p.theta}° to the horizontal. Take g = 9.8 m s⁻².`;
    switch (depth) {
      case 1: {
        const a = r2(g * Math.sin(rad(p.theta)));
        return A.standard({
          question: intro,
          ask: "Find its acceleration down the plane, to 2 decimal places.",
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.RESOLVE",
              value: A.number(r2(g * Math.cos(rad(p.theta))), {
                units: "m/s²",
                accuracy: { dp: 2 },
              }),
              feedback: "The component of the weight down the slope is mg sin θ.",
            },
          ]),
          solution: [{ say: `mg sin θ = ma, so a = 9.8 sin ${p.theta}° = ${a} m s⁻².` }],
        });
      }
      case 2: {
        const R = r2(p.m * g * Math.cos(rad(p.theta)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: "Find the normal reaction on the particle, to 2 decimal places.",
            },
          ],
          answer: A.number(R, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(R, [
            {
              code: "MECH.RESOLVE",
              value: A.number(r2(p.m * g), { units: "N", accuracy: { dp: 2 } }),
              feedback: "Resolve perpendicular to the plane: R = mg cos θ.",
            },
          ]),
          solution: [{ say: `R = ${p.m} × 9.8 × cos ${p.theta}° = ${R} N.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Meg says the normal reaction equals the particle's weight, ${r2(p.m * g)} N.`,
          truth: false,
          reasons: [
            {
              text: "False. Only the component of the weight perpendicular to the plane, mg cos θ, is balanced by the reaction.",
              correct: true,
            },
            { text: "True. The reaction always balances the weight.", code: "MECH.RESOLVE" },
            { text: "True. The plane supports the whole particle.", code: "MECH.RESOLVE" },
          ],
          solution: [
            {
              say: "On a slope, resolve the weight into mg sin θ along the plane and mg cos θ perpendicular to it.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(g * Math.sin(rad(p.theta)));
    return true;
  },
});
