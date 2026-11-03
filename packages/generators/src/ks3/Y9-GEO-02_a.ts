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
import { orClaims } from "../shared/variety.ts";

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
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["Doubling every length of a prism doubles its surface area."],
              truth: "never",
              reasons: [
                {
                  text: "Never. Each face's area is multiplied by 2 × 2 = 4, so the surface area is multiplied by 4.",
                  correct: true,
                },
                {
                  text: "Always. Double the size, double the area.",
                  code: "RAT.SCALE.AREA-LINEAR",
                },
                { text: "Sometimes. Only for cubes.", code: "RAT.SCALE.AREA-LINEAR" },
              ],
              solution: [{ say: "Lengths ×2, areas ×4, volumes ×8." }],
            }),
          [
            {
              statement: "A cuboid is 2 cm by 3 cm by 4 cm. Gil says its surface area is 52 cm².",
              truth: true,
              right: "True. 2(2 × 3 + 2 × 4 + 3 × 4) = 2(6 + 8 + 12) = 52 cm².",
              wrong: [
                ["False. It is 24 cm³, its volume.", "MEA.SURFACE.VOLUME"],
                ["False. It is 26 cm², adding three faces.", "MEA.SURFACE.MISSING-FACES"],
              ],
            },
            {
              statement:
                "Zak finds the surface area of a triangular prism by adding the areas of its three rectangles.",
              truth: false,
              right:
                "False. A triangular prism has five faces: three rectangles and two triangles.",
              wrong: [
                [
                  "True. The triangles are the ends, which do not count.",
                  "MEA.SURFACE.MISSING-FACES",
                ],
                ["True. Surface area is length × width × height.", "MEA.SURFACE.VOLUME"],
              ],
            },
            {
              claim: "Two prisms with the same volume have the same surface area.",
              truth: "sometimes",
              right:
                "Sometimes. A 1 × 1 × 8 cuboid and a 2 × 2 × 2 cube both hold 8 cm³, with surface areas 34 cm² and 24 cm².",
              wrong: [
                ["Always. Volume decides surface area.", "MEA.SURFACE.VOLUME"],
                ["Never. They cannot have the same volume."],
              ],
            },
          ],
        );
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
