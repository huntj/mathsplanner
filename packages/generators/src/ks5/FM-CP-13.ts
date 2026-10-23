/**
 * @statement FM-CP-13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-13: Use relationships between roots and coefficients of polynomials up to quartic; form
// equations with transformed roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  r: number[];
}

/** a(x − r1)(x − r2)(x − r3) expanded. */
function cubic(a: number, [r1 = 0, r2 = 0, r3 = 0]: number[]): number[] {
  return [a, -a * (r1 + r2 + r3), a * (r1 * r2 + r1 * r3 + r2 * r3), -a * r1 * r2 * r3];
}

export default defineGenerator<Params>({
  id: "FM-CP-13",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.ROOTS-COEFF"],

  params(rng) {
    const p = { a: rng.int(1, 3), r: [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)] };
    const s = p.r.reduce((x, y) => x + y, 0);
    if (s === 0 || p.r.includes(0)) reject("a non-zero sum of non-zero roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const co = cubic(p.a, p.r);
    const eq = `${poly(co, "x")} = 0`;
    const roots = A.math("\\alpha, \\beta, \\gamma");
    const s = p.r.reduce((x, y) => x + y, 0);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["The equation ", A.math(eq), " has roots ", roots, "."],
          ask: ["Find ", A.math("\\alpha + \\beta + \\gamma"), "."],
          answer: A.number(s),
          wrong: signedWrongs(s, [
            {
              code: "ALG.ROOTS-COEFF",
              value: A.number(-s),
              feedback: "The sum of the roots is −b/a.",
            },
            ...(p.a === 1
              ? []
              : [
                  {
                    code: "ALG.ROOTS-COEFF",
                    value: A.number(-(co[1] ?? 0)),
                    feedback: `Divide by the leading coefficient ${p.a}.`,
                  },
                ]),
          ]),
          solution: [
            {
              say: "",
              math: `\\alpha + \\beta + \\gamma = -\\frac{b}{a} = -\\frac{${co[1]}}{${p.a}} = ${s}`,
            },
          ],
        });
      case 2: {
        const sq = p.r.reduce((x, y) => x + y * y, 0);
        const pairs = (co[2] ?? 0) / p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The equation ", A.math(eq), " has roots ", roots, "."],
              ask: ["Find ", A.math("\\alpha^2 + \\beta^2 + \\gamma^2"), "."],
            },
            {
              question: ["The roots of ", A.math(eq), " are ", roots, "."],
              ask: ["Work out ", A.math("\\alpha^2 + \\beta^2 + \\gamma^2"), "."],
            },
          ],
          answer: A.number(sq),
          wrong: signedWrongs(sq, [
            {
              code: "ALG.ROOTS-COEFF",
              value: A.number(s * s),
              feedback: "(α + β + γ)² also contains 2(αβ + βγ + γα); subtract it.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `(\\alpha + \\beta + \\gamma)^2 - 2(\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha) = ${s}^2 - 2(${pairs}) = ${sq}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says the product of the roots of ",
            A.math(`${poly([p.a + 1, 0, 1, 6], "x")} = 0`),
            " is −6.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The product is −d/a = −6/${p.a + 1}: divide by the leading coefficient.`,
              correct: true,
            },
            { text: "True. The product of the roots of a cubic is −d.", code: "ALG.ROOTS-COEFF" },
            { text: "False. It is +6.", code: "ALG.ROOTS-COEFF" },
          ],
          solution: [{ say: "For ax³ + bx² + cx + d = 0, αβγ = −d/a." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.r.reduce((x, y) => x + y, 0);
    if (question.key.depth === 2)
      return numberAnswer(question) === p.r.reduce((x, y) => x + y * y, 0);
    return true;
  },
});
