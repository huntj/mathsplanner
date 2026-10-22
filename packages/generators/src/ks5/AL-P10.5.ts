/**
 * @statement AL-P10.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.5: Use vectors to solve problems in pure maths and in context, including forces
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { add, ijk, mag } from "../shared/vec.ts";

interface Params {
  f1: [number, number];
  f2: [number, number];
  r0: [number, number];
  v: [number, number];
  t: number;
  claimTrue: boolean;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-P10.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.MAGNITUDE", "GEO.VECTOR.POSITION"],

  params(rng) {
    const f1: [number, number] = [rng.int(-8, 8), rng.int(-8, 8)];
    const f2: [number, number] = [rng.int(-8, 8), rng.int(-8, 8)];
    if (f1.includes(0) || f2.includes(0) || add(f1, f2).includes(0))
      reject("a resultant with two components");
    return {
      f1,
      f2,
      r0: [rng.int(-5, 5), rng.int(-5, 5)],
      v: [rng.int(-4, 4), rng.int(1, 4)],
      t: rng.int(2, 5),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const R = add(p.f1, p.f2);
        const m = r2(mag(R));
        return A.standard({
          question: [
            "Two forces ",
            A.math(`\\mathbf{F}_1 = (${ijk(p.f1)})\\text{ N}`),
            " and ",
            A.math(`\\mathbf{F}_2 = (${ijk(p.f2)})\\text{ N}`),
            " act on a particle.",
          ],
          ask: "Find the magnitude of the resultant force, to 2 decimal places.",
          answer: A.number(m, { units: "N", accuracy: { dp: 2 } }),
          wrong: wrongs(m, [
            {
              code: "GEO.VECTOR.MAGNITUDE",
              value: A.number(r2(mag(p.f1) + mag(p.f2)), { units: "N", accuracy: { dp: 2 } }),
              feedback: "Add the forces as vectors first, then find the magnitude of the sum.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\mathbf{R} = ${ijk(R)},\\ |\\mathbf{R}| = \\sqrt{${R[0]}^2 + ${R[1]}^2} = ${m}`,
            },
          ],
        });
      }
      case 2: {
        const r = add(
          p.r0,
          p.v.map((c) => c * p.t),
        );
        const d = r2(mag(r));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A boat starts at the point with position vector ",
                A.math(`(${ijk(p.r0)})\\text{ km}`),
                " and moves with constant velocity ",
                A.math(`(${ijk(p.v)})\\text{ km h}^{-1}`),
                ".",
              ],
              ask: `How far is it from the origin after ${p.t} hours? Give your answer to 2 decimal places.`,
            },
          ],
          answer: A.number(d, { units: "km", accuracy: { dp: 2 } }),
          wrong: wrongs(d, [
            {
              code: "GEO.VECTOR.POSITION",
              value: A.number(r2(mag(p.v) * p.t), { units: "km", accuracy: { dp: 2 } }),
              feedback:
                "That is how far it has travelled. Its position is r₀ + tv; find that vector's magnitude.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\mathbf{r} = ${ijk(p.r0)} + ${p.t}(${ijk(p.v)}) = ${ijk(r)},\\ |\\mathbf{r}| = ${d}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Three forces act on a particle in equilibrium. Lou says their vector sum is the zero vector."
            : "Three forces act on a particle in equilibrium. Lou says their magnitudes add up to zero.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. In equilibrium the resultant force is zero: F₁ + F₂ + F₃ = 0.",
                  correct: true,
                },
                { text: "False. Only the magnitudes cancel.", code: "GEO.VECTOR.MAGNITUDE" },
                { text: "False. The forces must all be equal." },
              ]
            : [
                {
                  text: "False. Magnitudes are never negative, so they cannot add to zero; it is the vector sum that is zero.",
                  correct: true,
                },
                {
                  text: "True. Equilibrium means nothing is pushing.",
                  code: "GEO.VECTOR.MAGNITUDE",
                },
                {
                  text: "True. The forces cancel, so their sizes cancel.",
                  code: "GEO.VECTOR.MAGNITUDE",
                },
              ],
          solution: [
            {
              say: "Equilibrium: the resultant (vector sum) is zero, so each component sums to zero.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r2(mag(add(p.f1, p.f2)));
    return true;
  },
});
