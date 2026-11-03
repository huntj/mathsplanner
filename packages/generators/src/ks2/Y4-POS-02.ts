/**
 * @statement Y4-POS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-POS-02: Describe movements between positions as translations of a given unit to the left/right
// and up/down
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import {
  coord,
  distinctFrom,
  inRange,
  moveWords,
  SHAPES,
  shapesGrid,
  translate,
} from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  start: Coord;
  dx: number;
  dy: number;
  shape: number;
}

const MAX = 10;

export default defineGenerator<Params>({
  id: "Y4-POS-02",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: [
    "POS.TRANSLATE.DIRECTION",
    "POS.TRANSLATE.COUNT-GAP",
    "POS.TRANSFORM.CHANGES-SHAPE",
  ],

  params(rng, numbers) {
    const step = numbers === "friendly" ? 3 : 5;
    const dx = rng.int(-step, step);
    const dy = rng.int(-step, step);
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))
      reject("a move across and up or down, different amounts");
    const shape = rng.int(0, SHAPES.length - 1);
    const start: Coord = [rng.int(0, MAX), rng.int(0, MAX)];
    const s = translate(SHAPES[shape] as Coord[], start[0], start[1]);
    if (!inRange(s, 0, MAX) || !inRange(translate(s, dx, dy), 0, MAX))
      reject("both shapes on the grid");
    // The shapes must not overlap, so the gap between them can be counted.
    const w = Math.max(...s.map((q) => q[0])) - start[0];
    const h = Math.max(...s.map((q) => q[1])) - start[1];
    if (Math.abs(dx) <= w && Math.abs(dy) <= h) reject("an image clear of the shape");
    return { start, dx, dy, shape };
  },

  build(p, depth, rng): QuestionDraft {
    const s = translate(SHAPES[p.shape] as Coord[], p.start[0], p.start[1]);
    const t = translate(s, p.dx, p.dy);
    const a = s[0] as Coord;
    const a2 = t[0] as Coord;
    switch (depth) {
      case 1: {
        const right = coord(a2);
        return A.choice({
          rng,
          question: ["Point A is at ", A.math(coord(a)), `. It moves ${moveWords(p.dx, p.dy)}.`],
          ask: "Where is it now?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([a[0] - p.dx, a[1] + p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: `${p.dx > 0 ? "Right" : "Left"} ${p.dx > 0 ? "adds to" : "takes away from"} the x-coordinate.`,
            },
            {
              content: A.math(coord([a[0] + p.dy, a[1] + p.dx])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback:
                "Left and right change the first coordinate; up and down change the second.",
            },
            {
              content: A.math(coord([a[0] + p.dx, a[1] - p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: `${p.dy > 0 ? "Up" : "Down"} ${p.dy > 0 ? "adds to" : "takes away from"} the y-coordinate.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `x: ${a[0]} ${p.dx > 0 ? "+" : "−"} ${Math.abs(p.dx)} = ${a2[0]}. y: ${a[1]} ${p.dy > 0 ? "+" : "−"} ${Math.abs(p.dy)} = ${a2[1]}. So ${right}.`,
            },
          ],
        });
      }
      case 2: {
        const right = moveWords(p.dx, p.dy);
        const w = Math.max(...s.map((q) => q[0])) - p.start[0];
        const gapX = Math.abs(p.dx) > w ? Math.abs(p.dx) - w : 0;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.figure(
              shapesGrid(
                0,
                MAX,
                [
                  { vertices: s, label: "A" },
                  { vertices: t, label: "B" },
                ],
                "Two identical shapes, A and B, on a grid.",
              ),
            ),
          ],
          ask: "Describe the translation that moves shape A onto shape B.",
          correct: right,
          distractors: [
            {
              content: moveWords(-p.dx, -p.dy),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "That moves B back onto A. Go from A to B.",
            },
            {
              content: moveWords(p.dy, p.dx),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Check which amount is across and which is up or down.",
            },
            ...(gapX > 0
              ? [
                  {
                    content: moveWords(Math.sign(p.dx) * gapX, p.dy),
                    code: "POS.TRANSLATE.COUNT-GAP",
                    feedback:
                      "Count how far one corner moves to the matching corner, not the gap between the shapes.",
                  },
                ]
              : []),
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [
            { say: `Pick a corner of A and follow it to the matching corner of B: ${right}.` },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                A.figure(
                  shapesGrid(
                    0,
                    MAX,
                    [
                      { vertices: s, label: "A" },
                      { vertices: t, label: "B" },
                    ],
                    "Two identical shapes, A and B, on a grid.",
                  ),
                ),
                "Ravi says shape B is bigger than shape A, because it has moved.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. A translation only slides a shape. Its size, shape and the way it faces stay the same.",
                  correct: true,
                },
                { text: "True. Moving a shape stretches it.", code: "POS.TRANSFORM.CHANGES-SHAPE" },
                {
                  text: "True. Shapes higher up the grid are bigger.",
                  code: "POS.TRANSFORM.CHANGES-SHAPE",
                },
              ],
              solution: [
                { say: `B is A moved ${moveWords(p.dx, p.dy)}; every side is the same length.` },
              ],
            }),
          [
            {
              statement:
                "Sol moves a shape 3 squares right and 2 squares down. He says every corner moved 3 right and 2 down.",
              truth: true,
              right: "True. In a translation every point moves the same way.",
              wrong: [
                ["False. Only the top corner moves.", "POS.TRANSLATE.DIRECTION"],
                ["False. The corners move different amounts.", "POS.TRANSFORM.CHANGES-SHAPE"],
              ],
            },
            {
              claim: "A shape that has been translated is the same size as before.",
              truth: "always",
              right: "Always. A translation slides a shape; it does not stretch it.",
              wrong: [
                ["Sometimes. It grows if it moves far.", "POS.TRANSFORM.CHANGES-SHAPE"],
                ["Never. Moving changes the size."],
              ],
            },
            {
              statement:
                "Ana counts the empty squares between a shape and its image to find how far it moved.",
              truth: false,
              right:
                "False. Count from one corner to the same corner on the image, not the gap between them.",
              wrong: [
                ["True. The gap is how far it moved.", "POS.TRANSLATE.COUNT-GAP"],
                ["True. Count the squares in between."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const a = translate(
      SHAPES[p.shape] as Coord[],
      p.start[0] + p.dx,
      p.start[1] + p.dy,
    )[0] as Coord;
    if (question.archetype === "standard") return chosenText(question).includes(coord(a));
    if (question.archetype === "varied-form") return chosenText(question) === moveWords(p.dx, p.dy);
    return true;
  },
});
