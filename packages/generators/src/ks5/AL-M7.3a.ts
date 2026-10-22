/**
 * @statement AL-M7.3a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.3a: Use suvat formulae for constant acceleration in one dimension
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  u: number;
  a: number;
  t: number;
  d: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M7.3a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.SUVAT.CHOICE"],

  params(rng) {
    return {
      u: rng.int(2, 15),
      a: rng.pick([0.5, 1.5, 2, 2.5, 3]),
      t: rng.int(3, 12),
      d: rng.pick([2, 4, 5, 8]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r2(p.u + p.a * p.t);
        return A.standard({
          question: `A cyclist has speed ${p.u} m s⁻¹ and accelerates at ${p.a} m s⁻² for ${p.t} s.`,
          ask: "Find her final speed.",
          answer: A.number(v, { units: "m/s" }),
          wrong: wrongs(v, [
            {
              code: "MECH.SUVAT.CHOICE",
              value: A.number(r2(p.a * p.t), { units: "m/s" }),
              feedback: "v = u + at: include the starting speed.",
            },
          ]),
          solution: [{ say: `v = ${p.u} + ${p.a} × ${p.t} = ${v} m s⁻¹.` }],
        });
      }
      case 2: {
        const s = r2((p.u * p.u) / (2 * p.d));
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A car travelling at ${p.u} m s⁻¹ brakes with constant deceleration ${p.d} m s⁻² until it stops.`,
              ask: "Find its stopping distance, to 2 decimal places.",
            },
          ],
          answer: A.number(s, { units: "m", accuracy: { dp: 2 } }),
          wrong: wrongs(s, [
            {
              code: "MECH.SUVAT.CHOICE",
              value: A.number(r2((p.u * p.u) / p.d), { units: "m", accuracy: { dp: 2 } }),
              feedback: "v² = u² + 2as: remember the 2.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `0 = ${p.u}^2 - 2(${p.d})s \\Rightarrow s = \\frac{${p.u * p.u}}{${2 * p.d}} = ${s}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ali says the suvat formulae can be used for a car whose acceleration changes over time.",
          truth: false,
          reasons: [
            {
              text: "False. The suvat formulae assume constant acceleration; for varying acceleration use calculus.",
              correct: true,
            },
            { text: "True. They work for any straight-line motion.", code: "MECH.SUVAT.CHOICE" },
            {
              text: "True. Use the average acceleration and the answers are exact.",
              code: "MECH.SUVAT.CHOICE",
            },
          ],
          solution: [{ say: "Check the model: constant acceleration in a straight line." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.u + p.a * p.t);
    return true;
  },
});
