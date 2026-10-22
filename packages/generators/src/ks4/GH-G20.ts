/**
 * @statement GH-G20
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G20: Use Pythagoras and trigonometry in 3D and in general triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

interface Params {
  l: number;
  w: number;
  h: number;
  claimTrue: boolean;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const deg = (r: number) => (r * 180) / Math.PI;

/** The cuboid with its space diagonal AG drawn and named. */
function box(p: Params): GeometrySpec {
  const c = cuboid(p.l, p.w, p.h);
  return {
    ...c,
    segments: [...(c.segments ?? []), { from: "A", to: "G" }],
    pointLabels: ["A", "G"],
    description: `${c.description ?? ""} The diagonal AG joins opposite corners.`,
  };
}

export default defineGenerator<Params>({
  id: "GH-G20",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.3D.WRONG-TRIANGLE", "GEO.PYTHAG.NO-SQUARE"],

  params(rng) {
    const l = rng.int(5, 12);
    const w = rng.int(3, 8);
    const h = rng.int(3, 8);
    if (l === w || w === h || l === h) reject("three different edges");
    return { l, w, h, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const base = Math.sqrt(p.l * p.l + p.w * p.w);
    const diag = Math.sqrt(p.l * p.l + p.w * p.w + p.h * p.h);
    switch (depth) {
      case 1: {
        const ans = r1(diag);
        return A.standard({
          question: ["The diagram shows a cuboid.", A.figure(box(p))],
          ask: "Work out the length of the diagonal AG. Give your answer to 1 decimal place.",
          answer: A.number(ans, { units: "cm", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "GEO.3D.WRONG-TRIANGLE",
              value: A.number(r1(Math.sqrt(p.l * p.l + p.h * p.h)), {
                units: "cm",
                accuracy: { dp: 1 },
              }),
              feedback:
                "That is the diagonal of the front face. AG also goes back through the depth.",
            },
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(p.l + p.w + p.h, { units: "cm", accuracy: { dp: 1 } }),
              feedback: "Square the edges, add, then square root.",
            },
          ]),
          solution: [
            {
              say: `AG² = ${p.l}² + ${p.w}² + ${p.h}² = ${p.l * p.l + p.w * p.w + p.h * p.h}, so AG = ${ans} cm.`,
            },
          ],
        });
      }
      case 2: {
        const ans = r1(deg(Math.atan(p.h / base)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The diagram shows a cuboid.", A.figure(box(p))],
              ask: "Work out the angle between the diagonal AG and the base of the cuboid. Give your answer to 1 decimal place.",
            },
          ],
          answer: A.number(ans, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "GEO.3D.WRONG-TRIANGLE",
              value: A.number(r1(deg(Math.atan(p.h / p.l))), { units: "°", accuracy: { dp: 1 } }),
              feedback:
                "The triangle you need has the base diagonal (not the length) as its adjacent side.",
            },
          ]),
          solution: [
            { say: `Base diagonal = √(${p.l}² + ${p.w}²) = √${p.l * p.l + p.w * p.w}.` },
            { say: `tan θ = ${p.h} ÷ √${p.l * p.l + p.w * p.w}, so θ = ${ans}°.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? `A box measures ${p.l} cm by ${p.w} cm by ${p.h} cm. Ana says the longest rod that fits inside is √(${p.l}² + ${p.w}² + ${p.h}²) cm long.`
            : `A box measures ${p.l} cm by ${p.w} cm by ${p.h} cm. Ana says the longest rod that fits inside is the diagonal of its largest face.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. The longest straight line inside a cuboid is its space diagonal, found by Pythagoras in 3D.",
                  correct: true,
                },
                {
                  text: `False. It is ${p.l} cm, the longest edge.`,
                  code: "GEO.3D.WRONG-TRIANGLE",
                },
                { text: `False. It is ${p.l + p.w + p.h} cm.`, code: "GEO.PYTHAG.NO-SQUARE" },
              ]
            : [
                {
                  text: `False. The space diagonal is longer: ${r1(diag)} cm compared with ${r1(Math.max(base, Math.sqrt(p.l * p.l + p.h * p.h)))} cm.`,
                  correct: true,
                },
                {
                  text: "True. Nothing can be longer than a face diagonal.",
                  code: "GEO.3D.WRONG-TRIANGLE",
                },
                { text: "True. The longest edge is the limit." },
              ],
          solution: [
            {
              say: "The space diagonal is the hypotenuse of a triangle whose other sides are a face diagonal and an edge.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(Math.sqrt(p.l * p.l + p.w * p.w + p.h * p.h));
    return true;
  },
});
