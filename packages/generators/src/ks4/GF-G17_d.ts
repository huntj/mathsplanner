/**
 * @statement GF-G17.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G17.d: Find the surface area and volume of pyramids and cones
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [7, 24, 25],
];

interface Params {
  b: number;
  h: number;
  t: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G17.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.VOLUME.FORMULA", "MEA.AREA.SLANT"],

  params(rng) {
    return { b: rng.int(3, 12), h: rng.int(2, 8) * 3, t: rng.int(0, TRIPLES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.b * p.b * p.h) / 3;
        return A.standard({
          question: [
            `A square-based pyramid has base ${p.b} cm by ${p.b} cm and perpendicular height ${p.h} cm. Volume of a pyramid = `,
            A.math("\\frac{1}{3} \\times \\text{base area} \\times \\text{height}"),
            ".",
          ],
          ask: "Find its volume, in cm³.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.FORMULA",
              value: A.number(p.b * p.b * p.h),
              feedback: "A pyramid is a third of the prism with the same base and height.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{3} \\times ${p.b * p.b} \\times ${p.h} = ${v} \\text{ cm}^3`,
            },
          ],
        });
      }
      case 2: {
        const [r, h, l] = TRIPLES[p.t] ?? [3, 4, 5];
        const v = r1(Math.PI * r * l);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A cone has base radius ${r} cm and perpendicular height ${h} cm. Curved surface area of a cone = `,
                A.math("\\pi r l"),
                ", where l is the slant height.",
              ],
              ask: "Find the curved surface area, in cm², to 1 decimal place.",
            },
            {
              question: [
                `A party hat is a cone with radius ${r} cm and height ${h} cm. Curved surface area = `,
                A.math("\\pi r l"),
                ".",
              ],
              ask: "How much card is needed for the curved surface, in cm², to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.SLANT",
              value: A.number(r1(Math.PI * r * h), { accuracy: { dp: 1 } }),
              feedback: `l is the slant height, not the perpendicular height. By Pythagoras, l = √(${r}² + ${h}²) = ${l}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `l = \\sqrt{${r}^2 + ${h}^2} = ${l}, \\; \\pi \\times ${r} \\times ${l} = ${v} \\text{ cm}^2`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "A cone has one third of the volume of a cylinder with the same base and height.",
          ],
          truth: "always",
          reasons: [
            { text: "Always. V = ⅓πr²h for the cone and πr²h for the cylinder.", correct: true },
            {
              text: "Sometimes. Only when the height equals the radius.",
              code: "MEA.VOLUME.FORMULA",
            },
            { text: "Never. A cone has half the volume.", code: "MEA.VOLUME.FORMULA" },
          ],
          solution: [{ say: "The same is true of a pyramid and a prism." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.b * p.b * p.h) / 3;
    if (question.key.depth === 2) {
      const [r, , l] = TRIPLES[p.t] ?? [3, 4, 5];
      return numberAnswer(question) === r1(Math.PI * r * l);
    }
    return true;
  },
});
