/**
 * @statement AL-M7.4b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.4b: Extend calculus kinematics to two dimensions with vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mag } from "../shared/vec.ts";

interface Params {
  k: number;
  c: number;
  T: number;
  ax: number;
  ay: number;
  u: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M7.4b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CALCULUS"],

  params(rng) {
    return {
      k: rng.int(1, 3),
      c: rng.int(2, 6),
      T: rng.int(2, 5),
      ax: rng.int(1, 4),
      ay: -rng.int(1, 4),
      u: rng.int(1, 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // r = k t² i + c t j ⇒ v = 2k t i + c j
        const v = [2 * p.k * p.T, p.c];
        const r = [p.k * p.T * p.T, p.c * p.T];
        const s = r2(mag(v));
        return A.standard({
          question: [
            "A particle has position vector ",
            A.math(`\\mathbf{r} = ${p.k === 1 ? "" : p.k}t^2\\mathbf{i} + ${p.c}t\\mathbf{j}`),
            " metres at time t seconds.",
          ],
          ask: `Find its speed when t = ${p.T}, to 2 decimal places.`,
          answer: A.number(s, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(s, [
            {
              code: "MECH.CALCULUS",
              value: A.number(r2(mag(r)), { units: "m/s", accuracy: { dp: 2 } }),
              feedback: "Differentiate r to get the velocity, then find its magnitude.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\mathbf{v} = ${2 * p.k}t\\mathbf{i} + ${p.c}\\mathbf{j} = ${v[0]}\\mathbf{i} + ${v[1]}\\mathbf{j},\\ |\\mathbf{v}| = ${s}`,
            },
          ],
        });
      }
      case 2: {
        const v = [p.u + p.ax * p.T, p.ay * p.T];
        const s = r2(mag(v));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A particle has constant acceleration ",
                A.math(
                  `(${p.ax}\\mathbf{i} ${p.ay < 0 ? "-" : "+"} ${Math.abs(p.ay)}\\mathbf{j})\\text{ m s}^{-2}`,
                ),
                " and initial velocity ",
                A.math(`${p.u}\\mathbf{i}\\text{ m s}^{-1}`),
                ".",
              ],
              ask: `Find its speed when t = ${p.T}, to 2 decimal places.`,
            },
          ],
          answer: A.number(s, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(s, [
            {
              code: "MECH.CALCULUS",
              value: A.number(r2(mag([p.ax * p.T, p.ay * p.T])), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "Integrating a gives v = at + c; the constant is the initial velocity.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\mathbf{v} = ${p.u}\\mathbf{i} + t(${p.ax}\\mathbf{i} ${p.ay < 0 ? "-" : "+"} ${Math.abs(p.ay)}\\mathbf{j}),\\ |\\mathbf{v}(${p.T})| = ${s}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ola says that to find a particle's velocity from its acceleration vector, you differentiate the acceleration.",
          truth: false,
          reasons: [
            {
              text: "False. Integrate acceleration to get velocity (adding the initial velocity); differentiate velocity to get acceleration.",
              correct: true,
            },
            { text: "True. You always differentiate in kinematics.", code: "MECH.CALCULUS" },
            {
              text: "True. Vectors are differentiated, scalars are integrated.",
              code: "MECH.CALCULUS",
            },
          ],
          solution: [
            { say: "r → differentiate → v → differentiate → a; and integrate to go back." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(mag([2 * p.k * p.T, p.c]));
    return true;
  },
});
