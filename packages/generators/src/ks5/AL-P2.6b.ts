/**
 * @statement AL-P2.6b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.6b: Simplify rational expressions by factorising, cancelling and algebraic division
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: x³ + bx² + cx + d divided by (x − s). */
  b: number;
  c: number;
  d: number;
  s: number;
  /** Depth 2: (x² − u²)/((x − u)(x + v)) = (x + u)/(x + v). */
  u: number;
  v: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.6b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.FRACTION.CANCEL-TERMS"],

  params(rng) {
    const s = rng.int(-3, 3);
    const u = rng.int(1, 7);
    const v = rng.int(-7, 7);
    const p = { b: rng.int(-6, 6), c: rng.int(-9, 9), d: rng.int(-9, 9), s, u, v };
    const f = (x: number) => x ** 3 + p.b * x * x + p.c * x + p.d;
    if (s === 0 || p.b === 0 || p.c === 0 || f(s) === f(-s) || f(s) === 0)
      reject("a clear, non-zero remainder");
    if (v === 0 || v === u || v === -u) reject("a fraction that simplifies to something new");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (x: number) => x ** 3 + p.b * x * x + p.c * x + p.d;
    switch (depth) {
      case 1: {
        const r = f(p.s);
        return A.standard({
          question: [
            "Find the remainder when ",
            A.math(poly([1, p.b, p.c, p.d])),
            " is divided by ",
            A.math(bracket(-p.s)),
            ".",
          ],
          answer: A.number(r),
          wrong: signedWrongs(r, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(f(-p.s)),
              feedback: `Dividing by (x − a) leaves remainder f(a); here a = ${p.s}.`,
            },
          ]),
          solution: [{ say: `Remainder theorem: f(${p.s}) = ${r}.` }],
        });
      }
      case 2: {
        const top = poly([1, 0, -p.u * p.u]);
        const bottom = poly([1, p.v - p.u, -p.u * p.v]);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Simplify fully ", A.math(`\\frac{${top}}{${bottom}}`), "."] },
            { question: ["Write ", A.math(`\\frac{${top}}{${bottom}}`), " in its simplest form."] },
          ],
          answer: A.exact(`\\frac{${poly([1, p.u])}}{${poly([1, p.v])}}`),
          wrong: [
            {
              code: "ALG.FRACTION.CANCEL-TERMS",
              value: A.exact(frac(p.u, p.v)),
              feedback: "Cancel common factors (whole brackets), not the x² terms.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{(x + ${p.u})(x - ${p.u})}{(x - ${p.u})${bracket(p.v)}} = \\frac{${poly([1, p.u])}}{${poly([1, p.v])}}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ella says the remainder when ",
            A.math(`f(x) = ${poly([1, p.b, p.c, p.d])}`),
            " is divided by ",
            A.math(bracket(-p.s)),
            " is ",
            A.math(`f(${-p.s}) = ${f(-p.s)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Dividing by (x − a) leaves remainder f(a): here f(${p.s}) = ${f(p.s)}.`,
              correct: true,
            },
            { text: "True. Use the number in the bracket.", code: "ALG.QUADRATIC.ROOT-SIGN" },
            { text: "False. The remainder is always 0." },
          ],
          solution: [{ say: `x = ${p.s} makes the divisor zero, so f(${p.s}) is the remainder.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === p.s ** 3 + p.b * p.s * p.s + p.c * p.s + p.d;
    return true;
  },
});
