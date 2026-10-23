/**
 * @statement Y8-POS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-POS-01.a: Describe translations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom, inRange, moveWords, shapesGrid, SHAPES, translate } from "../shared/pos.ts";
import { col } from "../shared/vec.ts";

interface Params {
  shape: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export default defineGenerator<Params>({
  id: "Y8-POS-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.TRANSLATE.DIRECTION", "POS.TRANSLATE.COUNT-GAP"],

  params(rng) {
    const p = {
      shape: rng.int(0, SHAPES.length - 1),
      x: rng.int(1, 4),
      y: rng.int(1, 4),
      dx: rng.int(-4, 5),
      dy: rng.int(-4, 5),
    };
    if (p.dx === 0 || p.dy === 0 || p.dx === p.dy || p.dx === -p.dy)
      reject("a diagonal move with different parts");
    const s = translate((SHAPES[p.shape] ?? []) as Coord[], p.x, p.y);
    if (!inRange(s, 0, 10) || !inRange(translate(s, p.dx, p.dy), 0, 10))
      reject("both shapes on the grid");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const a = translate((SHAPES[p.shape] ?? []) as Coord[], p.x, p.y);
    const b = translate(a, p.dx, p.dy);
    const fig = A.figure(
      shapesGrid(
        0,
        10,
        [
          { vertices: a, label: "A" },
          { vertices: b, label: "B", shaded: false },
        ],
        "Shape A and its image B on a grid.",
      ),
    );
    switch (depth) {
      case 1: {
        const right = col([p.dx, p.dy]);
        return A.choice({
          rng,
          question: ["Shape A is translated to shape B.", fig],
          ask: "Which column vector describes the translation?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([-p.dx, -p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "That moves B back to A. Describe the move from A to B.",
            },
            {
              content: A.math(col([p.dy, p.dx])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "The top number is the move across; the bottom is the move up or down.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "Follow one corner from A to B: ", math: right }],
        });
      }
      case 2: {
        const right = moveWords(p.dx, p.dy);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["A shape is translated by ", A.math(col([p.dx, p.dy])), "."],
          ask: "Which describes the movement in words?",
          correct: right,
          distractors: [
            {
              content: moveWords(p.dy, p.dx),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "The top number is the movement left or right.",
            },
            {
              content: moveWords(-p.dx, -p.dy),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "A positive top number means right; a positive bottom number means up.",
            },
          ].filter((d) => d.content !== right),
          solution: [{ say: `${right[0]?.toUpperCase()}${right.slice(1)}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kim says the gap between shape A and its image B shows how far the shape moved.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Measure how far one corner moves to the matching corner. The gap between the shapes is less than that.",
              correct: true,
            },
            {
              text: "True. Count the empty squares between them.",
              code: "POS.TRANSLATE.COUNT-GAP",
            },
            {
              text: "True. The gap and the move are always the same.",
              code: "POS.TRANSLATE.COUNT-GAP",
            },
          ],
          solution: [{ say: "Track a single vertex from A to its image." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === col([p.dx, p.dy]);
    if (question.key.depth === 2) return chosenText(question) === moveWords(p.dx, p.dy);
    return true;
  },
});
