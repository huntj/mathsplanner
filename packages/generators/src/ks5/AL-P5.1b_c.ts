/**
 * @statement AL-P5.1b.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P5.1b.c: Find sector areas in radians
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  /** The angle in tenths of a radian. */
  t: number;
}

export default defineGenerator<Params>({
  id: "AL-P5.1b.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.RADIAN.CONVERT", "GEO.CIRCLE.SECTOR-SEGMENT"],

  params(rng) {
    return { r: rng.int(3, 12), t: rng.int(4, 25) };
  },

  build(p, depth, rng): QuestionDraft {
    const theta = p.t / 10;
    const area = Math.round(0.5 * p.r * p.r * theta * 100) / 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A sector has radius ${p.r} cm and angle ${theta} radians.`,
          ask: "Find its area.",
          answer: A.number(area, { units: "cm²", accuracy: { dp: 2 } }),
          wrong: wrongs(area, [
            {
              code: "GEO.CIRCLE.SECTOR-SEGMENT",
              value: A.number(Math.round(p.r * p.r * theta * 100) / 100, {
                units: "cm²",
                accuracy: { dp: 2 },
              }),
              feedback: "The area of a sector is ½r²θ: remember the ½.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tfrac{1}{2} \\times ${p.r}^2 \\times ${theta} = ${area}\\text{ cm}^2`,
            },
          ],
        });
      case 2: {
        const known = Math.round(0.5 * p.r * p.r * theta * 100) / 100;
        return A.standard({
          question: `A sector of a circle of radius ${p.r} cm has area ${known} cm².`,
          ask: "Find the angle of the sector, in radians, to 1 decimal place.",
          answer: A.number(theta, { accuracy: { dp: 1 } }),
          wrong: wrongs(theta, [
            {
              code: "GEO.CIRCLE.SECTOR-SEGMENT",
              value: A.number(Math.round((known / (p.r * p.r)) * 10) / 10, { accuracy: { dp: 1 } }),
              feedback: "Area = ½r²θ, so θ = 2 × area ÷ r².",
            },
          ]),
          solution: [
            { say: "", math: `\\theta = \\frac{2 \\times ${known}}{${p.r}^2} = ${theta}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A sector has radius ${p.r} cm and angle ${theta} radians. Gus says its area is ${theta}/360 × π × ${p.r}².`,
          truth: false,
          reasons: [
            {
              text: `False. That formula needs the angle in degrees. In radians the area is ½r²θ = ${area} cm².`,
              correct: true,
            },
            { text: "True. The sector formula is always θ/360 × πr².", code: "GEO.RADIAN.CONVERT" },
            { text: "True. Radians and degrees give the same area.", code: "GEO.RADIAN.CONVERT" },
          ],
          solution: [{ say: "", math: `A = \\tfrac{1}{2}r^2\\theta` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return Math.abs(numberAnswer(question) - 0.5 * p.r * p.r * (p.t / 10)) < 0.006;
    if (question.key.depth === 2) return numberAnswer(question) === p.t / 10;
    return true;
  },
});
