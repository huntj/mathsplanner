/**
 * @statement AL-M8.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.6: Use F ≤ μR and limiting friction in statics and dynamics
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  m: number;
  mu: number;
  P: number;
}

const g = 9.8;
const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M8.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.FRICTION"],

  params(rng) {
    const p = { m: rng.int(2, 12), mu: rng.pick([0.2, 0.25, 0.3, 0.4, 0.5]), P: rng.int(10, 80) };
    if (p.P <= p.mu * p.m * g + 2) reject("a pull that overcomes friction");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const Fmax = r2(p.mu * p.m * g);
    switch (depth) {
      case 1:
        return A.standard({
          question: `A box of mass ${p.m} kg rests on a rough horizontal floor. The coefficient of friction is ${p.mu}. Take g = 9.8 m s⁻².`,
          ask: "Find the maximum friction force.",
          answer: A.number(Fmax, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(Fmax, [
            {
              code: "MECH.FRICTION",
              value: A.number(r2(p.mu * p.m), { units: "N", accuracy: { dp: 2 } }),
              feedback: "F = μR, and here R = mg.",
            },
          ]),
          solution: [
            {
              say: `R = ${p.m} × 9.8 = ${r2(p.m * g)} N; F = ${p.mu} × ${r2(p.m * g)} = ${Fmax} N.`,
            },
          ],
        });
      case 2: {
        const a = r2((p.P - p.mu * p.m * g) / p.m);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A box of mass ${p.m} kg on a rough horizontal floor is pulled by a horizontal force of ${p.P} N. The coefficient of friction is ${p.mu}. Take g = 9.8 m s⁻².`,
              ask: "Find its acceleration, to 2 decimal places.",
            },
          ],
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.FRICTION",
              value: A.number(r2(p.P / p.m), { units: "m/s²", accuracy: { dp: 2 } }),
              feedback: "Subtract the friction μR from the pull first.",
            },
          ]),
          solution: [{ say: `${p.P} − ${Fmax} = ${p.m}a, so a = ${a} m s⁻².` }],
        });
      }
      default: {
        const small = Math.max(1, Math.floor(Fmax / 2));
        return A.trueOrFalseWhy({
          rng,
          statement: `A box of mass ${p.m} kg rests on a rough floor with μ = ${p.mu}. A horizontal force of ${small} N is applied and the box does not move. Luke says the friction force is ${Fmax} N.`,
          truth: false,
          reasons: [
            {
              text: `False. Friction only reaches μR = ${Fmax} N when limiting. Here the box is in equilibrium, so friction is ${small} N.`,
              correct: true,
            },
            { text: "True. Friction always equals μR.", code: "MECH.FRICTION" },
            { text: "True. The friction must be bigger than the pull.", code: "MECH.FRICTION" },
          ],
          solution: [
            { say: "F ≤ μR: friction matches the applied force until it reaches its limit." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.mu * p.m * g);
    return true;
  },
});
