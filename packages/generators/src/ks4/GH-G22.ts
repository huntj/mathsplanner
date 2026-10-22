/**
 * @statement GH-G22
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G22: Apply the sine rule and cosine rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Cosine rule: sides b = AC and c = AB with angle A between them. */
  b: number;
  c: number;
  angleA: number;
  /** Sine rule: angles A and B, and side a = BC. */
  sa: number;
  sb: number;
  side: number;
  claimTrue: boolean;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

/** Triangle ABC with A at the origin and B on the x-axis. */
function tri(
  b: number,
  c: number,
  angleA: number,
  labels: { ab?: string; ac?: string; bc?: string },
  angles: { A?: number; B?: number },
): GeometrySpec {
  const C: [number, number] = [b * Math.cos(rad(angleA)), b * Math.sin(rad(angleA))];
  const angleB = Math.round((Math.atan2(C[1], c - C[0]) * 180) / Math.PI);
  return {
    type: "geometry",
    points: { A: [0, 0], B: [c, 0], C },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      ...(labels.ab ? [{ from: "A", to: "B", label: labels.ab }] : []),
      ...(labels.ac ? [{ from: "A", to: "C", label: labels.ac }] : []),
      ...(labels.bc ? [{ from: "B", to: "C", label: labels.bc }] : []),
    ],
    angles: [
      ...(angles.A
        ? [{ vertex: "A", from: "B", to: "C", label: `${angles.A}^\\circ`, value: angles.A }]
        : []),
      ...(angles.B
        ? [{ vertex: "B", from: "C", to: "A", label: `${angles.B}^\\circ`, value: angleB }]
        : []),
    ],
    pointLabels: true,
    description: "A triangle ABC with some sides and angles labelled.",
  };
}

export default defineGenerator<Params>({
  id: "GH-G22",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.COSINE-RULE.ORDER", "GEO.SINE-RULE.PAIR"],

  params(rng) {
    const b = rng.int(5, 12);
    const c = rng.int(6, 14);
    const angleA = rng.int(35, 110);
    const sa = rng.int(40, 75);
    const sb = rng.int(35, 70);
    if (b === c || sa === sb || sa + sb > 140) reject("a clear triangle");
    return { b, c, angleA, sa, sb, side: rng.int(6, 14), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const sq = p.b * p.b + p.c * p.c - 2 * p.b * p.c * Math.cos(rad(p.angleA));
        const ans = r1(Math.sqrt(sq));
        return A.standard({
          question: [
            "Work out the length BC.",
            A.figure(
              tri(
                p.b,
                p.c,
                p.angleA,
                { ab: `${p.c}\\text{ cm}`, ac: `${p.b}\\text{ cm}`, bc: "x" },
                { A: p.angleA },
              ),
            ),
          ],
          ask: "Give your answer to 1 decimal place.",
          answer: A.number(ans, { units: "cm", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "GEO.COSINE-RULE.ORDER",
              value: A.number(r1(sq), { units: "cm", accuracy: { dp: 1 } }),
              feedback: "The cosine rule gives a², so take the square root at the end.",
            },
          ]),
          solution: [
            {
              say: "Use the cosine rule: ",
              math: `x^2 = ${p.b}^2 + ${p.c}^2 - 2 \\times ${p.b} \\times ${p.c} \\times \\cos ${p.angleA}^\\circ = ${r1(sq)}`,
            },
            { say: `x = √${r1(sq)} = ${ans} cm.` },
          ],
        });
      }
      case 2: {
        const angleC = 180 - p.sa - p.sb;
        const b = (p.side * Math.sin(rad(p.sb))) / Math.sin(rad(p.sa));
        const c = (p.side * Math.sin(rad(angleC))) / Math.sin(rad(p.sa));
        const ans = r1(b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "In triangle ABC, ",
                A.math(`BC = ${p.side}\\text{ cm}`),
                ", angle A = ",
                A.math(`${p.sa}^\\circ`),
                " and angle B = ",
                A.math(`${p.sb}^\\circ`),
                ".",
                A.figure(
                  tri(b, c, p.sa, { bc: `${p.side}\\text{ cm}`, ac: "x" }, { A: p.sa, B: p.sb }),
                ),
              ],
              ask: "Work out the length AC, to 1 decimal place.",
            },
          ],
          answer: A.number(ans, { units: "cm", accuracy: { dp: 1 } }),
          wrong: wrongs(ans, [
            {
              code: "GEO.SINE-RULE.PAIR",
              value: A.number(r1((p.side * Math.sin(rad(p.sa))) / Math.sin(rad(p.sb))), {
                units: "cm",
                accuracy: { dp: 1 },
              }),
              feedback: "Each side goes with the angle opposite it: BC with A, and AC with B.",
            },
          ]),
          solution: [
            {
              say: "Use the sine rule: ",
              math: `\\frac{x}{\\sin ${p.sb}^\\circ} = \\frac{${p.side}}{\\sin ${p.sa}^\\circ}`,
            },
            { say: `x = ${p.side} × sin ${p.sb}° ÷ sin ${p.sa}° = ${ans} cm.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Kai says that when angle A is 90°, the cosine rule a² = b² + c² − 2bc cos A becomes Pythagoras' theorem."
            : "Kai says the cosine rule only works in right-angled triangles.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. cos 90° = 0, so the last term vanishes and a² = b² + c².",
                  correct: true,
                },
                {
                  text: "False. The cosine rule never works for right angles.",
                  code: "GEO.COSINE-RULE.ORDER",
                },
                { text: "False. cos 90° = 1.", code: "GEO.COSINE-RULE.ORDER" },
              ]
            : [
                {
                  text: "False. It works in any triangle; in a right-angled triangle it simplifies to Pythagoras.",
                  correct: true,
                },
                {
                  text: "True. It needs a right angle, like SOHCAHTOA.",
                  code: "GEO.COSINE-RULE.ORDER",
                },
                { text: "True. Otherwise use the sine rule.", code: "GEO.SINE-RULE.PAIR" },
              ],
          solution: [
            {
              say: "The sine and cosine rules work in every triangle; use them when there is no right angle.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        numberAnswer(question) ===
        r1(Math.sqrt(p.b * p.b + p.c * p.c - 2 * p.b * p.c * Math.cos(rad(p.angleA))))
      );
    return true;
  },
});
