/**
 * @statement Y7-GEO-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-01.c: Find the area of parallelograms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelogram, SLANTS } from "../shared/mea.ts";

interface Params {
  s: number;
  base: number;
  b2: number;
  h2: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-01.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.SLANT", "MEA.AREA.TRIANGLE-HALF"],

  params(rng) {
    const s = rng.int(0, SLANTS.length - 1);
    const [offset] = SLANTS[s] ?? [3, 4, 5];
    return { s, base: rng.int(offset + 2, offset + 9), b2: rng.int(4, 15), h2: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [offset, height, slant] = SLANTS[p.s] ?? [3, 4, 5];
        const v = p.base * height;
        return A.standard({
          question: [A.figure(parallelogram(p.base, height, offset, slant))],
          ask: "Find the area of the parallelogram, in cm².",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.SLANT",
              value: A.number(p.base * slant),
              feedback: `Use the perpendicular height, ${height} cm, not the sloping side.`,
            },
          ]),
          solution: [{ say: "", math: `${p.base} \\times ${height} = ${v} \\text{ cm}^2` }],
        });
      }
      case 2: {
        const area = p.b2 * p.h2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A parallelogram has area ${area} cm² and perpendicular height ${p.h2} cm.`,
              ],
              ask: "Find the length of its base, in cm.",
            },
          ],
          answer: A.number(p.b2),
          wrong: wrongs(p.b2, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number((2 * area) / p.h2),
              feedback: "A parallelogram's area is base × height, with no half.",
            },
          ]),
          solution: [{ say: "", math: `${area} \\div ${p.h2} = ${p.b2} \\text{ cm}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "A parallelogram has the same area as a rectangle with the same base and perpendicular height.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. Cut the triangle off one end and move it to the other: the parallelogram becomes that rectangle.",
              correct: true,
            },
            { text: "Sometimes. Only when the sides are not too slanted.", code: "MEA.AREA.SLANT" },
            { text: "Never. The slanted sides make it bigger.", code: "MEA.AREA.SLANT" },
          ],
          solution: [{ say: "Area = base × perpendicular height for both." }],
        });
    }
  },

  verify(p, question) {
    const [, height] = SLANTS[p.s] ?? [3, 4, 5];
    if (question.key.depth === 1) return numberAnswer(question) === p.base * height;
    if (question.key.depth === 2) return numberAnswer(question) === p.b2;
    return true;
  },
});
