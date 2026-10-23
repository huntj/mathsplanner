/**
 * @statement Y6-MEA-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-06: Calculate the area of parallelograms and triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { parallelogram, SLANTS, triangle } from "../shared/mea.ts";

export interface Params {
  base: number;
  slant: number;
  base2: number;
}

const stated = (g: GeometrySpec | undefined) =>
  (g?.segments ?? []).slice(0, 2).map((s) => s.length ?? 0);

export default defineGenerator<Params>({
  id: "Y6-MEA-06",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF", "MEA.AREA.SLANT"],

  params(rng, numbers) {
    const slant = rng.int(0, numbers === "friendly" ? 3 : SLANTS.length - 1);
    const [offset, height] = SLANTS[slant] ?? [3, 4];
    const base = rng.int(offset + 2, offset + 10);
    if ((base * height) % 2 !== 0) reject("a whole-number triangle area");
    if (base > 3 * height || height > 2.5 * base) reject("a shape that is not too thin");
    const base2 = base + rng.pick([-2, 2]);
    if ((base2 * height) % 2 !== 0 || base2 <= offset)
      reject("a second triangle with a whole-number area");
    return { base, slant, base2 };
  },

  build(p, depth, rng): QuestionDraft {
    const [offset, height, side] = SLANTS[p.slant] ?? [3, 4, 5];
    const tri = (p.base * height) / 2;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(triangle(p.base, height, offset, side))],
          ask: "What is the area of the triangle?",
          answer: A.number(tri, { units: "cm²" }),
          wrong: wrongs(tri, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.base * height, { units: "cm²" }),
              feedback:
                "A triangle is half of a rectangle with the same base and height. Halve base × height.",
            },
            {
              code: "MEA.AREA.SLANT",
              value: A.number((p.base * side) / 2, { units: "cm²" }),
              feedback:
                "Use the perpendicular height (the dashed line at right angles to the base), not the sloping side.",
            },
          ]),
          solution: [{ say: `Area = ½ × base × height = ½ × ${p.base} × ${height} = ${tri} cm².` }],
        });
      case 2:
        return A.standard({
          question: [A.figure(parallelogram(p.base, height, offset, side))],
          ask: "What is the area of the parallelogram?",
          answer: A.number(p.base * height, { units: "cm²" }),
          wrong: wrongs(p.base * height, [
            {
              code: "MEA.AREA.SLANT",
              value: A.number(p.base * side, { units: "cm²" }),
              feedback: "Use the perpendicular height, not the sloping side.",
            },
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number((p.base * height) / 2, { units: "cm²" }),
              feedback:
                "Only a triangle is halved. A parallelogram rearranges into a rectangle: base × height.",
            },
          ]),
          solution: [
            {
              say: `Area = base × perpendicular height = ${p.base} × ${height} = ${p.base * height} cm².`,
            },
          ],
        });
      case 3: {
        const target = tri;
        return A.chooseTheDiagram({
          rng,
          question: [`Which triangle has an area of ${target} cm²?`],
          correct: triangle(p.base, height, offset),
          distractors: [
            ...(p.base * height !== target && (target * 2) % height === 0
              ? [
                  {
                    figure: triangle(
                      (target * 2) / height / 2,
                      height,
                      Math.min(offset, (target * 2) / height / 2 - 1),
                    ),
                    code: "MEA.AREA.TRIANGLE-HALF",
                    feedback: `Base × height is ${target} here, but a triangle's area is half that.`,
                  },
                ]
              : []),
            {
              figure: triangle(p.base2, height, offset),
              feedback: `½ × ${p.base2} × ${height} = ${(p.base2 * height) / 2} cm².`,
            },
          ].filter((d) => (d.figure.points.B?.[0] ?? 0) > (d.figure.points.C?.[0] ?? 0)),
          solution: [{ say: `½ × ${p.base} × ${height} = ${target} cm².` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A triangle and a parallelogram both have a base of ${p.base} cm and a perpendicular height of ${height} cm. Ella says they have the same area.`,
          truth: false,
          reasons: [
            {
              text: `False. The triangle is half of the parallelogram: ${tri} cm² against ${p.base * height} cm².`,
              correct: true,
            },
            {
              text: "True. Same base and height always means the same area.",
              code: "MEA.AREA.TRIANGLE-HALF",
            },
            { text: "True. Both use base × height.", code: "MEA.AREA.TRIANGLE-HALF" },
          ],
          solution: [
            {
              say: `Triangle: ½ × ${p.base} × ${height} = ${tri} cm². Parallelogram: ${p.base} × ${height} = ${p.base * height} cm².`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const [, height] = SLANTS[p.slant] ?? [3, 4];
    if (question.archetype === "choose-the-diagram") {
      const [b = 0, h = 0] = stated(chosenFigure(question) as GeometrySpec | undefined);
      return (b * h) / 2 === (p.base * height) / 2;
    }
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === (p.base * height) / 2 || n === p.base * height;
  },
});
