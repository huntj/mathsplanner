/**
 * @statement Y7-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-01.a: Find the perimeter of triangles, parallelograms and trapezia
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelogram, SLANTS } from "../shared/mea.ts";

interface Params {
  s: number;
  base: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.PERIMETER.AREA", "MEA.PERIMETER.MISSING-SIDES", "MEA.AREA.SAME-PERIMETER"],

  params(rng) {
    const s = rng.int(0, 3);
    const [offset] = SLANTS[s] ?? [3, 4, 5];
    return { s, base: rng.int(offset + 3, offset + 10), a: rng.int(5, 15), b: rng.int(4, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [offset, height, slant] = SLANTS[p.s] ?? [3, 4, 5];
        const v = 2 * (p.base + slant);
        return A.standard({
          question: [A.figure(parallelogram(p.base, height, offset, slant))],
          ask: "Find the perimeter of the parallelogram, in cm.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(p.base + slant),
              feedback: "A parallelogram has four sides: two of each length.",
            },
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(p.base * height),
              feedback: "That is the area. The perimeter is the distance around the edge.",
            },
          ]),
          solution: [
            {
              say: "The dashed height is not part of the edge: ",
              math: `2 \\times (${p.base} + ${slant}) = ${v} \\text{ cm}`,
            },
          ],
        });
      }
      case 2: {
        const v = 2 * p.a + p.b;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `An isosceles triangle has two sides of ${p.a} cm and a base of ${p.b} cm.`,
              ],
              ask: "Find its perimeter, in cm.",
            },
            {
              question: [
                `A triangular flower bed has two equal sides of ${p.a} m and a third side of ${p.b} m.`,
              ],
              ask: "How much edging is needed to go all the way round, in m?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(p.a + p.b),
              feedback: `There are two sides of ${p.a}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} + ${p.a} + ${p.b} = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A shape with a bigger area also has a bigger perimeter."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. A 1 by 10 rectangle has area 10 and perimeter 22, but a 4 by 4 square has a bigger area, 16, and a smaller perimeter, 16.",
              correct: true,
            },
            { text: "Always. Bigger shapes go further round.", code: "MEA.AREA.SAME-PERIMETER" },
            {
              text: "Never. Area and perimeter go in opposite directions.",
              code: "MEA.AREA.SAME-PERIMETER",
            },
          ],
          solution: [{ say: "Area and perimeter measure different things." }],
        });
    }
  },

  verify(p, question) {
    const [, , slant] = SLANTS[p.s] ?? [3, 4, 5];
    if (question.key.depth === 1) return numberAnswer(question) === 2 * (p.base + slant);
    if (question.key.depth === 2) return numberAnswer(question) === 2 * p.a + p.b;
    return true;
  },
});
