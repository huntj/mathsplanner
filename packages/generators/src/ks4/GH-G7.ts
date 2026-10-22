/**
 * @statement GH-G7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G7: Enlarge with negative scale factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  enlarge,
  inRange,
  placeShape,
  shapeClearOfOrigin,
  shapesGrid,
} from "../shared/pos.ts";

interface Params {
  shape: Coord[];
  centre: Coord;
  k: -1 | -2;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "GH-G7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.ENLARGE.NEGATIVE", "POS.ENLARGE.CENTRE"],

  params(rng) {
    const centre: Coord = [rng.int(-2, 2), rng.int(-2, 2)];
    const shape = placeShape(rng, centre[0] + rng.int(1, 2), centre[1] + rng.int(1, 2));
    const k = rng.pick([-1, -2] as const);
    const image = enlarge(shape, k, centre);
    if (!inRange(shape, -8, 8) || !inRange(image, -8, 8)) reject("both shapes on the grid");
    if (
      !shapeClearOfOrigin(shape) ||
      !shapeClearOfOrigin(image) ||
      (centre[0] >= -1 && centre[0] <= 0 && centre[1] >= -1 && centre[1] <= 0)
    )
      reject("shapes and centre clear of the origin label");
    return { shape, centre, k, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const image = enlarge(p.shape, p.k, p.centre);
    const P = p.shape[0] as Coord;
    const grid = (withImage: boolean) =>
      shapesGrid(
        -8,
        8,
        [
          { vertices: p.shape, label: "A" },
          ...(withImage ? [{ vertices: image, label: "B", shaded: false }] : []),
        ],
        withImage
          ? "Shape A and its image B on a coordinate grid, with the centre of enlargement marked."
          : "Shape A on a coordinate grid, with the centre of enlargement marked.",
        {
          points: [{ at: p.centre, label: "C" }],
        },
      );
    switch (depth) {
      case 1: {
        const right = enlarge([P], p.k, p.centre)[0] as Coord;
        return A.choice({
          rng,
          question: [
            `Shape A is enlarged by scale factor ${p.k}, centre C`,
            A.math(coord(p.centre)),
            ".",
            A.figure(grid(false)),
          ],
          ask: ["Where does the vertex ", A.math(coord(P)), " move to?"],
          correct: A.math(coord(right)),
          distractors: [
            {
              content: A.math(coord(enlarge([P], -p.k, p.centre)[0] as Coord)),
              code: "POS.ENLARGE.NEGATIVE",
              feedback: "A negative scale factor puts the image on the other side of the centre.",
            },
            {
              content: A.math(coord([p.k * P[0], p.k * P[1]])),
              code: "POS.ENLARGE.CENTRE",
              feedback: "Measure from the centre of enlargement, not from the origin.",
            },
          ].filter(distinctFrom(A.math(coord(right)))),
          solution: [
            {
              say: `From C to the vertex is ${coord([P[0] - p.centre[0], P[1] - p.centre[1]])}. Multiply by ${p.k}: ${coord([p.k * (P[0] - p.centre[0]), p.k * (P[1] - p.centre[1])])}, then add to C: ${coord(right)}.`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Shape B is an enlargement of shape A, centre C.", A.figure(grid(true))],
          ask: "What is the scale factor?",
          correct: A.math(String(p.k)),
          distractors: [
            {
              content: A.math(String(-p.k)),
              code: "POS.ENLARGE.NEGATIVE",
              feedback:
                "B is on the opposite side of C and upside down, so the scale factor is negative.",
            },
            {
              content: A.math(p.k === -1 ? "-2" : "-\\frac{1}{2}"),
              code: "POS.ENLARGE.NEGATIVE",
              feedback:
                p.k === -1
                  ? "B is the same size as A, so the size of the scale factor is 1."
                  : "B is bigger than A, so the scale factor is more than 1 in size.",
            },
          ],
          solution: [
            {
              say: `B is ${Math.abs(p.k) === 1 ? "the same size as" : "twice as big as"} A and on the opposite side of C, so the scale factor is ${p.k}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Ben says an enlargement with scale factor −1 has the same effect as a rotation of 180° about the centre of enlargement."
            : "Ben says an enlargement with scale factor −1 has the same effect as a reflection in a line through the centre of enlargement.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. Each point goes to the same distance on the opposite side of the centre, which is a half-turn.",
                  correct: true,
                },
                { text: "False. It makes the shape smaller.", code: "POS.ENLARGE.NEGATIVE" },
                { text: "False. It reflects the shape." },
              ]
            : [
                {
                  text: "False. Scale factor −1 sends each point through the centre to the other side: a rotation of 180°, not a reflection.",
                  correct: true,
                },
                {
                  text: "True. A negative scale factor flips the shape over.",
                  code: "POS.ENLARGE.NEGATIVE",
                },
                { text: "True. It leaves the shape where it is." },
              ],
          solution: [
            {
              say: "Scale factor −1 keeps the size and turns the shape upside down about the centre.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(
        coord(enlarge([p.shape[0] as Coord], p.k, p.centre)[0] as Coord),
      );
    return true;
  },
});
