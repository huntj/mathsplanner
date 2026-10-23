/**
 * @statement GF-G18.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G18.c: Find the angle of a sector from its arc or area
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const ANGLES = [30, 40, 45, 60, 72, 80, 90, 120, 135, 150, 160];

interface Params {
  theta: number;
  r: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "GF-G18.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SECTOR.FRACTION", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    const p = { theta: rng.pick(ANGLES), r: rng.int(3, 20), s: rng.int(2, 12) };
    if (!Number.isInteger((p.theta * p.r) / 180)) reject("an arc that is a whole multiple of π");
    if (!Number.isInteger((p.theta * p.s * p.s) / 360))
      reject("an area that is a whole multiple of π");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const k = (p.theta * p.r) / 180;
        return A.standard({
          question: [
            `A sector of a circle of radius ${p.r} cm has arc length `,
            A.math(`${k}\\pi`),
            " cm.",
          ],
          ask: "Find the angle of the sector.",
          answer: A.degrees(p.theta),
          wrong: wrongs(p.theta, [
            {
              code: "GEO.SECTOR.FRACTION",
              value: A.degrees(p.theta / 2),
              feedback: "Compare with the whole circumference, 2πr, and a full turn of 360°.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{\\theta}{360} \\times 2\\pi \\times ${p.r} = ${k}\\pi \\Rightarrow \\theta = ${p.theta}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const k = (p.theta * p.s * p.s) / 360;
        const slip = (360 * k) / (2 * p.s);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A sector of a circle of radius ${p.s} cm has area `,
                A.math(`${k}\\pi`),
                " cm².",
              ],
              ask: "Find the angle of the sector.",
            },
          ],
          answer: A.degrees(p.theta),
          wrong: wrongs(p.theta, [
            Number.isInteger(slip)
              ? {
                  code: "MEA.CIRCLE.FORMULA",
                  value: A.degrees(slip),
                  feedback: "Area of the whole circle is πr², not 2πr.",
                }
              : undefined,
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{\\theta}{360} \\times \\pi \\times ${p.s}^2 = ${k}\\pi \\Rightarrow \\theta = ${p.theta}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kim says a sector with arc length equal to half the circle's circumference has an angle of 90°.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Half the circumference means half of 360°, which is 180°: a semicircle.",
              correct: true,
            },
            { text: "True. Half of 180° is 90°.", code: "GEO.SECTOR.FRACTION" },
            {
              text: "True. A quarter of the area is a quarter of the arc.",
              code: "MEA.CIRCLE.FORMULA",
            },
          ],
          solution: [{ say: "Fraction of the arc = fraction of 360°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.theta;
    return true;
  },
});
