/**
 * @statement GH-G20.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-G20.b: Use trigonometry in 3D
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

interface Params {
  l: number;
  w: number;
  h: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const deg = (r: number) => (r * 180) / Math.PI;

export default defineGenerator<Params>({
  id: "GH-G20.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.3D.WRONG-TRIANGLE", "GEO.TRIG.RATIO"],

  params(rng) {
    const p = { l: rng.int(5, 12), w: rng.int(3, 8), h: rng.int(3, 8) };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(deg(Math.atan2(p.h, Math.hypot(p.l, p.w))));
        return A.standard({
          question: ["The diagram shows a cuboid.", A.figure(cuboid(p.l, p.w, p.h))],
          ask: "Find the angle between a space diagonal (corner to opposite corner) and the base, to 1 decimal place.",
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.3D.WRONG-TRIANGLE",
              value: A.number(r1(deg(Math.atan2(p.h, p.l))), { units: "°", accuracy: { dp: 1 } }),
              feedback:
                "The angle with the base is in the triangle made by the height and the base diagonal, not a base edge.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tan\\theta = \\frac{${p.h}}{\\sqrt{${p.l}^2 + ${p.w}^2}} \\Rightarrow \\theta = ${v}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(deg(Math.atan2(p.h, p.l)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A cuboid is ${p.l} cm long, ${p.w} cm deep and ${p.h} cm high. A diagonal is drawn across its ${p.l} cm by ${p.h} cm front face.`,
              ],
              ask: "Find the angle this diagonal makes with the bottom edge of the face, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r1(deg(Math.atan2(p.l, p.h))), { units: "°", accuracy: { dp: 1 } }),
              feedback: `The height, ${p.h} cm, is opposite the angle; the ${p.l} cm edge is adjacent.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tan\\theta = \\frac{${p.h}}{${p.l}} \\Rightarrow \\theta = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bea says the angle between a cuboid's space diagonal and its base is the same as the angle between the space diagonal and one of the base edges.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The angle with a plane is measured to the line in the plane directly below the diagonal: the base diagonal, not an edge.",
              correct: true,
            },
            { text: "True. The base edges are in the base.", code: "GEO.3D.WRONG-TRIANGLE" },
            { text: "True. All angles with the base are equal.", code: "GEO.3D.WRONG-TRIANGLE" },
          ],
          solution: [
            {
              say: "Drop a perpendicular from the top of the diagonal to find the right triangle.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(deg(Math.atan2(p.h, Math.hypot(p.l, p.w))));
    if (question.key.depth === 2) return numberAnswer(question) === r1(deg(Math.atan2(p.h, p.l)));
    return true;
  },
});
