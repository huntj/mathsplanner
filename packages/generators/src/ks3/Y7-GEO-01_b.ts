/**
 * @statement Y7-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-01.b: Find the area of triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { triangle } from "../shared/mea.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  base: number;
  height: number;
  offset: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-01.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF"],

  params(rng) {
    const base = rng.int(4, 14);
    const p = { base, height: rng.int(3, 10), offset: rng.int(1, base - 1) };
    if ((p.base * p.height) % 2 !== 0 || p.height > 1.5 * p.base)
      reject("a whole-number area and a sensible shape");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const area = (p.base * p.height) / 2;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(triangle(p.base, p.height, p.offset))],
          ask: "Find the area of the triangle, in cm².",
          answer: A.number(area),
          wrong: wrongs(area, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.base * p.height),
              feedback: "A triangle is half of a rectangle with the same base and height.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2} \\times ${p.base} \\times ${p.height} = ${area} \\text{ cm}^2`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A triangle has an area of ${area} cm² and a base of ${p.base} cm.`],
              ask: "Find its perpendicular height, in cm.",
            },
            {
              question: [`A triangular sail has area ${area} m². Its base is ${p.base} m.`],
              ask: "How tall is the sail, in m?",
            },
          ],
          answer: A.number(p.height),
          wrong: wrongs(p.height, [
            Number.isInteger(area / p.base)
              ? {
                  code: "MEA.AREA.TRIANGLE-HALF",
                  value: A.number(area / p.base),
                  feedback: "Area = ½ × base × height, so height = 2 × area ÷ base.",
                }
              : {
                  code: "MEA.AREA.TRIANGLE-HALF",
                  value: A.number(Math.round((area / p.base) * 100) / 100),
                  feedback: "Area = ½ × base × height, so height = 2 × area ÷ base.",
                },
          ]),
          solution: [{ say: "", math: `2 \\times ${area} \\div ${p.base} = ${p.height}` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Lee says two triangles with the same base, ${p.base} cm, and the same perpendicular height, ${p.height} cm, must have the same area, even if they look different.`,
              ],
              truth: true,
              reasons: [
                {
                  text: `True. Area = ½ × base × height = ${area} cm² for both. Sliding the top point along does not change the height.`,
                  correct: true,
                },
                {
                  text: "False. The one with longer sloping sides has more area.",
                  code: "MEA.AREA.TRIANGLE-HALF",
                },
                {
                  text: "False. Only right-angled triangles use base × height.",
                  code: "MEA.AREA.TRIANGLE-HALF",
                },
              ],
              solution: [{ say: "Only the base and the perpendicular height matter." }],
            }),
          [
            {
              statement: `Kay says a triangle with base ${p.base} cm and perpendicular height ${p.height} cm has an area of ${p.base * p.height} cm².`,
              truth: false,
              right: `False. A triangle is half a rectangle: ½ × ${p.base} × ${p.height} = ${(p.base * p.height) / 2} cm².`,
              wrong: [
                ["True. Area is base times height.", "MEA.AREA.TRIANGLE-HALF"],
                ["True. Triangles use the same formula as rectangles.", "MEA.AREA.TRIANGLE-HALF"],
              ],
            },
            {
              statement: `Lin says a triangle with base ${p.base} cm and perpendicular height ${p.height} cm has the same area as a ${p.base} cm by ${p.height / 2} cm rectangle.`,
              truth: true,
              right: `True. Both have an area of ${(p.base * p.height) / 2} cm².`,
              wrong: [
                [
                  "False. A triangle always has less area than a rectangle.",
                  "MEA.AREA.TRIANGLE-HALF",
                ],
                ["False. Triangles and rectangles cannot be compared."],
              ],
            },
            {
              claim: "The area of a triangle is ½ × base × the length of a sloping side.",
              truth: "sometimes",
              right:
                "Sometimes. It works when that side is perpendicular to the base, as in a right-angled triangle; otherwise use the perpendicular height.",
              wrong: [
                ["Always. Any side can be the height.", "MEA.AREA.TRIANGLE-HALF"],
                ["Never. A triangle's area never uses ½."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.base * p.height) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === p.height;
    return true;
  },
});
