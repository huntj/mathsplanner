/**
 * @statement AL-M7.3b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.3b: Use suvat formulae in two dimensions with vectors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ijk, mag } from "../shared/vec.ts";

interface Params {
  u: [number, number];
  a: [number, number];
  t: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-M7.3b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.SUVAT.VECTOR"],

  params(rng) {
    const u: [number, number] = [rng.int(-5, 6), rng.int(-5, 6)];
    const a: [number, number] = [rng.int(-3, 3), rng.int(-3, 3)];
    if (u.includes(0) || a.includes(0)) reject("all components non-zero");
    return { u, a, t: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "A particle has initial velocity ",
      A.math(`(${ijk(p.u)})\\text{ m s}^{-1}`),
      " and constant acceleration ",
      A.math(`(${ijk(p.a)})\\text{ m s}^{-2}`),
      ".",
    ];
    switch (depth) {
      case 1: {
        const v = [p.u[0] + p.a[0] * p.t, p.u[1] + p.a[1] * p.t];
        const s = r2(mag(v));
        return A.standard({
          question: intro,
          ask: `Find its speed after ${p.t} s, to 2 decimal places.`,
          answer: A.number(s, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(s, [
            {
              code: "MECH.SUVAT.VECTOR",
              value: A.number(r2(mag(p.u) + mag(p.a) * p.t), { units: "m/s", accuracy: { dp: 2 } }),
              feedback: "Find the velocity vector v = u + at first, then its magnitude.",
            },
          ]),
          solution: [{ say: "", math: `\\mathbf{v} = ${ijk(v)},\\ |\\mathbf{v}| = ${s}` }],
        });
      }
      case 2: {
        const r = [
          p.u[0] * p.t + 0.5 * p.a[0] * p.t * p.t,
          p.u[1] * p.t + 0.5 * p.a[1] * p.t * p.t,
        ];
        const d = r2(mag(r));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [...intro, " It starts at the origin."],
              ask: `How far is it from the origin after ${p.t} s? Give your answer to 2 decimal places.`,
            },
          ],
          answer: A.number(d, { units: "m", accuracy: { dp: 2 } }),
          wrong: wrongs(d, [
            {
              code: "MECH.SUVAT.VECTOR",
              value: A.number(r2(mag(p.u) * p.t), { units: "m", accuracy: { dp: 2 } }),
              feedback: "Include the acceleration: r = ut + ½at².",
            },
          ]),
          solution: [{ say: "", math: `\\mathbf{r} = ${ijk(r)},\\ |\\mathbf{r}| = ${d}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [...intro, " Nat says its speed after t seconds is |u| + |a|t."],
          truth: false,
          reasons: [
            {
              text: "False. Velocities add as vectors: v = u + at, and its magnitude is not |u| + |a|t unless u and a point the same way.",
              correct: true,
            },
            { text: "True. Speeds add up.", code: "MECH.SUVAT.VECTOR" },
            {
              text: "True. The magnitude of a sum is the sum of the magnitudes.",
              code: "MECH.SUVAT.VECTOR",
            },
          ],
          solution: [{ say: "Work with vectors, then take the magnitude at the end." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2(mag([p.u[0] + p.a[0] * p.t, p.u[1] + p.a[1] * p.t]));
    return true;
  },
});
