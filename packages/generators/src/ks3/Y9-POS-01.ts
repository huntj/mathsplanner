/**
 * @statement Y9-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-POS-01: Understand and use enlargement, including with fractional and negative scale factors as
// an extension
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  enlarge,
  inRange,
  sameShape,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";

interface Params {
  shape: number;
  k: number;
  centre: Coord;
  /** The shape's bottom-left corner. */
  at: Coord;
  side: number;
}

const MAX = 12;

export default defineGenerator<Params>({
  id: "Y9-POS-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["POS.ENLARGE.ADD", "POS.ENLARGE.CENTRE", "POS.TRANSFORM.CHANGES-SHAPE"],

  params(rng, numbers) {
    const shape = rng.int(0, SHAPES.length - 1);
    const k = numbers === "friendly" ? 2 : rng.int(2, 3);
    const centre: Coord = [rng.int(0, 3), rng.int(0, 3)];
    const at: Coord = [centre[0] + rng.int(1, 2), centre[1] + rng.int(0, 2)];
    const s = translate(SHAPES[shape] as Coord[], at[0], at[1]);
    if (!inRange(enlarge(s, k, centre), 0, MAX)) reject("an image on the grid");
    // The image from the origin (the misconception) must differ from the true image and fit too.
    if ((centre[0] === 0 && centre[1] === 0) || !inRange(enlarge(s, k, [0, 0]), 0, MAX))
      reject("a centre other than the origin, both images on the grid");
    return { shape, k, centre, at, side: rng.int(3, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.at[0], p.at[1]);
    const img = enlarge(s, p.k, p.centre);
    const fromOrigin = enlarge(s, p.k, [0, 0]);
    switch (depth) {
      case 1:
        return A.standard({
          question: `A triangle has a side ${p.side} cm long. It is enlarged by scale factor ${p.k}.`,
          ask: "How long is that side on the image?",
          answer: A.number(p.side * p.k, { units: "cm" }),
          wrong: wrongs(p.side * p.k, [
            {
              code: "POS.ENLARGE.ADD",
              value: A.number(p.side + p.k, { units: "cm" }),
              feedback: `Scale factor ${p.k} multiplies every length by ${p.k}.`,
            },
          ]),
          solution: [{ say: `${p.side} × ${p.k} = ${p.side * p.k} cm.` }],
        });
      case 2: {
        const a = s[0] as Coord;
        const a2 = img[0] as Coord;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Point A ",
            A.math(coord(a)),
            ` is a corner of a shape. The shape is enlarged by scale factor ${p.k} with centre `,
            A.math(coord(p.centre)),
            ".",
          ],
          ask: "Where is the image of A?",
          correct: A.math(coord(a2)),
          distractors: [
            {
              content: A.math(coord(fromOrigin[0] as Coord)),
              code: "POS.ENLARGE.CENTRE",
              feedback: "Measure from the centre of enlargement, not from the origin.",
            },
            {
              content: A.math(coord([a[0] + p.k, a[1] + p.k])),
              code: "POS.ENLARGE.ADD",
              feedback: `Multiply the distance from the centre by ${p.k}; do not add ${p.k}.`,
            },
            {
              content: A.math(coord([p.centre[0] + p.k * (a[0] - p.centre[0]) + 1, a2[1]])),
              feedback: "Check the distance across from the centre again.",
            },
          ].filter(distinctFrom(A.math(coord(a2)))),
          solution: [
            {
              say: `From the centre, A is ${a[0] - p.centre[0]} across and ${a[1] - p.centre[1]} up. Multiply by ${p.k}: ${p.k * (a[0] - p.centre[0])} across and ${p.k * (a[1] - p.centre[1])} up from the centre, at ${coord(a2)}.`,
            },
          ],
        });
      }
      case 3: {
        const [s0, i0] = [s[0] as Coord, img[0] as Coord];
        return A.chooseTheDiagram({
          rng,
          question: [
            `Which grid shows the shaded shape enlarged by scale factor ${p.k} with centre C?`,
          ],
          correct: {
            ...shapesGrid(
              0,
              MAX,
              [{ vertices: s }, { vertices: img, dashed: true, shaded: false }],
              "A shaded shape, a centre C and an image on a coordinate grid.",
            ),
            points: [{ at: p.centre, label: "C" }],
          },
          distractors: [
            ...(sameShape(fromOrigin, img)
              ? []
              : [
                  {
                    figure: {
                      ...shapesGrid(
                        0,
                        MAX,
                        [{ vertices: s }, { vertices: fromOrigin, dashed: true, shaded: false }],
                        "A shaded shape, a centre C and an image on a coordinate grid.",
                      ),
                      points: [{ at: p.centre, label: "C" }],
                    } as CartesianSpec,
                    code: "POS.ENLARGE.CENTRE",
                    feedback:
                      "That image is the right size but was enlarged from the origin, not from C.",
                  },
                ]),
            {
              figure: {
                ...shapesGrid(
                  0,
                  MAX,
                  [
                    { vertices: s },
                    {
                      vertices: translate(s, i0[0] - s0[0], i0[1] - s0[1]),
                      dashed: true,
                      shaded: false,
                    },
                  ],
                  "A shaded shape, a centre C and an image on a coordinate grid.",
                ),
                points: [{ at: p.centre, label: "C" }],
              } as CartesianSpec,
              code: "POS.TRANSFORM.CHANGES-SHAPE",
              feedback: `That image is in the right place but has not been made ${p.k} times as big.`,
            },
          ],
          solution: [
            { say: `Draw lines from C through each corner and go ${p.k} times as far from C.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Nina says that enlarging a shape by scale factor ½ makes it bigger, because it is an enlargement.`,
          truth: false,
          reasons: [
            {
              text: "False. A scale factor between 0 and 1 makes every length smaller: scale factor ½ halves them.",
              correct: true,
            },
            { text: "True. Enlargements always make shapes bigger.", code: "POS.ENLARGE.ADD" },
            { text: "True. You add ½ to every length.", code: "POS.ENLARGE.ADD" },
          ],
          solution: [
            {
              say: "Every length is multiplied by the scale factor, so ½ halves them. The angles stay the same.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const s = translate(SHAPES[p.shape] as Coord[], p.at[0], p.at[1]);
    const img = enlarge(s, p.k, p.centre);
    if (question.archetype === "standard") return numberAnswer(question) === p.side * p.k;
    if (question.archetype === "varied-form")
      return chosenText(question).includes(coord(img[0] as Coord));
    if (question.archetype === "choose-the-diagram")
      return sameShape(
        (chosenFigure(question) as CartesianSpec | undefined)?.polygons?.[1]?.vertices ?? [],
        img,
      );
    return true;
  },
});
