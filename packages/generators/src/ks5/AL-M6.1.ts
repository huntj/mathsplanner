/**
 * @statement AL-M6.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M6.1: Use SI units and derived units for velocity, acceleration, force, weight and moment
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  kmh: number;
  m: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M6.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.UNITS", "MECH.WEIGHT-MASS"],

  params(rng) {
    return { kmh: 9 * rng.int(4, 14), m: rng.int(2, 40) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r2(p.kmh / 3.6);
        return A.standard({
          question: `A car travels at ${p.kmh} km/h.`,
          ask: "Write this speed in m s⁻¹.",
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.UNITS",
              value: A.number(r2(p.kmh * 3.6), { units: "m/s", accuracy: { dp: 2 } }),
              feedback: "1 km/h = 1000 m ÷ 3600 s, so divide by 3.6.",
            },
          ]),
          solution: [{ say: `${p.kmh} × 1000 ÷ 3600 = ${v} m s⁻¹.` }],
        });
      }
      case 2: {
        const w = r2(9.8 * p.m);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A box has mass ${p.m} kg. Take g = 9.8 m s⁻².`,
              ask: "Find its weight, in newtons.",
            },
          ],
          answer: A.number(w, { units: "N" }),
          wrong: wrongs(w, [
            {
              code: "MECH.WEIGHT-MASS",
              value: A.number(p.m, { units: "N" }),
              feedback: "Weight is a force: W = mg.",
            },
          ]),
          solution: [{ say: `W = ${p.m} × 9.8 = ${w} N.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Tom says the newton is the SI unit of mass.",
          truth: false,
          reasons: [
            {
              text: "False. Mass is measured in kilograms; the newton (kg m s⁻²) is the unit of force, including weight.",
              correct: true,
            },
            {
              text: "True. Scales show weight in newtons, so mass is in newtons.",
              code: "MECH.WEIGHT-MASS",
            },
            { text: "True. 1 N = 1 kg.", code: "MECH.UNITS" },
          ],
          solution: [{ say: "1 N is the force that gives 1 kg an acceleration of 1 m s⁻²." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.kmh / 3.6);
    return true;
  },
});
