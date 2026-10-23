/**
 * @statement FM-CP-30
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-30: Model simple harmonic motion and damped oscillations with differential equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { piLatex } from "../shared/trig.ts";

export interface Params {
  w: number;
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-30",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.SHM"],

  params(rng) {
    const w = rng.int(2, 6);
    // k < w keeps the damping light: (2k)² < 4w².
    return { w, a: rng.int(2, 9), k: rng.int(1, w - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.w * p.w;
    const shm = A.math(`\\frac{d^2x}{dt^2} = -${n}x`);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A particle moves with ", shm, ", where x is in metres and t in seconds."],
          ask: "Find the exact period of the motion, in seconds.",
          answer: A.exact(piLatex(360 / p.w)),
          wrong: [
            {
              code: "CALC.SHM",
              value: A.exact(`\\frac{2\\pi}{${n}}`),
              feedback: `ω² = ${n}, so ω = ${p.w} and the period is 2π/ω.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\omega = \\sqrt{${n}} = ${p.w}, \\quad T = \\frac{2\\pi}{${p.w}} = ${piLatex(360 / p.w)}`,
            },
          ],
        });
      case 2: {
        const v = p.w * p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A particle moves with ", shm, " and amplitude ", A.math(`${p.a}`), " m."],
              ask: "Find its maximum speed, in m/s.",
            },
            {
              question: [
                "A spring makes a mass move with ",
                shm,
                ". The amplitude is ",
                A.math(`${p.a}`),
                " m.",
              ],
              ask: "What is the greatest speed of the mass, in m/s?",
            },
          ],
          answer: A.number(v, { units: "m/s" }),
          wrong: wrongs(v, [
            {
              code: "CALC.SHM",
              value: A.number(n * p.a, { units: "m/s" }),
              feedback: `The maximum speed is aω, and ω = √${n} = ${p.w}.`,
            },
          ]),
          solution: [{ say: "", math: `v_{\\max} = a\\omega = ${p.a} \\times ${p.w} = ${v}` }],
        });
      }
      default: {
        const b = 2 * p.k;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Wes says the motion ",
            A.math(`\\ddot{x} + ${b}\\dot{x} + ${n}x = 0`),
            " is heavily damped.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The auxiliary equation m² + ${b}m + ${n} = 0 has discriminant ${b * b} − ${4 * n} < 0, so the roots are complex: light damping, with decaying oscillations.`,
              correct: true,
            },
            { text: "True. Any ẋ term makes the damping heavy.", code: "CALC.SHM" },
            { text: "True. All the coefficients are positive.", code: "CALC.SHM" },
          ],
          solution: [{ say: "Heavy damping needs two real roots: b² > 4n." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === piLatex(360 / p.w);
    if (question.key.depth === 2) return numberAnswer(question) === p.w * p.a;
    return true;
  },
});
