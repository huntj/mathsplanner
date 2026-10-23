/**
 * @statement Y9-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-GEO-01.b: Use trigonometry to find a missing side
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { rightTriangle } from "../shared/geo.ts";

interface Params {
  angle: number;
  adj: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "Y9-GEO-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.RATIO"],

  params(rng) {
    return { angle: rng.int(25, 60), adj: rng.int(4, 15) };
  },

  build(p, depth, rng): QuestionDraft {
    const hyp = p.adj / Math.cos(rad(p.angle));
    switch (depth) {
      case 1: {
        const v = r1(p.adj * Math.tan(rad(p.angle)));
        return A.standard({
          question: [
            A.figure(
              rightTriangle(p.angle, hyp, {
                ab: `${p.adj}\\text{ cm}`,
                bc: "x",
                theta: `${p.angle}^\\circ`,
              }),
            ),
          ],
          ask: "Find the length x, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(p.adj * Math.sin(rad(p.angle))), { accuracy: { dp: 1 } }),
              feedback: "You know the adjacent side and want the opposite: use tan (TOA).",
            },
          ]),
          solution: [{ say: "", math: `x = ${p.adj} \\tan ${p.angle}^\\circ = ${v} \\text{ cm}` }],
        });
      }
      case 2: {
        const v = r1(hyp);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  rightTriangle(p.angle, hyp, {
                    ab: `${p.adj}\\text{ cm}`,
                    ca: "x",
                    theta: `${p.angle}^\\circ`,
                  }),
                ),
              ],
              ask: "Find the length x, in cm, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(p.adj * Math.cos(rad(p.angle))), { accuracy: { dp: 1 } }),
              feedback: "cos θ = adjacent ÷ hypotenuse, so hypotenuse = adjacent ÷ cos θ.",
            },
          ]),
          solution: [
            { say: "", math: `x = \\frac{${p.adj}}{\\cos ${p.angle}^\\circ} = ${v} \\text{ cm}` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            A.math("\\cos \\theta = \\sin(90^\\circ - \\theta)"),
            " for an angle θ in a right-angled triangle.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. The other acute angle is 90° − θ, and the side adjacent to θ is opposite that angle.",
              correct: true,
            },
            { text: "Never. Sine and cosine are unrelated.", code: "GEO.TRIG.RATIO" },
            { text: "Sometimes. Only at 45°.", code: "GEO.TRIG.RATIO" },
          ],
          solution: [
            {
              say: `For example cos ${p.angle}° = sin ${90 - p.angle}° ≈ ${Math.cos(rad(p.angle)).toFixed(3)}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(p.adj * Math.tan(rad(p.angle)));
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(p.adj / Math.cos(rad(p.angle)));
    return true;
  },
});
