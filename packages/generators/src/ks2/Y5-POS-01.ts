/**
 * @statement Y5-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-POS-01: Identify, describe and represent the position of a shape following a reflection or
// translation, using the appropriate language, and know that the shape has not changed
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  inRange,
  reflectX,
  sameShape,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";

export interface Params {
  shape: number;
  x: number;
  y: number;
  /** The mirror line x = m. */
  m: number;
}

const MAX = 12;

export default defineGenerator<Params>({
  id: "Y5-POS-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "GEO.SYMMETRY.HALF-DISTANCE",
    "GEO.SYMMETRY.TRANSLATES",
    "POS.TRANSFORM.CHANGES-SHAPE",
    "ALG.COORD.ORDER",
  ],

  params(rng) {
    const shape = rng.int(0, SHAPES.length - 1);
    const x = rng.int(1, 5);
    const y = rng.int(1, 7);
    const m = rng.int(5, 8);
    const s = translate(SHAPES[shape] as Coord[], x, y);
    if (
      Math.max(...s.map((q) => q[0])) >= m ||
      !inRange(reflectX(s, m), 0, MAX - 1) ||
      !inRange(s, 0, MAX)
    )
      reject("a shape left of the mirror with its image on the grid");
    return { shape, x, y, m };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    const r = reflectX(s, p.m);
    const mirror = { verticals: [{ x: p.m, dashed: true }] };
    const a = s[0] as Coord;
    const a2 = r[0] as Coord;
    // The shape slid across the mirror without flipping, so its left edge sits where the image's does.
    const slid = translate(s, Math.min(...r.map((q) => q[0])) - Math.min(...s.map((q) => q[0])), 0);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The shape is reflected in the dashed mirror line.",
            A.figure({
              ...shapesGrid(
                0,
                MAX,
                [{ vertices: s }],
                "A shape and a vertical dashed mirror line on a coordinate grid.",
                mirror,
              ),
              points: [{ at: a, label: "A" }],
            }),
          ],
          ask: "What are the coordinates of the image of corner A?",
          correct: A.math(coord(a2)),
          distractors: [
            {
              content: A.math(coord([p.m, a[1]])),
              code: "GEO.SYMMETRY.HALF-DISTANCE",
              feedback: `A is ${p.m - a[0]} squares from the mirror, so its image is ${p.m - a[0]} squares on the other side.`,
            },
            {
              content: A.math(coord([2 * p.m - a[0] + 1, a[1]])),
              feedback: "Count the squares from the mirror line, not from the next line.",
            },
            {
              content: A.math(coord([a2[1], a2[0]])),
              code: "ALG.COORD.ORDER",
              feedback: "Across first, then up.",
            },
          ].filter(distinctFrom(A.math(coord(a2)))),
          solution: [
            {
              say: `A is ${p.m - a[0]} squares left of the mirror line x = ${p.m}, so its image is ${p.m - a[0]} squares right of it: ${coord(a2)}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.figure(
              shapesGrid(
                0,
                MAX,
                [
                  { vertices: s, label: "P" },
                  { vertices: r, label: "Q" },
                ],
                "Two shapes, P and Q, either side of a dashed mirror line.",
                mirror,
              ),
            ),
          ],
          ask: "Shape P is reflected to give shape Q. Which is true?",
          correct: "Q is the same size and shape as P, but flipped over.",
          distractors: [
            {
              content: "Q is bigger than P.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
              feedback: "Reflecting does not change the size.",
            },
            {
              content: "Q is a different shape from P.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
              feedback: "Matching sides and angles are equal: it is the same shape.",
            },
            {
              content: "Q faces the same way as P.",
              code: "GEO.SYMMETRY.TRANSLATES",
              feedback: "A reflection flips the shape over, so it faces the other way.",
            },
          ],
          solution: [
            {
              say: "Reflections, like translations, keep the size and shape. A reflection flips it over the mirror line.",
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which grid shows the shape reflected in the dashed mirror line?"],
          correct: shapesGrid(
            0,
            MAX,
            [{ vertices: s }, { vertices: r, dashed: true }],
            "A shape, a vertical mirror line and another shape.",
            mirror,
          ),
          distractors: [
            ...(sameShape(slid, r)
              ? []
              : [
                  {
                    figure: shapesGrid(
                      0,
                      MAX,
                      [{ vertices: s }, { vertices: slid, dashed: true }],
                      "A shape, a vertical mirror line and another shape.",
                      mirror,
                    ),
                    code: "GEO.SYMMETRY.TRANSLATES",
                    feedback: "That shape has slid across without flipping over.",
                  },
                ]),
            {
              figure: shapesGrid(
                0,
                MAX,
                [{ vertices: s }, { vertices: translate(r, 1, 0), dashed: true }],
                "A shape, a vertical mirror line and another shape.",
                mirror,
              ),
              feedback:
                "Each corner of the image must be the same distance from the mirror as the original corner.",
            },
          ],
          solution: [
            {
              say: "Reflect each corner the same distance on the other side of the mirror, then join them.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(
              shapesGrid(
                0,
                MAX,
                [
                  { vertices: s, label: "P" },
                  { vertices: r, label: "Q" },
                ],
                "Two shapes, P and Q, either side of a dashed mirror line.",
                mirror,
              ),
            ),
            "Ali says Q is P translated to the right.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Q is P reflected in the mirror line: it is flipped over, so a slide could not move P onto Q.",
              correct: true,
            },
            {
              text: "True. Q is to the right of P and the same size.",
              code: "GEO.SYMMETRY.TRANSLATES",
            },
            {
              text: "True. Any shape on the other side of a line is a translation.",
              code: "GEO.SYMMETRY.TRANSLATES",
            },
          ],
          solution: [{ say: "Look at which way the shapes face: Q is a mirror image of P." }],
        });
    }
  },

  verify(p, question) {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    const r = reflectX(s, p.m);
    if (question.archetype === "standard")
      return chosenText(question).includes(coord(r[0] as Coord));
    if (question.archetype === "choose-the-diagram") {
      const g = chosenFigure(question) as CartesianSpec | undefined;
      return sameShape(g?.polygons?.[1]?.vertices ?? [], r);
    }
    return true;
  },
});
