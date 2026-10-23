/**
 * @statement GH-G20.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-G20.c: Use trigonometry in general triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  C: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "GH-G20.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF", "GEO.AREA-SINE.INCLUDED"],

  params(rng) {
    const p = { a: rng.int(4, 15), b: rng.int(4, 15), C: rng.int(25, 140) };
    if (p.C === 90) reject("a non-right angle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const area = 0.5 * p.a * p.b * Math.sin(rad(p.C));
    switch (depth) {
      case 1: {
        const v = r1(area);
        return A.standard({
          question: [`In triangle ABC, BC = ${p.a} cm, AC = ${p.b} cm and angle C = ${p.C}°.`],
          ask: "Find the area of the triangle, in cm², to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(r1(2 * area), { accuracy: { dp: 1 } }),
              feedback: "Area = ½ab sin C: remember the half.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2} \\times ${p.a} \\times ${p.b} \\times \\sin ${p.C}^\\circ = ${v} \\text{ cm}^2`,
            },
          ],
        });
      }
      case 2: {
        const given = r1(area);
        const v = r1((2 * given) / (p.a * Math.sin(rad(p.C))));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A triangle has area ${given} cm². Two of its sides are ${p.a} cm and x cm, with an angle of ${p.C}° between them.`,
              ],
              ask: "Find x, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(r1(given / (p.a * Math.sin(rad(p.C)))), { accuracy: { dp: 1 } }),
              feedback: "Rearrange ½ × a × x × sin C = area: x = 2 × area ÷ (a sin C).",
            },
          ]),
          solution: [
            { say: "", math: `x = \\frac{2 \\times ${given}}{${p.a} \\sin ${p.C}^\\circ} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom says Area = ½ab sin C works with any two sides of a triangle and any one of its angles.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. C must be the angle between sides a and b (the included angle).",
              correct: true,
            },
            { text: "True. Any angle of the triangle will do.", code: "GEO.AREA-SINE.INCLUDED" },
            {
              text: "True. As long as the triangle is not right-angled.",
              code: "GEO.AREA-SINE.INCLUDED",
            },
          ],
          solution: [
            {
              say: "b sin C is the height of the triangle on base a only when C is between a and b.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const area = 0.5 * p.a * p.b * Math.sin(rad(p.C));
    if (question.key.depth === 1) return numberAnswer(question) === r1(area);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1((2 * r1(area)) / (p.a * Math.sin(rad(p.C))));
    return true;
  },
});
