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

interface Params {
  r: number;
  h: number;
  d: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G16.c",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
            { text: "True. Double the size, double the volume.", code: "RAT.SCALE.AREA-LINEAR" },
            { text: "False. It multiplies the volume by 8.", code: "RAT.SCALE.AREA-LINEAR" },
          ],
          solution: [{ say: "", math: `\\pi (2r)^2 h = 4\\pi r^2 h` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * p.r * p.r * p.h);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(Math.PI * (p.d / 2) ** 2 * p.h);
    return true;
  },
});
