/**
 * @statement Y9-RAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-RAT-02: Use ratio and proportion: recognise and use relationships between the proportional
// quantities in similar shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Scale factor k = kn / 2 (so halves are allowed). */
  kn: number;
  a: number;
  b: number;
  area: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y9-RAT-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.SCALE.AREA-LINEAR"],

  params(rng, numbers) {
    const kn = rng.int(3, numbers === "stretch" ? 10 : 7);
    const a = rng.int(1, 9) * 2;
    const b = rng.int(1, 9) * 2;
    const area = rng.int(2, 20) * 4;
    if (a === b || kn === 4) reject("different sides; a scale factor other than 2");
    return { kn, a, b, area, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const k = p.kn / 2;
    switch (depth) {
      case 1: {
        const [A0, B0] = [p.a * k, p.b * k];
        return A.standard({
          question: `Triangles P and Q are similar. A side of P is ${p.a} cm and the matching side of Q is ${A0} cm. Another side of P is ${p.b} cm.`,
          ask: "How long is the matching side of Q, in centimetres?",
          answer: A.number(B0),
          wrong: wrongs(B0, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.b + (A0 - p.a)),
              feedback: `Similar shapes are enlargements: every length is multiplied by ${k}, not increased by ${A0 - p.a}.`,
            },
          ]),
          solution: [
            { say: `The scale factor is ${A0} ÷ ${p.a} = ${k}, so ${p.b} × ${k} = ${B0} cm.` },
          ],
        });
      }
      case 2: {
        const big = p.area * k * k;
        return A.standard({
          question: `Two rectangles are similar. The larger is an enlargement of the smaller by scale factor ${k}. The smaller has an area of ${p.area} cm².`,
          ask: "What is the area of the larger rectangle, in cm²?",
          answer: A.number(big),
          wrong: wrongs(big, [
            {
              code: "RAT.SCALE.AREA-LINEAR",
              value: A.number(p.area * k),
              feedback: `Both the length and the width are multiplied by ${k}, so the area is multiplied by ${k}² = ${k * k}.`,
            },
          ]),
          solution: [
            { say: `Area scale factor = ${k}² = ${k * k}, so ${p.area} × ${k * k} = ${big} cm².` },
          ],
        });
      }
      default:
        return p.claim === 0
          ? A.trueOrFalseWhy({
              rng,
              statement: "Doubling every length of a cube doubles its volume.",
              truth: false,
              reasons: [
                {
                  text: "False. The length, width and height are all doubled, so the volume is multiplied by 2 × 2 × 2 = 8.",
                  correct: true,
                },
                {
                  text: "True. Lengths and volumes grow by the same scale factor.",
                  code: "RAT.SCALE.AREA-LINEAR",
                },
                { text: "True. Doubling anything doubles it." },
              ],
              solution: [{ say: "Volume scale factor = 2³ = 8." }],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: `A photo is enlarged by scale factor ${k}. Rob says it needs ${k * k} times as much ink.`,
              truth: true,
              reasons: [
                {
                  text: `True. The ink covers the area, and the area scale factor is ${k}² = ${k * k}.`,
                  correct: true,
                },
                {
                  text: `False. It needs ${k} times as much, the same as the lengths.`,
                  code: "RAT.SCALE.AREA-LINEAR",
                },
                { text: "False. The ink needed stays the same." },
              ],
              solution: [{ say: `Area scale factor = ${k}² = ${k * k}.` }],
            });
    }
  },

  verify(p, question) {
    const k = p.kn / 2;
    if (question.archetype === "true-or-false-why") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === p.b * k
      : numberAnswer(question) === p.area * k * k;
  },
});
