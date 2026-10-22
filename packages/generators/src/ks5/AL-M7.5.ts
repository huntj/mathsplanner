/**
 * @statement AL-M7.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.5: Model projectile motion under constant gravity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  U: number;
  theta: number;
}

const g = 9.8;
const r2 = (x: number) => Math.round(x * 100) / 100;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "AL-M7.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.PROJECTILE"],

  params(rng) {
    return { U: rng.int(10, 30), theta: rng.pick([20, 30, 35, 40, 50, 60]) };
  },

  build(p, depth, rng): QuestionDraft {
    const uy = p.U * Math.sin(rad(p.theta));
    const intro = `A ball is projected from level ground with speed ${p.U} m s⁻¹ at ${p.theta}° above the horizontal. Take g = 9.8 m s⁻² and ignore air resistance.`;
    switch (depth) {
      case 1: {
        const T = r2((2 * uy) / g);
        return A.standard({
          question: intro,
          ask: "Find the time of flight, to 2 decimal places.",
          answer: A.number(T, { units: "s", accuracy: { dp: 2 } }),
          wrong: wrongs(T, [
            {
              code: "MECH.PROJECTILE",
              value: A.number(r2((2 * p.U) / g), { units: "s", accuracy: { dp: 2 } }),
              feedback: `Use the vertical component of the velocity, ${p.U} sin ${p.theta}°.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `0 = ${p.U}\\sin ${p.theta}^\\circ\\,t - 4.9t^2 \\Rightarrow t = \\frac{2 \\times ${p.U}\\sin ${p.theta}^\\circ}{9.8} = ${T}`,
            },
          ],
        });
      }
      case 2: {
        const H = r2((uy * uy) / (2 * g));
        return A.variedForm({
          rng,
          forms: [
            { question: intro, ask: "Find the greatest height reached, to 2 decimal places." },
          ],
          answer: A.number(H, { units: "m", accuracy: { dp: 2 } }),
          wrong: wrongs(H, [
            {
              code: "MECH.PROJECTILE",
              value: A.number(r2((p.U * p.U) / (2 * g)), { units: "m", accuracy: { dp: 2 } }),
              feedback:
                "At the top the vertical velocity is 0: use the vertical component in v² = u² + 2as.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `0 = (${p.U}\\sin ${p.theta}^\\circ)^2 - 2(9.8)h \\Rightarrow h = ${H}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Dev says the horizontal speed of the ball decreases during the flight.`,
          truth: false,
          reasons: [
            {
              text: `False. With no air resistance, gravity only acts vertically, so the horizontal speed stays ${p.U} cos ${p.theta}°.`,
              correct: true,
            },
            {
              text: "True. Gravity slows the ball down in every direction.",
              code: "MECH.PROJECTILE",
            },
            { text: "True. Everything slows down eventually.", code: "MECH.PROJECTILE" },
          ],
          solution: [
            {
              say: "Treat horizontal and vertical motion separately: a = 0 horizontally, a = −g vertically.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2((2 * p.U * Math.sin(rad(p.theta))) / g);
    return true;
  },
});
