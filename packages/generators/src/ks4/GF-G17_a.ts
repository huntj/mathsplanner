/**
 * @statement GF-G17.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G17.a: Find the circumference and area of a circle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  d: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G17.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "MEA.CIRCLE.FORMULA",
    "GEO.CIRCLE.RADIUS-DIAMETER",
    "MEA.PERIMETER.MISSING-SIDES",
  ],

  params(rng) {
    return { r: rng.int(3, 15), d: rng.int(3, 30) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.PI * p.r * p.r);
        return A.standard({
          question: [`A circle has radius ${p.r} cm.`],
          ask: "Find its area, in cm², to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(2 * Math.PI * p.r), { accuracy: { dp: 1 } }),
              feedback: "That is the circumference. Area = πr².",
            },
          ]),
          solution: [{ say: "", math: `\\pi \\times ${p.r}^2 = ${v} \\text{ cm}^2` }],
        });
      }
      case 2: {
        const v = r1(Math.PI * p.d);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A circle has diameter ${p.d} cm.`],
              ask: "Find its circumference, in cm, to 1 decimal place.",
            },
            {
              question: [`A bicycle wheel has diameter ${p.d} cm.`],
              ask: "How far does it roll in one turn, in cm, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.CIRCLE.RADIUS-DIAMETER",
              value: A.number(r1(2 * Math.PI * p.d), { accuracy: { dp: 1 } }),
              feedback: "C = πd, or 2πr. You were given the diameter, so do not double it.",
            },
          ]),
          solution: [{ say: "", math: `\\pi \\times ${p.d} = ${v} \\text{ cm}` }],
        });
      }
      default: {
        const half = r1(Math.PI * p.r);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Sid says the perimeter of a semicircle of radius ${p.r} cm is ${half} cm, half of the circle's circumference.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The perimeter also includes the straight edge, the diameter: ${half} + ${2 * p.r} = ${r1(Math.PI * p.r + 2 * p.r)} cm.`,
              correct: true,
            },
            { text: "True. A semicircle is half a circle.", code: "MEA.PERIMETER.MISSING-SIDES" },
            { text: "False. It is πr², half of the area.", code: "MEA.CIRCLE.FORMULA" },
          ],
          solution: [{ say: "A perimeter goes all the way round the shape." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * p.r * p.r);
    if (question.key.depth === 2) return numberAnswer(question) === r1(Math.PI * p.d);
    return true;
  },
});
