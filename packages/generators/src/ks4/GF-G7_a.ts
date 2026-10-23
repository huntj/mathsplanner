/**
 * @statement GF-G7.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G7.a: Rotate shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  x: number;
  y: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-G7.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TURNS.DIRECTION", "POS.ROTATE.CENTRE", "POS.TRANSFORM.CHANGES-SHAPE"],

  params(rng) {
    const p = { x: rng.int(-6, 6), y: rng.int(-6, 6), a: rng.int(-3, 3), b: rng.int(-3, 3) };
    if (p.x === 0 || p.y === 0 || Math.abs(p.x) === Math.abs(p.y))
      reject("a point off the axes and diagonals");
    if (p.a === 0 && p.b === 0) reject("a centre away from the origin");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = coord([p.y, -p.x]);
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is rotated 90° clockwise about the origin.",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([-p.y, p.x])),
              code: "GEO.TURNS.DIRECTION",
              feedback: "That is 90° anticlockwise. Clockwise turns the way a clock's hands move.",
            },
            { content: A.math(coord([-p.x, -p.y])), feedback: "That is a half turn (180°)." },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "A quarter turn clockwise about the origin sends (x, y) to (y, −x): ",
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = coord([2 * p.a - p.x, 2 * p.b - p.y]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is rotated 180° about ",
            A.math(coord([p.a, p.b])),
            ".",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([-p.x, -p.y])),
              code: "POS.ROTATE.CENTRE",
              feedback: `That is a half turn about the origin. Turn about (${p.a}, ${p.b}) instead.`,
            },
            {
              content: A.math(coord([p.x + 2 * p.a, p.y + 2 * p.b])),
              code: "POS.ROTATE.CENTRE",
              feedback: "Go from the point to the centre, then the same again beyond it.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            { say: `The centre is halfway between the point and its image: `, math: right },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Gus says rotating a shape can change its size."],
          truth: false,
          reasons: [
            {
              text: "False. A rotation only turns the shape: its image is congruent, with the same lengths and angles.",
              correct: true,
            },
            {
              text: "True. The further from the centre, the bigger it gets.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
            {
              text: "True. A rotation of 180° makes it upside down and bigger.",
              code: "POS.TRANSFORM.CHANGES-SHAPE",
            },
          ],
          solution: [{ say: "Only enlargement changes size." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === coord([p.y, -p.x]);
    if (question.key.depth === 2)
      return chosenText(question) === coord([2 * p.a - p.x, 2 * p.b - p.y]);
    return true;
  },
});
