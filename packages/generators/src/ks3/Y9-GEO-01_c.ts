/**
 * @statement Y9-GEO-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-GEO-01.c: Use trigonometry to find a missing angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { legsTriangle } from "../shared/geo.ts";

interface Params {
  opp: number;
  adj: number;
  hyp: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const deg = (r: number) => (r * 180) / Math.PI;

export default defineGenerator<Params>({
  id: "Y9-GEO-01.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.RATIO"],

  params(rng) {
    const p = { opp: rng.int(3, 10), adj: rng.int(4, 12), hyp: rng.int(8, 18) };
    if (p.opp >= p.hyp - 1 || p.adj >= p.hyp - 1 || p.opp === p.adj)
      reject("sides shorter than the hypotenuse");
    if (p.hyp > 2.5 * p.opp || p.hyp > 2.5 * p.adj) reject("a triangle that is not too thin");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(deg(Math.asin(p.opp / p.hyp)));
        const adj = Math.sqrt(p.hyp ** 2 - p.opp ** 2);
        return A.standard({
          question: [
            A.figure(
              legsTriangle(adj, p.opp, {
                bc: `${p.opp}\\text{ cm}`,
                ca: `${p.hyp}\\text{ cm}`,
                theta: "\\theta",
              }),
            ),
          ],
          ask: "Find the angle θ, to 1 decimal place.",
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.acos(p.opp / p.hyp))), {
                units: "°",
                accuracy: { dp: 1 },
              }),
              feedback: "Opposite and hypotenuse: use sin (SOH).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\theta = \\sin^{-1}\\left(\\frac{${p.opp}}{${p.hyp}}\\right) = ${v}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(deg(Math.acos(p.adj / p.hyp)));
        const opp = Math.sqrt(p.hyp ** 2 - p.adj ** 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  legsTriangle(p.adj, opp, {
                    ab: `${p.adj}\\text{ cm}`,
                    ca: `${p.hyp}\\text{ cm}`,
                    theta: "\\theta",
                  }),
                ),
              ],
              ask: "Find the angle θ, to 1 decimal place.",
            },
            {
              question: [
                `A ${p.hyp} m ladder leans against a wall. Its foot is ${p.adj} m from the wall.`,
              ],
              ask: "Find the angle between the ladder and the ground, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.asin(p.adj / p.hyp))), {
                units: "°",
                accuracy: { dp: 1 },
              }),
              feedback: "Adjacent and hypotenuse: use cos (CAH).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\theta = \\cos^{-1}\\left(\\frac{${p.adj}}{${p.hyp}}\\right) = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says that if the opposite side of a right-angled triangle doubles (with the adjacent side the same), the angle doubles too.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. tan θ doubles, but θ does not: tan⁻¹(${p.opp}/${p.adj}) ≈ ${r1(deg(Math.atan(p.opp / p.adj)))}°, while tan⁻¹(${2 * p.opp}/${p.adj}) ≈ ${r1(deg(Math.atan((2 * p.opp) / p.adj)))}°.`,
              correct: true,
            },
            { text: "True. Angles and sides are in proportion.", code: "GEO.TRIG.RATIO" },
            { text: "True. The angle is opposite ÷ adjacent.", code: "GEO.TRIG.RATIO" },
          ],
          solution: [{ say: "The angle grows more slowly than the side." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(deg(Math.asin(p.opp / p.hyp)));
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(deg(Math.acos(p.adj / p.hyp)));
    return true;
  },
});
