/**
 * @statement GF-G7.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G7.c: Translate shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { col } from "../shared/vec.ts";

interface Params {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export default defineGenerator<Params>({
  id: "GF-G7.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.TRANSLATE.DIRECTION", "POS.TRANSFORM.CHANGES-SHAPE"],

  params(rng) {
    const p = { x: rng.int(-5, 5), y: rng.int(-5, 5), dx: rng.int(-6, 6), dy: rng.int(-6, 6) };
    if (p.dx === 0 || p.dy === 0 || p.dx === p.dy) reject("a diagonal move with different parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = coord([p.x + p.dx, p.y + p.dy]);
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is translated by ",
            A.math(col([p.dx, p.dy])),
            ".",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.x + p.dy, p.y + p.dx])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "The top number moves across (x); the bottom number moves up or down (y).",
            },
            {
              content: A.math(coord([p.x - p.dx, p.y - p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "A positive top number moves right and a positive bottom number moves up.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "",
              math: `(${p.x} + ${p.dx}, ${p.y} + ${p.dy}) = ${right}`.replace(/\+ -/g, "- "),
            },
          ],
        });
      }
      case 2: {
        const right = col([p.dx, p.dy]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A shape is translated so that the point ",
            A.math(coord([p.x, p.y])),
            " moves to ",
            A.math(coord([p.x + p.dx, p.y + p.dy])),
            ".",
          ],
          ask: "Which vector describes the translation?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(col([-p.dx, -p.dy])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "Subtract the start from the end: end − start.",
            },
            {
              content: A.math(col([p.dy, p.dx])),
              code: "POS.TRANSLATE.DIRECTION",
              feedback: "The top number is the movement in x.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: `It moves ${p.dx} in x and ${p.dy} in y: `, math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A translation turns a shape round."],
          truth: "never",
          reasons: [
            {
              text: "Never. A translation slides every point the same distance in the same direction, so the shape keeps its orientation.",
              correct: true,
            },
            { text: "Sometimes. It depends on the vector.", code: "POS.TRANSFORM.CHANGES-SHAPE" },
            { text: "Always. Moving a shape turns it.", code: "POS.TRANSFORM.CHANGES-SHAPE" },
          ],
          solution: [{ say: "Rotations turn shapes; translations only slide them." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === coord([p.x + p.dx, p.y + p.dy]);
    if (question.key.depth === 2) return chosenText(question) === col([p.dx, p.dy]);
    return true;
  },
});
