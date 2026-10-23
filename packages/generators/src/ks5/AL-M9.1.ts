/**
 * @statement AL-M9.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M9.1: Use moments for rigid bodies in equilibrium, e.g. beams and ladders
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  L: number;
  W: number;
  P: number;
  d: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;

export default defineGenerator<Params>({
  id: "AL-M9.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.MOMENTS"],

  params(rng) {
    const L = 2 * rng.int(2, 5);
    const d = rng.int(1, L - 1);
    const p = { L, W: 10 * rng.int(5, 20), P: 10 * rng.int(30, 80), d };
    if (d * 2 === L) reject("a load away from the middle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const RB = r1((p.W * (p.L / 2) + p.P * p.d) / p.L);
    const RA = r1(p.W + p.P - RB);
    const intro = `A uniform beam AB of length ${p.L} m and weight ${p.W} N rests horizontally on supports at A and B. A person of weight ${p.P} N stands ${p.d} m from A.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Find the reaction at B, to 1 decimal place.",
          answer: A.number(RB, { units: "N", accuracy: { dp: 1 } }),
          wrong: wrongs(RB, [
            {
              code: "MECH.MOMENTS",
              value: A.number(r1((p.W + p.P) / 2), { units: "N", accuracy: { dp: 1 } }),
              feedback:
                "The reactions are only equal if the loads are central: take moments about A.",
            },
          ]),
          solution: [
            {
              say: `Moments about A: R_B × ${p.L} = ${p.W} × ${p.L / 2} + ${p.P} × ${p.d}, so R_B = ${RB} N.`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [{ question: intro, ask: "Find the reaction at A, to 1 decimal place." }],
          answer: A.number(RA, { units: "N", accuracy: { dp: 1 } }),
          wrong: wrongs(RA, [
            {
              code: "MECH.MOMENTS",
              value: A.number(RB, { units: "N", accuracy: { dp: 1 } }),
              feedback: "That is the reaction at B. Resolve vertically: R_A + R_B = total weight.",
            },
          ]),
          solution: [
            { say: `R_B = ${RB} N by moments about A; then R_A = ${p.W + p.P} − ${RB} = ${RA} N.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Zoe says the moment of the person's weight about A is ${p.P} × ${p.L} N m.`,
          truth: false,
          reasons: [
            {
              text: `False. A moment is force × perpendicular distance from the pivot: ${p.P} × ${p.d} = ${p.P * p.d} N m.`,
              correct: true,
            },
            { text: "True. Multiply by the length of the beam.", code: "MECH.MOMENTS" },
            { text: "True. Moments use the full length for every force.", code: "MECH.MOMENTS" },
          ],
          solution: [
            { say: "Use each force's own distance from the point you take moments about." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1((p.W * (p.L / 2) + p.P * p.d) / p.L);
    return true;
  },
});
