/**
 * @statement AL-M8.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M8.4: Apply Newton's third law to equilibrium and connected particles, including pulleys
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m1: number;
  m2: number;
}

const g = 9.8;
const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M8.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CONNECTED"],

  params(rng) {
    return { m1: rng.int(2, 8), m2: rng.int(1, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const a = (p.m2 * g) / (p.m1 + p.m2);
    const intro = `A block of mass ${p.m1} kg on a smooth horizontal table is joined by a light inextensible string over a smooth pulley to a hanging mass of ${p.m2} kg. Take g = 9.8 m s⁻².`;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Find the acceleration of the system, to 2 decimal places.",
          answer: A.number(r2(a), { units: "m/s²", accuracy: { dp: 2 } }),
          wrong: wrongs(r2(a), [
            {
              code: "MECH.CONNECTED",
              value: A.number(g, { units: "m/s²", accuracy: { dp: 2 } }),
              feedback: `The hanging weight accelerates both masses: a = ${p.m2}g ÷ (${p.m1} + ${p.m2}).`,
            },
          ]),
          solution: [
            { say: `Whole system: ${p.m2} × 9.8 = (${p.m1} + ${p.m2})a, so a = ${r2(a)} m s⁻².` },
          ],
        });
      case 2: {
        const T = r2(p.m1 * a);
        return A.variedForm({
          rng,
          forms: [{ question: intro, ask: "Find the tension in the string, to 2 decimal places." }],
          answer: A.number(T, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(T, [
            {
              code: "MECH.CONNECTED",
              value: A.number(r2(p.m2 * g), { units: "N", accuracy: { dp: 2 } }),
              feedback:
                "The hanging mass accelerates downwards, so the tension is less than its weight.",
            },
          ]),
          solution: [{ say: `For the block: T = ${p.m1}a = ${T} N.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Kai says the tension in the string equals the weight of the hanging mass, ${r2(p.m2 * g)} N.`,
          truth: false,
          reasons: [
            {
              text: `False. The hanging mass accelerates downwards, so its weight is bigger than the tension: T = ${r2(p.m1 * a)} N.`,
              correct: true,
            },
            { text: "True. The string just passes on the weight.", code: "MECH.CONNECTED" },
            { text: "True. Newton's third law says they are equal.", code: "MECH.CONNECTED" },
          ],
          solution: [
            {
              say: "The tension equals the hanging weight only when the system is in equilibrium.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2((p.m2 * g) / (p.m1 + p.m2));
    return true;
  },
});
