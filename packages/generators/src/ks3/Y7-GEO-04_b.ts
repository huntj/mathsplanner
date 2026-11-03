/**
 * @statement Y7-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-04.b: Recognise reflective and rotational symmetry in polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

/** [shape, lines of symmetry, a wrong count from the diagonals]. */
const LINES: [string, number, number][] = [
  ["a rectangle (not a square)", 2, 4],
  ["a parallelogram (not a rectangle or rhombus)", 0, 2],
  ["a kite", 1, 2],
];
/** [shape, order of rotational symmetry, a wrong order]. */
const ORDERS: [string, number, number][] = [
  ["a parallelogram (not a rectangle or rhombus)", 2, 0],
  ["a kite", 1, 0],
  ["an isosceles triangle", 1, 0],
  ["a rectangle (not a square)", 2, 4],
  ["an equilateral triangle", 3, 1],
];

interface Params {
  l: number;
  o: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-04.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SYMMETRY.DIAGONAL", "GEO.SYMMETRY.ROTATION-LINES"],

  params(rng) {
    return { l: rng.int(0, LINES.length - 1), o: rng.int(0, ORDERS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [shape, v, w] = LINES[p.l] ?? ["a kite", 1, 2];
        return A.standard({
          question: [`How many lines of symmetry does ${shape} have?`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "GEO.SYMMETRY.DIAGONAL",
              value: A.number(w),
              feedback:
                "A diagonal is only a line of symmetry if folding along it makes the halves match exactly.",
            },
          ]),
          solution: [
            {
              say: `Fold it in your mind: ${v === 0 ? "no fold" : v === 1 ? "one fold" : `${v} folds`} make the halves match.`,
            },
          ],
        });
      }
      case 2: {
        const [shape, v, w] = ORDERS[p.o] ?? ["a kite", 1, 0];
        return A.variedForm({
          rng,
          forms: [{ question: [`What is the order of rotational symmetry of ${shape}?`] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "GEO.SYMMETRY.ROTATION-LINES",
              value: A.number(w),
              feedback:
                "Count how many times it looks the same in one full turn. Every shape fits at least once, so the order is at least 1.",
            },
          ]),
          solution: [{ say: `In one full turn it looks the same ${v} time${v === 1 ? "" : "s"}.` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [
                "A polygon with exactly two lines of symmetry has rotational symmetry of order 2.",
              ],
              truth: "always",
              reasons: [
                {
                  text: "Always. The two mirror lines are at right angles, and reflecting in one then the other is a half turn.",
                  correct: true,
                },
                {
                  text: "Sometimes. Rotational symmetry has nothing to do with lines of symmetry.",
                  code: "GEO.SYMMETRY.ROTATION-LINES",
                },
                {
                  text: "Never. The order is always the number of sides.",
                  code: "GEO.SYMMETRY.ROTATION-LINES",
                },
              ],
              solution: [{ say: "Think of a rectangle or a rhombus." }],
            }),
          [
            {
              statement: "Ivy says a rectangle that is not a square has 4 lines of symmetry.",
              truth: false,
              right:
                "False. It has 2, through the middles of opposite sides. Folding along a diagonal does not match the corners.",
              wrong: [
                ["True. The diagonals are lines of symmetry too.", "GEO.SYMMETRY.DIAGONAL"],
                ["True. It has four sides, so it has four lines.", "GEO.SYMMETRY.ROTATION-LINES"],
              ],
            },
            {
              statement: "Jay says a square has rotational symmetry of order 4.",
              truth: true,
              right:
                "True. It looks the same after a quarter turn, a half turn, a three-quarter turn and a full turn.",
              wrong: [
                [
                  "False. Its order is 1, because only a full turn works.",
                  "GEO.SYMMETRY.ROTATION-LINES",
                ],
                ["False. Its order is 2, like a rectangle.", "GEO.SYMMETRY.ROTATION-LINES"],
              ],
            },
            {
              claim: "A shape with rotational symmetry has a line of symmetry.",
              truth: "sometimes",
              right:
                "Sometimes. A square has both, but a parallelogram that is not a rectangle or a rhombus has rotational symmetry of order 2 and no lines of symmetry.",
              wrong: [
                [
                  "Always. Turning and folding symmetry go together.",
                  "GEO.SYMMETRY.ROTATION-LINES",
                ],
                [
                  "Never. A shape has one kind of symmetry or the other.",
                  "GEO.SYMMETRY.ROTATION-LINES",
                ],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (LINES[p.l]?.[1] ?? 1);
    if (question.key.depth === 2) return numberAnswer(question) === (ORDERS[p.o]?.[1] ?? 1);
    return true;
  },
});
