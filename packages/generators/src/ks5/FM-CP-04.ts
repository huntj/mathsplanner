/**
 * @statement FM-CP-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-04: Represent complex numbers on an Argand diagram; use modulus-argument form; multiply and
// divide in this form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { argument, cx } from "../shared/cplx.ts";

const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 6, 10],
  [7, 24, 25],
] as const;

export interface Params {
  t: number;
  sx: number;
  sy: number;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "FM-CP-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.MAGNITUDE", "CPLX.ARGUMENT"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), sx: rng.pick([1, -1]), sy: rng.pick([1, -1]) };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, m] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
    const re = x * p.sx;
    const im = y * p.sy;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the modulus of ", A.math(`z = ${cx(re, im)}`), "."],
          answer: A.number(m),
          wrong: signedWrongs(m, [
            {
              code: "GEO.VECTOR.MAGNITUDE",
              value: A.number(Math.abs(re) + Math.abs(im)),
              feedback: "|z| = √(x² + y²).",
            },
          ]),
          solution: [{ say: "", math: `|z| = \\sqrt{${re * re} + ${im * im}} = ${m}` }],
        });
      case 2: {
        // Use the second quadrant so the quadrant matters.
        const a = -x;
        const b = y;
        const arg = r3(argument(a, b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the argument of ",
                A.math(`z = ${cx(a, b)}`),
                ", in radians to 3 decimal places, with ",
                A.math("-\\pi < \\arg z \\le \\pi"),
                ".",
              ],
            },
          ],
          answer: A.number(arg, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(arg, [
            {
              code: "CPLX.ARGUMENT",
              value: A.number(r3(Math.atan(b / a)), { accuracy: { dp: 3 } }),
              feedback: "z is in the second quadrant: add π to tan⁻¹(b/a).",
            },
          ]),
          solution: [
            { say: `z is in the second quadrant, so arg z = π − tan⁻¹(${y}/${x}) = ${arg}.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jay says that for complex numbers z and w, ",
            A.math("\\arg(zw) = \\arg z \\times \\arg w"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Multiplying complex numbers multiplies their moduli and adds their arguments: arg(zw) = arg z + arg w (up to a multiple of 2π).",
              correct: true,
            },
            { text: "True. Everything multiplies when you multiply.", code: "CPLX.ARGUMENT" },
            { text: "False. arg(zw) = arg z − arg w.", code: "CPLX.ARGUMENT" },
          ],
          solution: [{ say: "r₁e^(iθ₁) × r₂e^(iθ₂) = r₁r₂e^(i(θ₁ + θ₂))." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (TRIPLES[p.t] ?? TRIPLES[0])[2];
    return true;
  },
});
