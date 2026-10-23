/**
 * @statement GF-G17.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G17.c: Find the surface area and volume of spheres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G17.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.VOLUME.FORMULA", "MEA.CIRCLE.FORMULA", "MEA.SURFACE.MISSING-FACES"],

  params(rng) {
    return { r: rng.int(2, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1((4 / 3) * Math.PI * p.r ** 3);
        return A.standard({
          question: [
            `A sphere has radius ${p.r} cm. Volume of a sphere = `,
            A.math("\\frac{4}{3}\\pi r^3"),
            ".",
          ],
          ask: "Find its volume, in cm³, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.FORMULA",
              value: A.number(r1(4 * Math.PI * p.r ** 3), { accuracy: { dp: 1 } }),
              feedback: "The formula has ⁴⁄₃, not 4.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{4}{3} \\times \\pi \\times ${p.r}^3 = ${v} \\text{ cm}^3` },
          ],
        });
      }
      case 2: {
        const v = r1(4 * Math.PI * p.r ** 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A ball has radius ${p.r} cm. Surface area of a sphere = `,
                A.math("4\\pi r^2"),
                ".",
              ],
              ask: "Find its surface area, in cm², to 1 decimal place.",
            },
            {
              question: [
                `A spherical balloon has radius ${p.r} cm. Surface area of a sphere = `,
                A.math("4\\pi r^2"),
                ".",
              ],
              ask: "How much rubber covers it, in cm², to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(Math.PI * p.r ** 2), { accuracy: { dp: 1 } }),
              feedback: "πr² is the area of one circle. A sphere's surface is 4 times that.",
            },
          ]),
          solution: [{ say: "", math: `4 \\times \\pi \\times ${p.r}^2 = ${v} \\text{ cm}^2` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says the total surface area of a solid hemisphere of radius r is ",
            A.math("2\\pi r^2"),
            ", half of a sphere's.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A solid hemisphere also has a flat circular face, πr², so its total is 3πr².",
              correct: true,
            },
            { text: "True. A hemisphere is half a sphere.", code: "MEA.SURFACE.MISSING-FACES" },
            { text: "False. It is 4πr², the same as a sphere.", code: "MEA.SURFACE.MISSING-FACES" },
          ],
          solution: [{ say: "", math: `2\\pi r^2 + \\pi r^2 = 3\\pi r^2` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1((4 / 3) * Math.PI * p.r ** 3);
    if (question.key.depth === 2) return numberAnswer(question) === r1(4 * Math.PI * p.r ** 2);
    return true;
  },
});
