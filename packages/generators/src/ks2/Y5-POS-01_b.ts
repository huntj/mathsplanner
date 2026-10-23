/**
 * @statement Y5-POS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-POS-01.b: Describe the position of a shape after a translation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  x: number;
  y: number;
  /** Squares right (negative for left) and up (negative for down). */
  dx: number;
  dy: number;
}

const pt = (x: number, y: number) => `(${x}, ${y})`;
const way = (dx: number, dy: number) =>
  `${Math.abs(dx)} ${dx > 0 ? "right" : "left"} and ${Math.abs(dy)} ${dy > 0 ? "up" : "down"}`;

export default defineGenerator<Params>({
  id: "Y5-POS-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.TRANSLATE.DIRECTION", "POS.TRANSFORM.CHANGES-SHAPE"],

  params(rng) {
    const p = {
      x: rng.int(2, 8),
      y: rng.int(2, 8),
      dx: rng.pick([-1, 1]) * rng.int(1, 5),
      dy: rng.pick([-1, 1]) * rng.int(1, 5),
    };
    const [ex, ey] = [p.x + p.dx, p.y + p.dy];
    // Stay in the first quadrant, also for the wrong-way answers, and keep the two moves different.
    if (
      [ex, ey, p.x - p.dx, p.y - p.dy].some((v) => v < 0 || v > 12) ||
      Math.abs(p.dx) === Math.abs(p.dy)
    )
      reject("on the grid, with different moves");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [ex, ey] = [p.x + p.dx, p.y + p.dy];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `Corner A of a shape is at ${pt(p.x, p.y)}. The shape is translated ${way(p.dx, p.dy)}.`,
          ],
          ask: "Where is corner A now?",
          correct: pt(ex, ey),
          distractors: [
            {
              content: pt(p.x - p.dx, p.y + p.dy),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: `Moving ${p.dx > 0 ? "right adds to" : "left takes away from"} the first coordinate.`,
            },
            {
              content: pt(p.x + p.dy, p.y + p.dx),
              code: "POS.TRANSLATE.DIRECTION",
              feedback:
                "Left and right change the first coordinate; up and down change the second.",
            },
            {
              content: pt(p.x + p.dx, p.y - p.dy),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: `Moving ${p.dy > 0 ? "up adds to" : "down takes away from"} the second coordinate.`,
            },
          ].filter((d) => d.content !== pt(ex, ey)),
          solution: [
            {
              say: `${pt(p.x, p.y)} moves to ${pt(ex, ey)}: ${p.x} ${p.dx > 0 ? "+" : "−"} ${Math.abs(p.dx)} = ${ex} and ${p.y} ${p.dy > 0 ? "+" : "−"} ${Math.abs(p.dy)} = ${ey}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `A shape is translated. Corner A moves from ${pt(p.x, p.y)} to ${pt(ex, ey)}.`,
          ],
          ask: "Which describes the translation?",
          correct: way(p.dx, p.dy),
          distractors: [
            {
              content: way(-p.dx, -p.dy),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "That moves the shape back the other way.",
            },
            {
              content: way(p.dy, p.dx),
              code: "POS.TRANSLATE.DIRECTION",
              feedback:
                "The first coordinate changes by the across move, the second by the up or down move.",
            },
          ],
          solution: [
            {
              say: `The first coordinate changes by ${p.dx} and the second by ${p.dy}: ${way(p.dx, p.dy)}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A square with sides of 3 squares is translated ${way(p.dx, p.dy)}. Zoe says the new square is bigger because it has moved further from the corner of the grid.`,
          truth: false,
          reasons: [
            {
              text: "False. A translation slides a shape without turning or resizing it, so it is still 3 by 3.",
              correct: true,
            },
            {
              text: "True. Shapes grow as they move away from (0, 0).",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
            {
              text: "True. Every corner moves, so the size changes.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
          ],
          solution: [
            { say: "After a translation the shape is the same size and the same way round." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === pt(p.x + p.dx, p.y + p.dy);
    if (question.key.depth === 2) return chosenText(question) === way(p.dx, p.dy);
    return true;
  },
});
