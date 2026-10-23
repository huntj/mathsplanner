/**
 * @statement GF-G17.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G17.b: Find perimeters and areas of composite shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lShape } from "../shared/mea.ts";

interface Params {
  W: number;
  H: number;
  a: number;
  b: number;
  l: number;
  w: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G17.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "MEA.PERIMETER.MISSING-SIDES",
    "GEO.CIRCLE.RADIUS-DIAMETER",
    "MEA.AREA.SAME-PERIMETER",
  ],

  params(rng) {
    const p = {
      W: rng.int(6, 12),
      H: rng.int(5, 10),
      a: rng.int(2, 5),
      b: rng.int(2, 4),
      l: rng.int(6, 14),
      w: rng.int(2, 6) * 2,
    };
    if (p.a >= p.W - 1 || p.b >= p.H - 1) reject("a clear L-shape");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 2 * (p.W + p.H);
        const shown = p.W + p.H + (p.H - p.b) + (p.W - p.a);
        return A.standard({
          question: [A.figure(lShape(p.W, p.H, p.a, p.b, [0, 1, 4, 5]))],
          ask: "Find the perimeter of the shape, in cm.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(shown),
              feedback: `Two sides are not labelled: work them out (${p.a} cm and ${p.b} cm) and include them.`,
            },
          ]),
          solution: [
            {
              say: "The missing sides are found from the others: ",
              math: `${p.W} + ${p.H - p.b} + ${p.a} + ${p.b} + ${p.W - p.a} + ${p.H} = ${v} \\text{ cm}`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(p.l * p.w + (Math.PI * (p.w / 2) ** 2) / 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A shape is made from a rectangle ${p.l} cm by ${p.w} cm with a semicircle on one of its ${p.w} cm sides.`,
              ],
              ask: "Find the area of the shape, in cm², to 1 decimal place.",
            },
            {
              question: [
                `A window is a rectangle ${p.w} m wide and ${p.l} m tall, with a semicircle on top.`,
              ],
              ask: "Find the area of glass, in m², to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(p.l * p.w + (Math.PI * p.w ** 2) / 2), { accuracy: { dp: 1 } }),
              feedback: `The semicircle's radius is half of ${p.w}, which is ${p.w / 2}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.l} \\times ${p.w} + \\frac{1}{2} \\pi \\times ${p.w / 2}^2 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Two shapes with the same area have the same perimeter."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. A 4 by 4 square and a 2 by 8 rectangle both have area 16, but perimeters 16 and 20.",
              correct: true,
            },
            {
              text: "Always. Area and perimeter both measure size.",
              code: "MEA.AREA.SAME-PERIMETER",
            },
            {
              text: "Never. Different shapes always have different perimeters.",
              code: "MEA.AREA.SAME-PERIMETER",
            },
          ],
          solution: [{ say: "Area and perimeter measure different things." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 * (p.W + p.H);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(p.l * p.w + (Math.PI * (p.w / 2) ** 2) / 2);
    return true;
  },
});
