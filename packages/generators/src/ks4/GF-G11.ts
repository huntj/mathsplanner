/**
 * @statement GF-G11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G11: Solve geometrical problems on coordinate axes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  b: number;
  h: number;
  x0: number;
  a: Coord;
  u: Coord;
  w: Coord;
  t: [number, number, number];
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 6, 10],
];

export default defineGenerator<Params>({
  id: "GF-G11",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.AREA.TRIANGLE-HALF", "ALG.COORD.ORDER", "GEO.PYTHAG.NO-SQUARE"],

  params(rng) {
    const a: Coord = [rng.int(-5, 2), rng.int(-5, 2)];
    const u: Coord = [rng.int(2, 6), rng.int(-2, 2)];
    const w: Coord = [rng.int(-2, 2), rng.int(2, 6)];
    if (u[1] === 0 && w[0] === 0) reject("a slanted parallelogram");
    return {
      b: rng.int(3, 10),
      h: rng.int(2, 9),
      x0: rng.int(-6, 1),
      a,
      u,
      w,
      t: rng.pick(TRIPLES),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const P: Coord = [p.x0, 0];
        const Q: Coord = [p.x0 + p.b, 0];
        const R: Coord = [p.x0 + 1, p.h];
        const area = (p.b * p.h) / 2;
        return A.standard({
          question: [
            "A triangle has vertices ",
            A.math(`${coord(P)},\\ ${coord(Q)}\\text{ and }${coord(R)}`),
            ".",
          ],
          ask: "Work out its area.",
          answer: A.number(area, { units: "square units" }),
          wrong: wrongs(area, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.b * p.h),
              feedback: "Area of a triangle = ½ × base × height.",
            },
          ]),
          solution: [
            {
              say: `The base is along the x-axis: ${p.b} units. The height is the y-coordinate of the top vertex: ${p.h}. Area = ½ × ${p.b} × ${p.h} = ${area}.`,
            },
          ],
        });
      }
      case 2: {
        const B: Coord = [p.a[0] + p.u[0], p.a[1] + p.u[1]];
        const D: Coord = [p.a[0] + p.w[0], p.a[1] + p.w[1]];
        const C: Coord = [B[0] + p.w[0], B[1] + p.w[1]];
        const right = coord(C);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "ABCD is a parallelogram with ",
            A.math(`A${coord(p.a)},\\ B${coord(B)}\\text{ and }D${coord(D)}`),
            ".",
          ],
          ask: "What are the coordinates of C?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([C[1], C[0]])),
              code: "ALG.COORD.ORDER",
              feedback: "x first, then y.",
            },
            {
              content: A.math(coord([B[0] + D[0], B[1] + D[1]])),
              feedback: "C = B + (D − A): move from B the same way as from A to D.",
            },
            {
              content: A.math(coord([D[0] + p.u[0], B[1]])),
              feedback: "DC must be parallel and equal to AB.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            { say: `From A to D is (${p.w[0]}, ${p.w[1]}); do the same from B: ${right}.` },
          ],
        });
      }
      default: {
        const [x, y, d] = p.t;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mo says the distance between ",
                A.math(coord([0, 0])),
                " and ",
                A.math(coord([x, y])),
                ` is ${x + y}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Use Pythagoras: √(${x}² + ${y}²) = √${x * x + y * y} = ${d}.`,
                  correct: true,
                },
                { text: "True. Add the distances across and up.", code: "GEO.PYTHAG.NO-SQUARE" },
                { text: "True. Distance is the sum of the coordinates." },
              ],
              solution: [{ say: `The straight-line distance is the hypotenuse: ${d}.` }],
            }),
          [
            {
              statement: "Kai says the distance between (1, 1) and (4, 5) is 5.",
              truth: true,
              right: "True. Across 3 and up 4: √(3² + 4²) = √25 = 5.",
              wrong: [
                ["False. It is 7, as 3 + 4 = 7.", "GEO.PYTHAG.NO-SQUARE"],
                ["False. It is 25."],
              ],
            },
            {
              claim: "The distance between two points can be found with Pythagoras' theorem.",
              truth: "always",
              right: "Always. The horizontal and vertical differences make the two shorter sides.",
              wrong: [
                ["Never. Add the differences.", "GEO.PYTHAG.NO-SQUARE"],
                ["Sometimes. Only on the axes."],
              ],
            },
            {
              statement:
                "Pia says the area of the triangle with corners (0, 0), (6, 0) and (0, 4) is 24.",
              truth: false,
              right: "False. ½ × 6 × 4 = 12.",
              wrong: [
                ["True. 6 × 4 = 24.", "MEA.AREA.TRIANGLE-HALF"],
                ["True. Base times height.", "MEA.AREA.TRIANGLE-HALF"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === (p.b * p.h) / 2;
    if (question.archetype === "varied-form")
      return chosenText(question) === coord([p.a[0] + p.u[0] + p.w[0], p.a[1] + p.u[1] + p.w[1]]);
    return true;
  },
});
