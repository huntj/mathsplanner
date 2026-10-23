/**
 * @statement GF-G18.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G18.b: Calculate the area of a sector
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { sector } from "../shared/mea.ts";

interface Params {
  r: number;
  theta: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G18.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CIRCLE.FORMULA", "GEO.SECTOR.FRACTION"],

  params(rng) {
    return { r: rng.int(3, 12), theta: rng.pick([40, 50, 60, 72, 80, 100, 120, 135, 150]) };
  },

  build(p, depth, rng): QuestionDraft {
    const area = r1((p.theta / 360) * Math.PI * p.r * p.r);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(sector(p.r, p.theta))],
          ask: "Find the area of the sector, in cm², to 1 decimal place.",
          answer: A.number(area, { accuracy: { dp: 1 } }),
          wrong: wrongs(area, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1((p.theta / 360) * 2 * Math.PI * p.r), { accuracy: { dp: 1 } }),
              feedback: "That is the arc length. Area uses πr².",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.theta}}{360} \\times \\pi \\times ${p.r}^2 = ${area} \\text{ cm}^2`,
            },
          ],
        });
      case 2: {
        const v = r1(((360 - p.theta) / 360) * Math.PI * p.r * p.r);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A circular pizza of radius ${p.r} cm has a slice with angle ${p.theta}° cut out.`,
              ],
              ask: "Find the area of pizza left, in cm², to 1 decimal place.",
            },
            {
              question: [
                `A sector of angle ${p.theta}° is removed from a circle of radius ${p.r} cm.`,
              ],
              ask: "Find the area that is left, in cm², to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.SECTOR.FRACTION",
              value: A.number(area, { accuracy: { dp: 1 } }),
              feedback: `That is the slice taken out. What is left has angle 360° − ${p.theta}° = ${360 - p.theta}°.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${360 - p.theta}}{360} \\times \\pi \\times ${p.r}^2 = ${v} \\text{ cm}^2`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rob says doubling the angle of a sector, with the radius unchanged, doubles its area.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. The area is (angle ÷ 360) × πr², so it is proportional to the angle.",
              correct: true,
            },
            { text: "False. It multiplies the area by 4.", code: "GEO.SECTOR.FRACTION" },
            { text: "False. The area only depends on the radius.", code: "MEA.CIRCLE.FORMULA" },
          ],
          solution: [
            {
              say: "Doubling the radius would multiply the area by 4; doubling the angle doubles it.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1((p.theta / 360) * Math.PI * p.r * p.r);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(((360 - p.theta) / 360) * Math.PI * p.r * p.r);
    return true;
  },
});
