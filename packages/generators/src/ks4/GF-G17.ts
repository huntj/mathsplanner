/**
 * @statement GF-G17
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G17: Know the formulae: circumference of a circle = 2πr = πd, area of a circle = πr²; calculate
// perimeters of 2D shapes, including circles; areas of circles and composite shapes; surface area
// and volume of spheres, pyramids, cones and composite solids
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  h: number;
  s: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const dp1 = { accuracy: { dp: 1 } } as const;

export default defineGenerator<Params>({
  id: "GF-G17",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.VOLUME.FORMULA", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    return { r: rng.int(2, 9), h: rng.int(4, 15), s: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1((Math.PI * p.r * p.r * p.h) / 3);
        return A.standard({
          question: [
            "A cone has base radius ",
            A.math(`${p.r}\\text{ cm}`),
            " and height ",
            A.math(`${p.h}\\text{ cm}`),
            ". Volume of a cone = ",
            A.math("\\frac{1}{3}\\pi r^2 h"),
            ".",
          ],
          ask: "Work out its volume, to 1 decimal place.",
          answer: A.number(v, { units: "cm³", ...dp1 }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.FORMULA",
              value: A.number(r1(Math.PI * p.r * p.r * p.h), dp1),
              feedback: "A cone is a third of the cylinder with the same base and height.",
            },
          ]),
          solution: [{ say: `⅓ × π × ${p.r}² × ${p.h} = ${v} cm³.` }],
        });
      }
      case 2: {
        const v = r1((4 / 3) * Math.PI * p.r ** 3);
        return A.standard({
          question: [
            "A sphere has radius ",
            A.math(`${p.r}\\text{ cm}`),
            ". Volume of a sphere = ",
            A.math("\\frac{4}{3}\\pi r^3"),
            ".",
          ],
          ask: "Work out its volume, to 1 decimal place.",
          answer: A.number(v, { units: "cm³", ...dp1 }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.FORMULA",
              value: A.number(r1((4 / 3) * Math.PI * p.r ** 2), dp1),
              feedback: "The radius is cubed for a volume.",
            },
            {
              code: "MEA.VOLUME.FORMULA",
              value: A.number(r1(4 * Math.PI * p.r ** 2), dp1),
              feedback: "4πr² is the surface area.",
            },
          ]),
          solution: [{ say: `⁴⁄₃ × π × ${p.r}³ = ${v} cm³.` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `A square-based pyramid has base ${p.s} cm by ${p.s} cm and height ${p.h} cm. Jo says its volume is ${p.s * p.s * p.h} cm³.`,
          truth: false,
          reasons: [
            {
              text: `False. A pyramid is a third of the prism with the same base and height: ⅓ × ${p.s * p.s} × ${p.h} = ${r1((p.s * p.s * p.h) / 3)} cm³.`,
              correct: true,
            },
            {
              text: "True. Volume = base area × height for every solid.",
              code: "MEA.VOLUME.FORMULA",
            },
            { text: "True. Pyramids and prisms have the same volume.", code: "MEA.VOLUME.FORMULA" },
          ],
          solution: [{ say: "V = ⅓ × base area × height for pyramids and cones." }],
        });
      default: {
        const cyl = Math.PI * p.r * p.r * p.h;
        const hemi = (2 / 3) * Math.PI * p.r ** 3;
        return A.multiStepContext({
          context: `A silo is a cylinder of radius ${p.r} m and height ${p.h} m with a hemisphere on top.`,
          parts: [
            {
              ask: "Work out the volume of the hemisphere, to 1 decimal place.",
              answer: A.number(r1(hemi), { units: "m³", ...dp1 }),
              wrong: wrongs(r1(hemi), [
                {
                  code: "MEA.VOLUME.FORMULA",
                  value: A.number(r1((4 / 3) * Math.PI * p.r ** 3), dp1),
                  feedback: "A hemisphere is half a sphere.",
                },
              ]),
            },
            {
              ask: "Work out the total volume of the silo, to 1 decimal place.",
              answer: A.number(r1(cyl + hemi), { units: "m³", ...dp1 }),
            },
          ],
          solution: [
            { say: `Hemisphere: ½ × ⁴⁄₃π × ${p.r}³ = ${r1(hemi)} m³.` },
            {
              say: `Cylinder: π × ${p.r}² × ${p.h} = ${r1(cyl)} m³. Total ≈ ${r1(cyl + hemi)} m³.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const n = numberAnswer(question);
    if (question.archetype === "standard")
      return (
        Math.abs(n - (Math.PI * p.r * p.r * p.h) / 3) < 0.06 ||
        Math.abs(n - (4 / 3) * Math.PI * p.r ** 3) < 0.06
      );
    if (question.archetype === "multi-step-context")
      return Math.abs(n - (2 / 3) * Math.PI * p.r ** 3) < 0.06;
    return true;
  },
});
