/**
 * @statement GF-G20.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G20.b: Use trigonometry to find a length
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { rightTriangle } from "../shared/geo.ts";

interface Params {
  angle: number;
  hyp: number;
  opp: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "GF-G20.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.RATIO"],

  params(rng) {
    return { angle: rng.int(25, 65), hyp: rng.int(6, 20), opp: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(p.hyp * Math.cos(rad(p.angle)));
        return A.standard({
          question: [
            A.figure(
              rightTriangle(p.angle, p.hyp, {
                ca: `${p.hyp}\\text{ cm}`,
                ab: "x",
                theta: `${p.angle}^\\circ`,
              }),
            ),
          ],
          ask: "Find the length x, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(p.hyp * Math.sin(rad(p.angle))), { accuracy: { dp: 1 } }),
              feedback:
                "x is next to the angle (adjacent), so use cos: adjacent = hypotenuse × cos θ.",
            },
          ]),
          solution: [{ say: "", math: `x = ${p.hyp} \\cos ${p.angle}^\\circ = ${v} \\text{ cm}` }],
        });
      }
      case 2: {
        const hyp = p.opp / Math.sin(rad(p.angle));
        const v = r1(hyp);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  rightTriangle(p.angle, hyp, {
                    bc: `${p.opp}\\text{ cm}`,
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
              value: A.number(r1(p.opp * Math.sin(rad(p.angle))), { accuracy: { dp: 1 } }),
              feedback: "sin θ = opposite ÷ hypotenuse, so hypotenuse = opposite ÷ sin θ.",
            },
          ]),
          solution: [
            { say: "", math: `x = \\frac{${p.opp}}{\\sin ${p.angle}^\\circ} = ${v} \\text{ cm}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Nia says that in a right-angled triangle, the sine of an angle can be bigger than 1.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. sin θ = opposite ÷ hypotenuse, and the hypotenuse is the longest side, so the answer is less than 1.",
              correct: true,
            },
            { text: "True. It is a bigger number for bigger angles.", code: "GEO.TRIG.RATIO" },
            { text: "True. It is adjacent ÷ opposite, which can be big.", code: "GEO.TRIG.RATIO" },
          ],
          solution: [
            { say: `For example sin ${p.angle}° ≈ ${Math.sin(rad(p.angle)).toFixed(3)}.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(p.hyp * Math.cos(rad(p.angle)));
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(p.opp / Math.sin(rad(p.angle)));
    return true;
  },
});
