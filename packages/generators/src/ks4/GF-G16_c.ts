/**
 * @statement GF-G16.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G16.c: Find the volume of cylinders
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cylinder } from "../shared/solids.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  r: number;
  h: number;
  d: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G16.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CIRCLE.FORMULA", "GEO.CIRCLE.RADIUS-DIAMETER", "RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    const p = { r: rng.int(2, 9), h: rng.int(4, 20), d: rng.int(2, 10) * 2 };
    if (p.h > 4 * p.r || p.r > 3 * p.h) reject("a sensible cylinder");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.PI * p.r * p.r * p.h);
        return A.standard({
          question: [`The cylinder has radius ${p.r} cm.`, A.figure(cylinder(p.r, p.h))],
          ask: "Find its volume, in cm³, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(2 * Math.PI * p.r * p.h), { accuracy: { dp: 1 } }),
              feedback: "The cross-section is a circle with area πr², not 2πr.",
            },
          ]),
          solution: [
            { say: "", math: `\\pi \\times ${p.r}^2 \\times ${p.h} = ${v} \\text{ cm}^3` },
          ],
        });
      }
      case 2: {
        const v = r1(Math.PI * (p.d / 2) ** 2 * p.h);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A tin of soup is a cylinder with diameter ${p.d} cm and height ${p.h} cm.`,
              ],
              ask: "Find its volume, in cm³, to 1 decimal place.",
            },
            {
              question: [`A cylindrical water tank is ${p.h} m tall and ${p.d} m across.`],
              ask: "How much water can it hold, in m³, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(Math.PI * p.d * p.d * p.h), { accuracy: { dp: 1 } }),
              feedback: `The radius is half the diameter: ${p.d / 2}.`,
            },
          ]),
          solution: [{ say: "", math: `\\pi \\times ${p.d / 2}^2 \\times ${p.h} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Kai says doubling the radius of a cylinder of radius ${p.r} cm doubles its volume.`,
              ],
              truth: false,
              reasons: [
                {
                  text: "False. The radius is squared in πr²h, so doubling it multiplies the volume by 4.",
                  correct: true,
                },
                {
                  text: "True. Double the size, double the volume.",
                  code: "RAT.SCALE.AREA-LINEAR",
                },
                { text: "False. It multiplies the volume by 8.", code: "RAT.SCALE.AREA-LINEAR" },
              ],
              solution: [{ say: "", math: `\\pi (2r)^2 h = 4\\pi r^2 h` }],
            }),
          [
            {
              statement:
                "A cylinder has radius 2 cm and height 10 cm. Ana says its volume is $40\\pi$ cm³.",
              truth: true,
              right: "True. π × 2² × 10 = 40π.",
              wrong: [
                ["False. It is 20π cm³.", "MEA.CIRCLE.FORMULA"],
                ["False. It is 400π cm³.", "GEO.CIRCLE.RADIUS-DIAMETER"],
              ],
            },
            {
              claim: "Doubling the height of a cylinder doubles its volume.",
              truth: "always",
              right: "Always. V = πr²h, so it is directly proportional to h.",
              wrong: [
                ["Never. It multiplies by 4.", "RAT.SCALE.AREA-LINEAR"],
                ["Sometimes. Only for wide cylinders."],
              ],
            },
            {
              statement:
                "A cylinder has diameter 6 cm and height 5 cm. Raj says its volume is $180\\pi$ cm³.",
              truth: false,
              right: "False. The radius is 3 cm: π × 9 × 5 = 45π cm³.",
              wrong: [
                ["True. π × 6² × 5 = 180π.", "GEO.CIRCLE.RADIUS-DIAMETER"],
                ["True. Use the diameter in the formula.", "GEO.CIRCLE.RADIUS-DIAMETER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * p.r * p.r * p.h);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(Math.PI * (p.d / 2) ** 2 * p.h);
    return true;
  },
});
