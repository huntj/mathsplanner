/**
 * @statement Y4-POS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-POS-03: Plot specified points and draw sides to complete a given polygon
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { coord, distinctFrom, same, sameShape, shapesGrid } from "../shared/pos.ts";

interface Params {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Depth 2: a parallelogram's slant. */
  s: number;
}

const MAX = 10;

export default defineGenerator<Params>({
  id: "Y4-POS-03",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["ALG.COORD.ORDER"],

  params(rng, numbers) {
    const x = rng.int(1, 4);
    const y = rng.int(1, 4);
    const w = rng.int(2, numbers === "friendly" ? 4 : 6);
    const h = rng.int(2, numbers === "friendly" ? 4 : 5);
    const s = rng.int(1, 3);
    if (x + w + s > MAX || y + h > MAX || x === y || w === h) reject("a shape on the grid");
    return { x, y, w, h, s };
  },

  build(p, depth, rng): QuestionDraft {
    const rect: Coord[] = [
      [p.x, p.y],
      [p.x + p.w, p.y],
      [p.x + p.w, p.y + p.h],
      [p.x, p.y + p.h],
    ];
    const D = rect[3] as Coord;
    const points = (list: Coord[], names: string[]) =>
      list.map((at, i) => ({ at, label: names[i] ?? "" }));
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "A, B and C are three corners of a rectangle ABCD.",
            A.figure({
              ...shapesGrid(
                0,
                MAX,
                [],
                "A coordinate grid with three corners of a rectangle marked.",
              ),
              points: points(rect.slice(0, 3), ["A", "B", "C"]),
            }),
          ],
          ask: "What are the coordinates of D?",
          correct: A.math(coord(D)),
          distractors: [
            {
              content: A.math(coord([D[1], D[0]])),
              code: "ALG.COORD.ORDER",
              feedback: "Across first, then up.",
            },
            {
              content: A.math(coord([p.x + p.w, p.y + p.h + 1])),
              feedback: "D is level with C and straight above A.",
            },
            {
              content: A.math(coord([p.x - 1, p.y + p.h])),
              feedback: "D is straight above A, so it has the same x-coordinate as A.",
            },
          ].filter(distinctFrom(A.math(coord(D)))),
          solution: [
            { say: `D is above A (x = ${p.x}) and level with C (y = ${p.y + p.h}): ${coord(D)}.` },
          ],
        });
      case 2: {
        const par: Coord[] = [
          [p.x, p.y],
          [p.x + p.w, p.y],
          [p.x + p.w + p.s, p.y + p.h],
          [p.x + p.s, p.y + p.h],
        ];
        const d = par[3] as Coord;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A, B and C are three corners of a parallelogram ABCD: ",
            A.math(
              `A${coord(par[0] as Coord)},\\ B${coord(par[1] as Coord)},\\ C${coord(par[2] as Coord)}`,
            ),
            ".",
          ],
          ask: "What are the coordinates of D?",
          correct: A.math(coord(d)),
          distractors: [
            {
              content: A.math(coord([p.x, p.y + p.h])),
              feedback:
                "That would make a right angle at A. In a parallelogram, D moves across from A by the same amount C moves across from B.",
            },
            {
              content: A.math(coord([d[1], d[0]])),
              code: "ALG.COORD.ORDER",
              feedback: "Across first, then up.",
            },
            {
              content: A.math(coord([p.x + p.w + 2 * p.s, p.y + p.h])),
              feedback: "AD must be parallel to BC: from A, go the same way as from B to C.",
            },
          ].filter(distinctFrom(A.math(coord(d)))),
          solution: [
            { say: `From B to C is ${p.s} right and ${p.h} up. Do the same from A: ${coord(d)}.` },
          ],
        });
      }
      default: {
        const names = ["A", "B", "C", "D"];
        const list = rect.map((q, i) => `${names[i] ?? ""}${coord(q)}`).join(",\\ ");
        const swapped = rect.map((q, i) => (i === 2 ? ([q[1], q[0]] as Coord) : q));
        return A.chooseTheDiagram({
          rng,
          question: ["Which grid shows the shape with corners ", A.math(list), "?"],
          correct: shapesGrid(0, MAX, [{ vertices: rect }], "A shape drawn on a coordinate grid."),
          distractors: [
            ...(swapped[2] && swapped[2][0] <= MAX && swapped[2][1] <= MAX
              ? [
                  {
                    figure: shapesGrid(
                      0,
                      MAX,
                      [{ vertices: swapped }],
                      "A shape drawn on a coordinate grid.",
                    ),
                    code: "ALG.COORD.ORDER",
                    feedback: `One corner was plotted as ${coord(swapped[2])} instead of ${coord(rect[2] as Coord)}.`,
                  },
                ]
              : []),
            {
              figure: shapesGrid(
                0,
                MAX,
                [{ vertices: rect.map(([a, b]) => [a + 1, b] as Coord) }],
                "A shape drawn on a coordinate grid.",
              ),
              feedback: "Every corner of that shape is one square too far right.",
            },
          ],
          solution: [{ say: "Plot each point across then up, and join them in order." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question).includes(coord([p.x, p.y + p.h]));
    if (question.archetype === "varied-form")
      return chosenText(question).includes(coord([p.x + p.s, p.y + p.h]));
    const g = chosenFigure(question) as CartesianSpec | undefined;
    const v = g?.polygons?.[0]?.vertices ?? [];
    return (
      sameShape(v, [
        [p.x, p.y],
        [p.x + p.w, p.y],
        [p.x + p.w, p.y + p.h],
        [p.x, p.y + p.h],
      ]) && same(v[0] as Coord, [p.x, p.y])
    );
  },
});
