/**
 * @statement AL-M8.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.3: Model weight and motion under gravity, with g as constant
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  a: number;
  h: number;
}

const g = 9.8;
const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M8.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.WEIGHT-MASS", "MECH.SUVAT.CHOICE"],

  params(rng) {
    return { m: 10 * rng.int(4, 9), a: rng.pick([0.5, 1, 1.2, 1.5, 2]), h: rng.int(5, 40) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const R = r2(p.m * (g + p.a));
        return A.standard({
          question: `A person of mass ${p.m} kg stands in a lift that accelerates upwards at ${p.a} m s⁻². Take g = 9.8 m s⁻².`,
          ask: "Find the normal reaction from the floor on the person.",
          answer: A.number(R, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(R, [
            {
              code: "MECH.WEIGHT-MASS",
              value: A.number(r2(p.m * g), { units: "N", accuracy: { dp: 2 } }),
              feedback: "That is just the weight. The lift accelerates, so R − mg = ma.",
            },
          ]),
          solution: [{ say: `R − ${p.m} × 9.8 = ${p.m} × ${p.a}, so R = ${R} N.` }],
        });
      }
      case 2: {
        const t = r2(Math.sqrt((2 * p.h) / g));
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A stone is dropped from rest from a height of ${p.h} m. Take g = 9.8 m s⁻² and ignore air resistance.`,
              ask: "Find the time it takes to reach the ground, to 2 decimal places.",
            },
          ],
          answer: A.number(t, { units: "s", accuracy: { dp: 2 } }),
          wrong: wrongs(t, [
            {
              code: "MECH.SUVAT.CHOICE",
              value: A.number(r2(Math.sqrt(p.h / g)), { units: "s", accuracy: { dp: 2 } }),
              feedback: "s = ½gt², so t = √(2s/g).",
            },
          ]),
          solution: [{ say: "", math: `${p.h} = \\tfrac{1}{2}(9.8)t^2 \\Rightarrow t = ${t}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Bea says that, with no air resistance, a 5 kg ball falls faster than a 1 kg ball dropped from the same height.",
          truth: false,
          reasons: [
            {
              text: "False. Both accelerate at g: the bigger weight is matched by the bigger mass, since a = mg/m = g.",
              correct: true,
            },
            { text: "True. Heavier things fall faster.", code: "MECH.WEIGHT-MASS" },
            {
              text: "True. The heavier ball has a bigger force on it, so it accelerates more.",
              code: "MECH.WEIGHT-MASS",
            },
          ],
          solution: [{ say: "Under gravity alone every object has acceleration g." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(p.m * (g + p.a));
    return true;
  },
});
