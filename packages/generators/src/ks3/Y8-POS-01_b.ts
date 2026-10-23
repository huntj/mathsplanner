/**
 * @statement Y8-POS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-POS-01.b: Describe rotations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  x: number;
  y: number;
  ccw: boolean;
}

export default defineGenerator<Params>({
  id: "Y8-POS-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TURNS.DIRECTION", "POS.REFLECT.WRONG-AXIS", "POS.ROTATE.CENTRE"],

  params(rng) {
    const p = { x: rng.int(1, 6), y: rng.int(1, 6), ccw: rng.bool() };
    if (p.x === p.y) reject("a point off the diagonal");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const image = p.ccw ? [-p.y, p.x] : [p.y, -p.x];
        const right = `A rotation of 90° ${p.ccw ? "anticlockwise" : "clockwise"} about the origin`;
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " moves to ",
            A.math(coord(image as [number, number])),
            ".",
          ],
          ask: "Which transformation does this?",
          correct: right,
          distractors: [
            {
              content: `A rotation of 90° ${p.ccw ? "clockwise" : "anticlockwise"} about the origin`,
              code: "GEO.TURNS.DIRECTION",
              feedback: "Sketch it: which way does the point turn around the origin?",
            },
            {
              content: "A rotation of 180° about the origin",
              feedback: `A half turn would send it to (${-p.x}, ${-p.y}).`,
            },
          ],
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const right = "A rotation of 180° about the origin";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A triangle with a corner at ",
            A.math(coord([p.x, p.y])),
            " is transformed. That corner moves to ",
            A.math(coord([-p.x, -p.y])),
            ", and the triangle is not flipped over.",
          ],
          ask: "Describe the transformation.",
          correct: right,
          distractors: [
            {
              content: "A reflection in the y-axis",
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `A reflection in the y-axis keeps y the same: (${-p.x}, ${p.y}).`,
            },
            {
              content: `A rotation of 180° about ${coord([p.x, p.y])}`,
              code: "POS.ROTATE.CENTRE",
              feedback: "That corner would not move if it were the centre.",
            },
          ],
          solution: [{ say: "Both coordinates change sign: a half turn about (0, 0)." }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eva says that to describe a rotation fully you need the angle, the direction and the centre.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. Without the centre or the direction, more than one rotation would fit (except a half turn, where direction does not matter).",
              correct: true,
            },
            { text: "False. The angle is enough.", code: "POS.ROTATE.CENTRE" },
            { text: "False. Rotations always turn about the origin.", code: "POS.ROTATE.CENTRE" },
          ],
          solution: [{ say: "Rotation: angle, direction, centre." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        chosenText(question) ===
        `A rotation of 90° ${p.ccw ? "anticlockwise" : "clockwise"} about the origin`
      );
    if (question.key.depth === 2)
      return chosenText(question) === "A rotation of 180° about the origin";
    return true;
  },
});
