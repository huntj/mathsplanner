/**
 * @statement AL-P5.1a.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1a.d: Use area = ½ab sin C
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { r1, rad } from "../shared/trig.ts";

interface Params {
  a: number;
  b: number;
  C: number;
  /** Depth 4: the angle that is not between the sides. */
  other: number;
}

export default defineGenerator<Params>({
  id: "AL-P5.1a.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.AREA-SINE.INCLUDED"],

  params(rng) {
    const p = { a: rng.int(4, 15), b: rng.int(4, 15), C: rng.int(25, 140), other: rng.int(20, 70) };
    if (p.C === 90 || p.C + p.other >= 170) reject("a real triangle that is not right-angled");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const area = r1(0.5 * p.a * p.b * Math.sin(rad(p.C)));
    switch (depth) {
      case 1:
        return A.standard({
          question: `In triangle ABC, BC = ${p.a} cm, AC = ${p.b} cm and angle ACB = ${p.C}°.`,
          ask: "Find the area of the triangle, to 1 decimal place.",
          answer: A.number(area, { units: "cm²", accuracy: { dp: 1 } }),
          wrong: wrongs(area, [
            {
              code: "GEO.AREA-SINE.INCLUDED",
              value: A.number(r1(p.a * p.b * Math.sin(rad(p.C))), {
                units: "cm²",
                accuracy: { dp: 1 },
              }),
              feedback: "Remember the ½ in ½ab sin C.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tfrac{1}{2} \\times ${p.a} \\times ${p.b} \\times \\sin ${p.C}^\\circ = ${area}\\text{ cm}^2`,
            },
          ],
        });
      case 2: {
        const target = area;
        return A.standard({
          question: `A triangle has sides of ${p.a} cm and ${p.b} cm with an acute angle θ between them. Its area is ${target} cm².`,
          ask: "Find θ, to the nearest degree.",
          answer: A.number(
            Math.round((Math.asin(Math.min(1, (2 * target) / (p.a * p.b))) * 180) / Math.PI),
            { units: "°", accuracy: { dp: 0 } },
          ),
          wrong: wrongs(
            Math.round((Math.asin(Math.min(1, (2 * target) / (p.a * p.b))) * 180) / Math.PI),
            [
              {
                code: "GEO.AREA-SINE.INCLUDED",
                value: A.number(
                  Math.round((Math.asin(Math.min(1, target / (p.a * p.b))) * 180) / Math.PI),
                  { units: "°", accuracy: { dp: 0 } },
                ),
                feedback: "Area = ½ab sin θ, so sin θ = 2 × area ÷ (ab).",
              },
            ],
          ),
          solution: [
            { say: "", math: `\\sin\\theta = \\frac{2 \\times ${target}}{${p.a} \\times ${p.b}}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `In triangle ABC, BC = ${p.a} cm, AC = ${p.b} cm and angle ABC = ${p.other}°. Rob says the area is ½ × ${p.a} × ${p.b} × sin ${p.other}°.`,
          truth: false,
          reasons: [
            {
              text: "False. The angle must be the one between the two sides, angle ACB, not angle ABC.",
              correct: true,
            },
            { text: "True. Any angle in the triangle will do.", code: "GEO.AREA-SINE.INCLUDED" },
            { text: "True. Use the angle you are given.", code: "GEO.AREA-SINE.INCLUDED" },
          ],
          solution: [{ say: "Area = ½ab sin C, where C is the angle between sides a and b." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(0.5 * p.a * p.b * Math.sin(rad(p.C)));
    return true;
  },
});
