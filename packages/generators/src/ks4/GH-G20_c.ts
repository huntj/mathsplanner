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
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  C: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "GH-G20.c",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
                {
                  text: "True. Any angle of the triangle will do.",
                  code: "GEO.AREA-SINE.INCLUDED",
                },
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
            }),
          [
            {
              statement:
                "Sol says a triangle with sides 6 and 10 and an included angle of 30° has area 15.",
              truth: true,
              right: "True. ½ × 6 × 10 × sin 30° = 30 × 0.5 = 15.",
              wrong: [["False. It is 30.", "MEA.AREA.TRIANGLE-HALF"], ["False. It is 60."]],
            },
            {
              claim: "Area = ½ab sin C needs C to be the angle between sides a and b.",
              truth: "always",
              right: "Always. It must be the included angle.",
              wrong: [
                ["Never. Any angle will do.", "GEO.AREA-SINE.INCLUDED"],
                ["Sometimes. Only for right angles."],
              ],
            },
            {
              statement:
                "Bea says Area = ½ab sin C gives a bigger area when C is 150° than when C is 30°.",
              truth: false,
              right: "False. sin 150° = sin 30°, so the areas are equal.",
              wrong: [
                ["True. A bigger angle gives a bigger area.", "GEO.AREA-SINE.INCLUDED"],
                ["True. sin grows with the angle.", "GEO.AREA-SINE.INCLUDED"],
              ],
            },
          ],
        );
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
