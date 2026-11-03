/**
 * @statement Y8-GEO-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-01.c: Find perimeters and areas of composite shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  r: number;
  q: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y8-GEO-01.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP", "MEA.PERIMETER.MISSING-SIDES"],

  params(rng) {
    return { r: rng.int(2, 12), q: rng.int(3, 15) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1((Math.PI * p.r * p.r) / 2);
        return A.standard({
          question: [`A semicircle has radius ${p.r} cm.`],
          ask: "Find its area, in cm², to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(r1(Math.PI * p.r * p.r), { accuracy: { dp: 1 } }),
              feedback: "That is the whole circle. A semicircle is half of it.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{1}{2} \\times \\pi \\times ${p.r}^2 = ${v} \\text{ cm}^2` },
          ],
        });
      }
      case 2: {
        const arc = (2 * Math.PI * p.q) / 4;
        const v = r1(arc + 2 * p.q);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A quarter circle has radius ${p.q} cm.`],
              ask: "Find its perimeter, in cm, to 1 decimal place.",
            },
            {
              question: [`A garden bed is a quarter circle of radius ${p.q} m.`],
              ask: "How much fencing is needed to go all the way round it, in m, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(r1(arc), { accuracy: { dp: 1 } }),
              feedback: `Add the two straight edges, ${p.q} each, to the curved arc.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{4} \\times 2\\pi \\times ${p.q} + 2 \\times ${p.q} = ${v}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [
                "The perimeter of a semicircle is half the circumference of the full circle.",
              ],
              truth: "never",
              reasons: [
                {
                  text: `Never. The perimeter also includes the straight diameter: πr + 2r. For r = ${p.r} that is ${r1(Math.PI * p.r + 2 * p.r)} cm, not ${r1(Math.PI * p.r)} cm.`,
                  correct: true,
                },
                {
                  text: "Always. A semicircle is half a circle.",
                  code: "MEA.PERIMETER.MISSING-SIDES",
                },
                {
                  text: "Sometimes. It depends on the radius.",
                  code: "MEA.PERIMETER.MISSING-SIDES",
                },
              ],
              solution: [{ say: "A perimeter goes all the way round the shape." }],
            }),
          [
            {
              statement:
                "A 4 cm by 6 cm rectangle has a semicircle with diameter 4 cm on one of its short sides. Lee says its perimeter is $4 + 6 + 4 + 6 + 2\\pi$ cm.",
              truth: false,
              right:
                "False. The side under the semicircle is inside the shape, so the perimeter is 6 + 4 + 6 + 2π cm.",
              wrong: [
                ["True. Add up every line in the shape.", "MEA.PERIMETER.MISSING-SIDES"],
                ["True. It is the rectangle's perimeter plus the curve."],
              ],
            },
            {
              statement:
                "An L-shape is made from two rectangles that do not overlap. Ana says its area is the two rectangles' areas added together.",
              truth: true,
              right: "True. Split a shape into parts that do not overlap and add their areas.",
              wrong: [
                ["False. Multiply the two longest sides.", "AS.MULTISTEP.ONE-STEP"],
                ["False. You must take away the corner piece."],
              ],
            },
            {
              claim:
                "Cutting a shape into two pieces and fitting them together differently keeps the area the same.",
              truth: "always",
              right: "Always. The same pieces cover the same amount of space.",
              wrong: [
                ["Sometimes. Only if the perimeter stays the same.", "MEA.PERIMETER.MISSING-SIDES"],
                ["Never. A new shape has a new area."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1((Math.PI * p.r * p.r) / 2);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1((2 * Math.PI * p.q) / 4 + 2 * p.q);
    return true;
  },
});
