/**
 * @statement AL-M8.4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-M8.4.a: Apply Newton's third law to connected particles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Car and trailer masses in kg, driving force in N; no resistance. */
  car: number;
  trailer: number;
  F: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M8.4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CONNECTED", "MECH.F-MA"],

  params(rng) {
    return { car: rng.int(8, 15) * 100, trailer: rng.int(2, 8) * 100, F: rng.int(10, 40) * 100 };
  },

  build(p, depth, rng): QuestionDraft {
    const a = r2(p.F / (p.car + p.trailer));
    const T = r2((p.trailer * p.F) / (p.car + p.trailer));
    const intro = `A car of mass ${p.car} kg tows a trailer of mass ${p.trailer} kg along a straight horizontal road with a light rigid towbar. The driving force is ${p.F} N and there is no resistance.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Find the acceleration, to 2 decimal places, in m s⁻².",
          answer: A.number(a, { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "MECH.CONNECTED",
              value: A.number(r2(p.F / p.car), { units: "m/s²", accuracy: { dp: 2 } }),
              feedback:
                "The force accelerates the car and the trailer together: use their total mass.",
            },
          ]),
          solution: [{ say: "", math: `a = \\frac{${p.F}}{${p.car} + ${p.trailer}} = ${a}` }],
        });
      case 2:
        return A.standard({
          question: intro,
          ask: "Find the tension in the towbar, to 2 decimal places, in newtons.",
          answer: A.number(T, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(T, [
            {
              code: "MECH.F-MA",
              value: A.number(p.F, { units: "N" }),
              feedback:
                "Apply F = ma to the trailer alone: the only horizontal force on it is the tension.",
            },
          ]),
          solution: [{ say: "", math: `T = ${p.trailer} \\times ${a} \\approx ${T}\\text{ N}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Tom says the towbar pulls the car backwards with a smaller force than it pulls the trailer forwards, because the car is heavier.`,
          truth: false,
          reasons: [
            {
              text: "False. By Newton's third law the towbar exerts equal and opposite forces: T forwards on the trailer and T backwards on the car.",
              correct: true,
            },
            { text: "True. Heavier objects feel a smaller tension.", code: "MECH.CONNECTED" },
            {
              text: "True. The tension is shared in proportion to the masses.",
              code: "MECH.CONNECTED",
            },
          ],
          solution: [{ say: `The tension is ${T} N in both directions.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.F / (p.car + p.trailer));
    if (question.key.depth === 2)
      return numberAnswer(question) === r2((p.trailer * p.F) / (p.car + p.trailer));
    return true;
  },
});
