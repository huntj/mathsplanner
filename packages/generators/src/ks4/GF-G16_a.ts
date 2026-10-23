/**
 * @statement GF-G16.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G16.a: Find the area of triangles, parallelograms and trapezia
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { parallelogram, SLANTS, triangle } from "../shared/mea.ts";

interface Params {
  s: number;
  base: number;
  a: number;
  b: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "GF-G16.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF", "MEA.AREA.SLANT", "MEA.AREA.TRAPEZIUM-HALF"],

  params(rng) {
    const s = rng.int(0, SLANTS.length - 1);
    const [offset] = SLANTS[s] ?? [3, 4, 5];
    const p = {
      s,
      base: rng.int(offset + 2, offset + 10),
      a: rng.int(2, 9),
      b: rng.int(5, 14),
      h: rng.int(2, 9),
    };
    if (p.a >= p.b) reject("a longer bottom side");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [offset, height, slant] = SLANTS[p.s] ?? [3, 4, 5];
    switch (depth) {
      case 1: {
        const v = (p.base * height) / 2;
        return A.standard({
          question: [A.figure(triangle(p.base, height, offset, slant))],
          ask: "Find the area of the triangle, in cm².",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.base * height),
              feedback: "A triangle is half of a rectangle: halve base × height.",
            },
            {
              code: "MEA.AREA.SLANT",
              value: A.number((p.base * slant) / 2),
              feedback: `Use the perpendicular height, ${height} cm, not the sloping side.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2} \\times ${p.base} \\times ${height} = ${v} \\text{ cm}^2`,
            },
          ],
        });
      }
      case 2: {
        const v = p.base * height;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [A.figure(parallelogram(p.base, height, offset, slant))],
              ask: "Find the area of the parallelogram, in cm².",
            },
          ],
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
      default:
        return A.spotTheMistake({
          question: [
            `Raj finds the area of a trapezium with parallel sides ${p.a} cm and ${p.b} cm, ${p.h} cm apart.`,
          ],
          lines: [
            [A.math(`A = (${p.a} + ${p.b}) \\times ${p.h}`)],
            [A.math(`= ${(p.a + p.b) * p.h} \\text{ cm}^2`)],
          ],
          mistake: 0,
          code: "MEA.AREA.TRAPEZIUM-HALF",
          feedback: `The formula halves: ½ × (${p.a} + ${p.b}) × ${p.h} = ${((p.a + p.b) * p.h) / 2} cm².`,
        });
    }
  },

  verify(p, question) {
    const [, height] = SLANTS[p.s] ?? [3, 4, 5];
    if (question.key.depth === 1) return numberAnswer(question) === (p.base * height) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === p.base * height;
    return true;
  },
});
