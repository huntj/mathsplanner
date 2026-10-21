/**
 * @statement Y8-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-POS-01: Identify properties of, and describe the results of, translations, rotations and
// reflections applied to given figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import {
  coord,
  inRange,
  reflectX,
  reflectY,
  rotate,
  sameShape,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";

interface Params {
  shape: number;
  x: number;
  y: number;
  /** Depth 2: which transformation maps A onto B. */
  kind: number;
  p: Coord;
}

const R = 6;
const KINDS = [
  "a rotation of 90° clockwise about the origin",
  "a rotation of 90° anticlockwise about the origin",
  "a rotation of 180° about the origin",
  "a reflection in the y-axis",
  "a reflection in the x-axis",
];
/** Whether a shape stays clear of the "O" label just below and left of the origin. */
const clearOfOrigin = (v: Coord[]) => {
  const xs = v.map((q) => q[0]);
  const ys = v.map((q) => q[1]);
  return !(
    Math.min(...xs) <= 0 &&
    Math.max(...xs) >= -1 &&
    Math.min(...ys) <= 0 &&
    Math.max(...ys) >= -1
  );
};
const apply = (s: Coord[], kind: number): Coord[] =>
  kind === 0
    ? rotate(s, 1)
    : kind === 1
      ? rotate(s, 3)
      : kind === 2
        ? rotate(s, 2)
        : kind === 3
          ? reflectX(s, 0)
          : reflectY(s, 0);

export default defineGenerator<Params>({
  id: "Y8-POS-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "GEO.TURNS.DIRECTION",
    "POS.ROTATE.CENTRE",
    "POS.REFLECT.WRONG-AXIS",
    "POS.TRANSFORM.CHANGES-SHAPE",
  ],

  params(rng) {
    const shape = rng.int(0, SHAPES.length - 1);
    const x = rng.int(1, 3);
    const y = rng.int(1, 3);
    const s = translate(SHAPES[shape] as Coord[], x, y);
    if (!inRange(s, -R, R) || x === y) reject("a shape in the first quadrant");
    const p: Coord = [rng.int(1, 5), rng.int(1, 5)];
    if (p[0] === p[1]) reject("a point off the diagonal");
    return { shape, x, y, kind: rng.int(0, KINDS.length - 1), p };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    switch (depth) {
      case 1: {
        const [x, y] = p.p;
        const right = coord([y, -x]);
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord(p.p)),
            " is rotated 90° clockwise about the origin.",
          ],
          ask: "Where does it go?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([-y, x])),
              code: "GEO.TURNS.DIRECTION",
              feedback: "That is 90° anticlockwise. Clockwise turns the way a clock's hands go.",
            },
            { content: A.math(coord([-x, -y])), feedback: "That is a half turn, 180°." },
            {
              content: A.math(coord([y, x])),
              feedback:
                "Swapping the coordinates is a reflection in the line y = x, not a rotation.",
            },
          ],
          solution: [
            {
              say: `A quarter turn clockwise about the origin takes (x, y) to (y, −x): ${right}. Check with tracing paper.`,
            },
          ],
        });
      }
      case 2: {
        const b = apply(s, p.kind);
        const others = KINDS.map((_, i) => i).filter(
          (i) => i !== p.kind && !sameShape(apply(s, i), b),
        );
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.figure(
              shapesGrid(
                -R,
                R,
                [
                  { vertices: s, label: "A" },
                  { vertices: b, label: "B" },
                ],
                "Two congruent shapes, A and B, on a coordinate grid.",
              ),
            ),
          ],
          ask: "Describe the single transformation that maps shape A onto shape B.",
          correct: KINDS[p.kind] ?? "",
          distractors: others.slice(0, 3).map((i) => ({
            content: KINDS[i] ?? "",
            ...((p.kind === 0 && i === 1) || (p.kind === 1 && i === 0)
              ? { code: "GEO.TURNS.DIRECTION" }
              : (p.kind === 3 && i === 4) || (p.kind === 4 && i === 3)
                ? { code: "POS.REFLECT.WRONG-AXIS" }
                : {}),
            feedback: "Try it with tracing paper: does that move A exactly onto B?",
          })),
          solution: [{ say: `B is ${KINDS[p.kind] ?? ""} of A. Every side keeps its length.` }],
        });
      }
      case 3: {
        const half = rotate(s, 2);
        const corner = s[0] as Coord;
        const aboutCorner = rotate(s, 2, corner);
        return A.chooseTheDiagram({
          rng,
          question: ["Which grid shows the shaded shape rotated 180° about the origin?"],
          correct: shapesGrid(
            -R,
            R,
            [{ vertices: s }, { vertices: half, dashed: true, shaded: false }],
            "A shaded shape and its image on a coordinate grid.",
          ),
          distractors: [
            ...(inRange(aboutCorner, -R, R) && clearOfOrigin(aboutCorner)
              ? [
                  {
                    figure: shapesGrid(
                      -R,
                      R,
                      [{ vertices: s }, { vertices: aboutCorner, dashed: true, shaded: false }],
                      "A shaded shape and its image on a coordinate grid.",
                    ),
                    code: "POS.ROTATE.CENTRE",
                    feedback: "That shape was turned about one of its own corners, not the origin.",
                  },
                ]
              : []),
            {
              figure: shapesGrid(
                -R,
                R,
                [{ vertices: s }, { vertices: reflectY(s, 0), dashed: true, shaded: false }],
                "A shaded shape and its image on a coordinate grid.",
              ),
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: "That is a reflection in the x-axis, which flips the shape over.",
            },
          ],
          solution: [{ say: "A half turn about the origin takes each point (x, y) to (−x, −y)." }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim:
            "After a rotation, reflection or translation, the image is congruent to the original shape.",
          truth: "always",
          reasons: [
            {
              text: "Always. These transformations move or flip a shape but keep every length and angle.",
              correct: true,
            },
            {
              text: "Sometimes. Rotations can stretch a shape.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
            {
              text: "Never. A reflected shape faces the other way, so it is a different shape.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
          ],
          solution: [
            {
              say: "Congruent means the same size and shape. Turning a shape over does not change that.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    if (question.archetype === "standard")
      return chosenText(question).includes(coord([p.p[1], -p.p[0]]));
    if (question.archetype === "varied-form") return chosenText(question) === KINDS[p.kind];
    if (question.archetype === "choose-the-diagram")
      return sameShape(
        (chosenFigure(question) as CartesianSpec | undefined)?.polygons?.[1]?.vertices ?? [],
        rotate(s, 2),
      );
    return true;
  },
});
