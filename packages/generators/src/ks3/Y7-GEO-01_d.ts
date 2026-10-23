/**
 * @statement Y7-GEO-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-01.d: Find the area of trapezia
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { trapezium } from "../shared/mea.ts";

interface Params {
  a: number;
  b: number;
  h: number;
  offset: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-01.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.TRAPEZIUM-HALF"],

  params(rng) {
    const b = rng.int(6, 16);
    const a = rng.int(2, b - 2);
    const p = { a, b, h: rng.int(3, 10), offset: rng.int(1, Math.max(1, b - a - 1)) };
    if (p.offset + a > b || ((a + b) * p.h) % 2 !== 0 || p.h > 1.5 * b || p.h * 2.5 < b)
      reject("a whole-number area and a trapezium that looks like one");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const area = ((p.a + p.b) * p.h) / 2;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(trapezium(p.a, p.b, p.h, p.offset))],
          ask: "Find the area of the trapezium, in cm².",
          answer: A.number(area),
          wrong: wrongs(area, [
            {
              code: "MEA.AREA.TRAPEZIUM-HALF",
              value: A.number((p.a + p.b) * p.h),
              feedback:
                "Area = ½ × (a + b) × h: add the parallel sides, multiply by the height, then halve.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2} \\times (${p.a} + ${p.b}) \\times ${p.h} = ${area} \\text{ cm}^2`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A trapezium has parallel sides ${p.a} cm and ${p.b} cm and an area of ${area} cm².`,
              ],
              ask: "Find the distance between the parallel sides, in cm.",
            },
          ],
          answer: A.number(p.h),
          wrong: wrongs(p.h, [
            {
              code: "MEA.AREA.TRAPEZIUM-HALF",
              value: A.number(Math.round((area / (p.a + p.b)) * 100) / 100),
              feedback: "Undo the half too: h = 2 × area ÷ (a + b).",
            },
          ]),
          solution: [
            { say: "", math: `2 \\times ${area} \\div ${p.a + p.b} = ${p.h} \\text{ cm}` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ben finds the area of a trapezium with parallel sides ${p.a} cm and ${p.b} cm, ${p.h} cm apart, as ½ × ${p.a} × ${p.b} × ${p.h}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The parallel sides are added, not multiplied: ½ × (${p.a} + ${p.b}) × ${p.h} = ${area} cm².`,
              correct: true,
            },
            { text: "True. Multiply all the lengths and halve.", code: "MEA.AREA.TRAPEZIUM-HALF" },
            {
              text: "True. It works like the area of a triangle.",
              code: "MEA.AREA.TRAPEZIUM-HALF",
            },
          ],
          solution: [{ say: "Average the parallel sides, then multiply by the height." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === ((p.a + p.b) * p.h) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === p.h;
    return true;
  },
});
