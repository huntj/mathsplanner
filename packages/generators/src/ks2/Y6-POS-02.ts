/**
 * @statement Y6-POS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-POS-02: Draw and translate simple shapes on the coordinate plane, and reflect them in the axes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  inRange,
  moveWords,
  reflectX,
  reflectY,
  sameShape,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";

export interface Params {
  shape: number;
  x: number;
  y: number;
  /** Reflect in the x-axis (true) or the y-axis. */
  inX: boolean;
  dx: number;
  dy: number;
}

const R = 6;

export default defineGenerator<Params>({
  id: "Y6-POS-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["POS.REFLECT.WRONG-AXIS", "POS.TRANSLATE.DIRECTION", "ALG.COORD.ORDER"],

  params(rng) {
    const shape = rng.int(0, SHAPES.length - 1);
    const x = rng.int(1, 3);
    const y = rng.int(1, 3);
    const dx = rng.int(-6, -2);
    const dy = rng.int(-6, 2);
    const s = translate(SHAPES[shape] as Coord[], x, y);
    if (!inRange(s, -R, R) || !inRange(translate(s, dx, dy), -R, R) || dy === 0 || x === y)
      reject("shapes on the grid");
    return { shape, x, y, inX: rng.bool(), dx, dy };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    const a = s[0] as Coord;
    const axis = p.inX ? "x-axis" : "y-axis";
    const reflect = (shape: Coord[], inX: boolean) =>
      inX ? reflectY(shape, 0) : reflectX(shape, 0);
    const r = reflect(s, p.inX);
    const wrong = reflect(s, !p.inX);
    switch (depth) {
      case 1: {
        const a2 = r[0] as Coord;
        return A.choice({
          rng,
          question: ["Point A is at ", A.math(coord(a)), `. It is reflected in the ${axis}.`],
          ask: "What are the coordinates of its image?",
          correct: A.math(coord(a2)),
          distractors: [
            {
              content: A.math(coord(wrong[0] as Coord)),
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `Reflecting in the ${axis} flips the point ${p.inX ? "up or down, so the y-coordinate" : "left or right, so the x-coordinate"} changes sign.`,
            },
            {
              content: A.math(coord([-a[0], -a[1]])),
              feedback: "Only one coordinate changes sign in a reflection in an axis.",
            },
            {
              content: A.math(coord([a[1], a[0]])),
              code: "ALG.COORD.ORDER",
              feedback: "The coordinates do not swap places.",
            },
          ].filter(distinctFrom(A.math(coord(a2)))),
          solution: [
            {
              say: `In the ${axis}, the point stays the same distance from the axis on the other side: ${coord(a2)}.`,
            },
          ],
        });
      }
      case 2: {
        const t = translate(s, p.dx, p.dy);
        const a2 = t[0] as Coord;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.figure({
              ...shapesGrid(
                -R,
                R,
                [{ vertices: s }],
                "A shape on a coordinate grid with corner A marked.",
              ),
              points: [{ at: a, label: "A" }],
            }),
            `The shape is translated ${moveWords(p.dx, p.dy)}.`,
          ],
          ask: "Where does corner A move to?",
          correct: A.math(coord(a2)),
          distractors: [
            {
              content: A.math(coord([a[0] - p.dx, a[1] + p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Left takes away from the x-coordinate.",
            },
            {
              content: A.math(coord([a[0] + p.dy, a[1] + p.dx])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Left and right change x; up and down change y.",
            },
            {
              content: A.math(coord([a[0] + p.dx, a[1] - p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: `${p.dy > 0 ? "Up adds to" : "Down takes away from"} the y-coordinate.`,
            },
          ].filter(distinctFrom(A.math(coord(a2)))),
          solution: [
            {
              say: `x: ${a[0]} − ${-p.dx} = ${a2[0]}. y: ${a[1]} ${p.dy > 0 ? "+" : "−"} ${Math.abs(p.dy)} = ${a2[1]}. So ${coord(a2)}.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which grid shows the shaded shape reflected in the ${axis}?`],
          correct: shapesGrid(
            -R,
            R,
            [{ vertices: s }, { vertices: r, dashed: true, shaded: false }],
            "A shaded shape and its image on a coordinate grid.",
          ),
          distractors: [
            {
              figure: shapesGrid(
                -R,
                R,
                [{ vertices: s }, { vertices: wrong, dashed: true, shaded: false }],
                "A shaded shape and its image on a coordinate grid.",
              ),
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `That is a reflection in the ${p.inX ? "y-axis" : "x-axis"}.`,
            },
            {
              figure: shapesGrid(
                -R,
                R,
                [{ vertices: s }, { vertices: reflect(r, !p.inX), dashed: true, shaded: false }],
                "A shaded shape and its image on a coordinate grid.",
              ),
              feedback: "That is a half turn about the origin, not a reflection.",
            },
          ],
          solution: [
            { say: `Each corner moves to the same distance on the other side of the ${axis}.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jas says that reflecting a point in the x-axis changes the sign of its x-coordinate, so ",
            A.math(coord(a)),
            " goes to ",
            A.math(coord([-a[0], a[1]])),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Reflecting in the x-axis flips the point up or down, so the y-coordinate changes sign: ${coord([a[0], -a[1]])}.`,
              correct: true,
            },
            { text: "True. The x-axis changes the x-coordinate.", code: "POS.REFLECT.WRONG-AXIS" },
            { text: "True. Both coordinates change sign in a reflection." },
          ],
          solution: [
            {
              say: "The x-axis is horizontal, so a reflection in it moves points vertically: x stays, y changes sign.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const s = translate(SHAPES[p.shape] as Coord[], p.x, p.y);
    const r = p.inX ? reflectY(s, 0) : reflectX(s, 0);
    if (question.archetype === "standard")
      return chosenText(question).includes(coord(r[0] as Coord));
    if (question.archetype === "varied-form")
      return chosenText(question).includes(coord(translate(s, p.dx, p.dy)[0] as Coord));
    if (question.archetype === "choose-the-diagram")
      return sameShape(
        (chosenFigure(question) as CartesianSpec | undefined)?.polygons?.[1]?.vertices ?? [],
        r,
      );
    return true;
  },
});
