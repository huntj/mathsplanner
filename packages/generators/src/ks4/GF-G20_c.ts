/**
 * @statement GF-G20.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G20.c: Use trigonometry to find an angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { legsTriangle } from "../shared/geo.ts";

interface Params {
  a: number;
  b: number;
  hyp: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const deg = (r: number) => (r * 180) / Math.PI;

export default defineGenerator<Params>({
  id: "GF-G20.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.RATIO"],

  params(rng) {
    const p = { a: rng.int(3, 14), b: rng.int(3, 14), hyp: rng.int(8, 20) };
    if (p.a === p.b || p.a > 2.5 * p.b || p.b > 2.5 * p.a) reject("a clear, not too thin triangle");
    if (p.b >= p.hyp - 1) reject("an opposite side shorter than the hypotenuse");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(deg(Math.atan2(p.b, p.a)));
        return A.standard({
          question: [
            A.figure(
              legsTriangle(p.a, p.b, {
                ab: `${p.a}\\text{ cm}`,
                bc: `${p.b}\\text{ cm}`,
                theta: "\\theta",
              }),
            ),
          ],
          ask: "Find the angle θ, to 1 decimal place.",
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.atan2(p.a, p.b))), { units: "°", accuracy: { dp: 1 } }),
              feedback: "tan θ = opposite ÷ adjacent. The opposite side is across from θ.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\theta = \\tan^{-1}\\left(\\frac{${p.b}}{${p.a}}\\right) = ${v}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const theta = deg(Math.asin(p.b / p.hyp));
        const v = r1(theta);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  legsTriangle(Math.sqrt(p.hyp ** 2 - p.b ** 2), p.b, {
                    bc: `${p.b}\\text{ cm}`,
                    ca: `${p.hyp}\\text{ cm}`,
                    theta: "\\theta",
                  }),
                ),
              ],
              ask: "Find the angle θ, to 1 decimal place.",
            },
            {
              question: [`A ramp is ${p.hyp} m long and rises ${p.b} m.`],
              ask: "Find the angle it makes with the ground, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.acos(p.b / p.hyp))), { units: "°", accuracy: { dp: 1 } }),
              feedback: "You know the opposite side and the hypotenuse, so use sin.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\theta = \\sin^{-1}\\left(\\frac{${p.b}}{${p.hyp}}\\right) = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "In a right-angled triangle, if the two shorter sides are equal, the other two angles are 45°.",
          ],
          truth: "always",
          reasons: [
            {
              text: `Always. tan θ = ${p.a} ÷ ${p.a} = 1, and tan 45° = 1. It is also an isosceles triangle.`,
              correct: true,
            },
            { text: "Sometimes. It depends on how long the sides are.", code: "GEO.TRIG.RATIO" },
            { text: "Never. The angles are 30° and 60°.", code: "GEO.TRIG.RATIO" },
          ],
          solution: [{ say: "Equal sides give equal angles: (180° − 90°) ÷ 2 = 45°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(deg(Math.atan2(p.b, p.a)));
    if (question.key.depth === 2) return numberAnswer(question) === r1(deg(Math.asin(p.b / p.hyp)));
    return true;
  },
});
