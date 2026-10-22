/**
 * @statement GH-G23
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G23: Use Area = ½ab sin C
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Sides a = CB and b = CA with angle C between them. */
  a: number;
  b: number;
  angleC: number;
  claimTrue: boolean;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** The angle at B, rounded to a whole degree, for the triangle with C at the origin. */
function angleB(p: Params): number {
  const A_: [number, number] = [p.b * Math.cos(rad(p.angleC)), p.b * Math.sin(rad(p.angleC))];
  return Math.round(deg(Math.atan2(A_[1], p.a - A_[0])));
}

function tri(p: Params, sideA: string, showB: boolean): GeometrySpec {
  const A_: [number, number] = [p.b * Math.cos(rad(p.angleC)), p.b * Math.sin(rad(p.angleC))];
  return {
    type: "geometry",
    points: { C: [0, 0], B: [p.a, 0], A: A_ },
    polygons: [{ vertices: ["C", "B", "A"] }],
    segments: [
      { from: "C", to: "B", label: sideA },
      { from: "C", to: "A", label: `${p.b}\\text{ cm}` },
    ],
    angles: [
      { vertex: "C", from: "B", to: "A", label: `${p.angleC}^\\circ`, value: p.angleC },
      ...(showB
        ? [{ vertex: "B", from: "A", to: "C", label: `${angleB(p)}^\\circ`, value: angleB(p) }]
        : []),
    ],
    pointLabels: true,
    description: "A triangle ABC with two sides and the angle between them labelled.",
  };
}

export default defineGenerator<Params>({
  id: "GH-G23",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.AREA-SINE.INCLUDED", "MEA.AREA.TRIANGLE-HALF"],

  params(rng) {
    const a = rng.int(6, 14);
    const b = rng.int(5, 12);
    const angleC = rng.int(35, 120);
    const p = { a, b, angleC, claimTrue: rng.bool() };
    if (a === b || Math.abs(angleB(p) - angleC) < 5 || angleB(p) < 20)
      reject("a clear second angle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const area = 0.5 * p.a * p.b * Math.sin(rad(p.angleC));
    switch (depth) {
      case 1: {
        const ans = r1(area);
        return A.standard({
          question: [
            "Work out the area of triangle ABC.",
            A.figure(tri(p, `${p.a}\\text{ cm}`, true)),
          ],
          ask: "Give your answer to 1 decimal place.",
          answer: A.number(ans, { units: "cm²", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "GEO.AREA-SINE.INCLUDED",
              value: A.number(r1(0.5 * p.a * p.b * Math.sin(rad(angleB(p)))), {
                units: "cm²",
                accuracy: { dp: 1 },
              }),
              feedback: "Use the angle between the two sides you know: angle C.",
            },
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(r1(2 * area), { units: "cm²", accuracy: { dp: 1 } }),
              feedback: "Area = ½ab sin C: remember the half.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tfrac{1}{2} \\times ${p.a} \\times ${p.b} \\times \\sin ${p.angleC}^\\circ = ${ans}\\text{ cm}^2`,
            },
          ],
        });
      }
      case 2: {
        const given = r1(area);
        const ans = r1((2 * given) / (p.b * Math.sin(rad(p.angleC))));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`Triangle ABC has an area of ${given} cm².`, A.figure(tri(p, "x", false))],
              ask: "Work out the length x, to 1 decimal place.",
            },
          ],
          answer: A.number(ans, { units: "cm", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(r1(given / (p.b * Math.sin(rad(p.angleC)))), {
                units: "cm",
                accuracy: { dp: 1 },
              }),
              feedback: "Area = ½ × x × b × sin C, so x = 2 × area ÷ (b sin C).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${given} = \\tfrac{1}{2} \\times x \\times ${p.b} \\times \\sin ${p.angleC}^\\circ \\Rightarrow x = ${ans}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Ivy says a triangle with sides 8 cm and 5 cm and an angle of 30° between them has an area of 10 cm²."
            : "Ivy says Area = ½ab sin C only works when C is a right angle.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: "True. ½ × 8 × 5 × sin 30° = 20 × 0.5 = 10.", correct: true },
                { text: "False. It is 20 cm²: ½ × 8 × 5.", code: "GEO.AREA-SINE.INCLUDED" },
                { text: "False. It is 40 cm².", code: "MEA.AREA.TRIANGLE-HALF" },
              ]
            : [
                {
                  text: "False. It works for any triangle, as long as C is the angle between sides a and b. When C = 90°, sin C = 1 and it becomes ½ × base × height.",
                  correct: true,
                },
                { text: "True. Otherwise use ½ × base × height.", code: "GEO.AREA-SINE.INCLUDED" },
                { text: "True. sin C is only defined for right angles." },
              ],
          solution: [{ say: "Area = ½ab sin C uses two sides and the angle between them." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(0.5 * p.a * p.b * Math.sin(rad(p.angleC)));
    return true;
  },
});
