/**
 * @statement Y9-GEO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-GEO-02.a: Calculate the surface area of prisms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
];

interface Params {
  l: number;
  w: number;
  h: number;
  t: number;
  len: number;
}

export default defineGenerator<Params>({
  id: "Y9-GEO-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.SURFACE.MISSING-FACES", "MEA.SURFACE.VOLUME", "RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    const p = {
      l: rng.int(3, 12),
      w: rng.int(2, 8),
      h: rng.int(2, 8),
      t: rng.int(0, TRIPLES.length - 1),
      len: rng.int(5, 20),
    };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 2 * (p.l * p.w + p.l * p.h + p.w * p.h);
        return A.standard({
          question: [A.figure(cuboid(p.l, p.w, p.h))],
          ask: "Find the total surface area of the cuboid, in cm².",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.SURFACE.MISSING-FACES",
              value: A.number(v / 2),
              feedback:
                "A cuboid has six faces: each one you can see has a matching face behind it.",
            },
            {
              code: "MEA.SURFACE.VOLUME",
              value: A.number(p.l * p.w * p.h),
              feedback: "That is the volume. Surface area adds the areas of the faces.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `2(${p.l} \\times ${p.w} + ${p.l} \\times ${p.h} + ${p.w} \\times ${p.h}) = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const [a, b, c] = TRIPLES[p.t] ?? [3, 4, 5];
        const ends = a * b;
        const sides = (a + b + c) * p.len;
        const v = ends + sides;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A triangular prism is ${p.len} cm long. Its ends are right-angled triangles with sides ${a} cm, ${b} cm and ${c} cm.`,
              ],
              ask: "Find its total surface area, in cm².",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.SURFACE.MISSING-FACES",
              value: A.number(sides),
              feedback: `Include the two triangular ends: 2 × ½ × ${a} × ${b} = ${ends} cm².`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `2 \\times \\tfrac{1}{2} \\times ${a} \\times ${b} + (${a} + ${b} + ${c}) \\times ${p.len} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Doubling every length of a prism doubles its surface area."],
          truth: "never",
          reasons: [
            {
              text: "Never. Each face's area is multiplied by 2 × 2 = 4, so the surface area is multiplied by 4.",
              correct: true,
            },
            { text: "Always. Double the size, double the area.", code: "RAT.SCALE.AREA-LINEAR" },
            { text: "Sometimes. Only for cubes.", code: "RAT.SCALE.AREA-LINEAR" },
          ],
          solution: [{ say: "Lengths ×2, areas ×4, volumes ×8." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === 2 * (p.l * p.w + p.l * p.h + p.w * p.h);
    if (question.key.depth === 2) {
      const [a, b, c] = TRIPLES[p.t] ?? [3, 4, 5];
      return numberAnswer(question) === a * b + (a + b + c) * p.len;
    }
    return true;
  },
});
