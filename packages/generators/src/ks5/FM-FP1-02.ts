/**
 * @statement FM-FP1-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-02: Work with conic sections in Cartesian and parametric form: parabola, ellipse, hyperbola,
// rectangular hyperbola; tangents and normals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

/** Ellipses x²/a² + y²/b² = 1 with a rational eccentricity. */
const ELLIPSES = [
  [5, 4],
  [5, 3],
  [13, 12],
  [13, 5],
  [10, 6],
  [10, 8],
  [17, 15],
] as const;

export interface Params {
  a: number;
  e: number;
  h: number;
  k: number;
}

const ellipse = (i: number) => ELLIPSES[i] ?? ELLIPSES[0];
const ecc = (i: number) => {
  const [a, b] = ellipse(i);
  return toLatex(frac(Math.round(Math.sqrt(a * a - b * b)), a));
};

export default defineGenerator<Params>({
  id: "FM-FP1-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CONIC"],

  params(rng) {
    let h = rng.int(2, 6);
    let k = rng.int(2, 6);
    while (h === k) k = rng.int(2, 6);
    if (h < k) [h, k] = [k, h];
    return { a: rng.int(1, 6), e: rng.int(0, ELLIPSES.length - 1), h, k };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find the x-coordinate of the focus of the parabola ",
            A.math(`y^2 = ${4 * p.a}x`),
            ".",
          ],
          answer: A.number(p.a),
          wrong: wrongs(p.a, [
            {
              code: "GEO.CONIC",
              value: A.number(4 * p.a),
              feedback: `Compare with y² = 4ax: here 4a = ${4 * p.a}, so a = ${p.a} and the focus is (a, 0).`,
            },
          ]),
          solution: [{ say: `4a = ${4 * p.a}, so a = ${p.a}: the focus is (${p.a}, 0).` }],
        });
      case 2: {
        const [a, b] = ellipse(p.e);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the eccentricity of the ellipse ",
                A.math(`\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1`),
                ".",
              ],
            },
          ],
          answer: A.exact(ecc(p.e)),
          wrong: [
            {
              code: "GEO.CONIC",
              value: A.exact(toLatex(frac(b, a))),
              feedback: "Use b² = a²(1 − e²), so e = √(1 − b²/a²).",
            },
          ],
          solution: [
            {
              say: "",
              math: `e^2 = 1 - \\frac{${b * b}}{${a * a}} = \\frac{${a * a - b * b}}{${a * a}}, \\quad e = ${ecc(p.e)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bea says the asymptotes of ",
            A.math(`\\frac{x^2}{${p.h * p.h}} - \\frac{y^2}{${p.k * p.k}} = 1`),
            " are ",
            A.math(`y = \\pm\\frac{${p.h}}{${p.k}}x`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. For x²/a² − y²/b² = 1 the asymptotes are y = ±(b/a)x, so here y = ±(${p.k}/${p.h})x.`,
              correct: true,
            },
            { text: "True. The asymptotes are y = ±(a/b)x.", code: "GEO.CONIC" },
            { text: "False. A hyperbola has no asymptotes.", code: "GEO.CONIC" },
          ],
          solution: [
            { say: `For large x, y²/${p.k * p.k} ≈ x²/${p.h * p.h}, so y ≈ ±(${p.k}/${p.h})x.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a;
    if (question.key.depth === 2) return exactAnswer(question) === ecc(p.e);
    return true;
  },
});
