/**
 * @statement GF-G18.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G18.a: Calculate arc lengths
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { sector } from "../shared/mea.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  r: number;
  theta: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G18.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SECTOR.FRACTION", "MEA.CIRCLE.FORMULA", "MEA.PERIMETER.MISSING-SIDES"],

  params(rng) {
    return { r: rng.int(3, 12), theta: rng.pick([40, 50, 60, 72, 80, 100, 120, 135, 150]) };
  },

  build(p, depth, rng): QuestionDraft {
    const arc = r1((p.theta / 360) * 2 * Math.PI * p.r);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(sector(p.r, p.theta))],
          ask: "Find the arc length of the sector, in cm, to 1 decimal place.",
          answer: A.number(arc, { accuracy: { dp: 1 } }),
          wrong: wrongs(arc, [
            {
              code: "GEO.SECTOR.FRACTION",
              value: A.number(r1((p.theta / 180) * 2 * Math.PI * p.r), { accuracy: { dp: 1 } }),
              feedback: `A full turn is 360°, so the sector is ${p.theta}/360 of the circle.`,
            },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1((p.theta / 360) * Math.PI * p.r * p.r), { accuracy: { dp: 1 } }),
              feedback: "That is the sector's area. Arc length uses the circumference, 2πr.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.theta}}{360} \\times 2\\pi \\times ${p.r} = ${arc} \\text{ cm}`,
            },
          ],
        });
      case 2: {
        const v = r1(arc + 2 * p.r);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [A.figure(sector(p.r, p.theta))],
              ask: "Find the perimeter of the sector, in cm, to 1 decimal place.",
            },
            {
              question: [`A slice of pie is a sector of radius ${p.r} cm and angle ${p.theta}°.`],
              ask: "Find the distance all the way round the slice, in cm, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(arc, { accuracy: { dp: 1 } }),
              feedback: `Add the two straight radii, ${p.r} cm each, to the arc.`,
            },
          ]),
          solution: [{ say: "", math: `${arc} + 2 \\times ${p.r} = ${v} \\text{ cm}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Ana says a sector with angle 90° has an arc a quarter of the length of the circle's circumference.`,
              ],
              truth: true,
              reasons: [
                {
                  text: "True. 90° is 90/360 = ¼ of a full turn, so the arc is ¼ of the circumference.",
                  correct: true,
                },
                {
                  text: "False. It is half, because 90 is half of 180.",
                  code: "GEO.SECTOR.FRACTION",
                },
                {
                  text: "False. The arc depends on the area, not the angle.",
                  code: "MEA.CIRCLE.FORMULA",
                },
              ],
              solution: [{ say: "The fraction of the circle is the angle over 360°." }],
            }),
          [
            {
              claim:
                "A sector's arc length is a fraction of the circumference: the angle over 360°.",
              truth: "always",
              right: "Always. The arc is the same fraction of the circle as the angle.",
              wrong: [
                ["Never. Use angle over 180°.", "GEO.SECTOR.FRACTION"],
                ["Sometimes. Only for 90°."],
              ],
            },
            {
              statement: "Pia says the arc of a 180° sector of radius 4 cm is $4\\pi$ cm long.",
              truth: true,
              right: "True. Half of 2π × 4 = 4π.",
              wrong: [
                ["False. It is 8π cm.", "GEO.SECTOR.FRACTION"],
                ["False. It is 16π cm.", "MEA.CIRCLE.FORMULA"],
              ],
            },
            {
              statement: "Raj says the perimeter of a 90° sector of radius 2 cm is $\\pi$ cm.",
              truth: false,
              right:
                "False. The arc is π cm, but the perimeter also includes the two radii: π + 4 cm.",
              wrong: [
                ["True. The perimeter is the arc.", "MEA.PERIMETER.MISSING-SIDES"],
                ["True. A quarter of 4π.", "MEA.PERIMETER.MISSING-SIDES"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const arc = r1((p.theta / 360) * 2 * Math.PI * p.r);
    if (question.key.depth === 1) return numberAnswer(question) === arc;
    if (question.key.depth === 2) return numberAnswer(question) === r1(arc + 2 * p.r);
    return true;
  },
});
