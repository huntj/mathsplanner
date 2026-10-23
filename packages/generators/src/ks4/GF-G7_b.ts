/**
 * @statement GF-G7.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G7.b: Reflect shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  x: number;
  y: number;
  m: number;
  vertical: boolean;
  xAxis: boolean;
}

const image = (p: Params) =>
  p.vertical ? coord([2 * p.m - p.x, p.y]) : coord([p.x, 2 * p.m - p.y]);

export default defineGenerator<Params>({
  id: "GF-G7.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.REFLECT.WRONG-AXIS"],

  params(rng) {
    const p = {
      x: rng.int(-6, 6),
      y: rng.int(-6, 6),
      m: rng.int(-3, 3),
      vertical: rng.bool(),
      xAxis: rng.bool(),
    };
    if (p.x === 0 || p.y === 0 || p.x === p.y || p.m === 0) reject("a point that moves");
    if ((p.vertical ? p.x : p.y) === p.m) reject("a point off the mirror line");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = p.xAxis ? coord([p.x, -p.y]) : coord([-p.x, p.y]);
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            ` is reflected in the ${p.xAxis ? "x" : "y"}-axis.`,
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(p.xAxis ? coord([-p.x, p.y]) : coord([p.x, -p.y])),
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `Reflecting in the ${p.xAxis ? "x" : "y"}-axis keeps the ${p.xAxis ? "x" : "y"}-coordinate the same.`,
            },
            {
              content: A.math(coord([-p.x, -p.y])),
              feedback: "Only one coordinate changes sign in a reflection in an axis.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: right }],
        });
      }
      case 2: {
        const right = image(p);
        const line = p.vertical ? `x = ${p.m}` : `y = ${p.m}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is reflected in the line ",
            A.math(line),
            ".",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(
                p.vertical ? coord([p.x, 2 * p.m - p.y]) : coord([2 * p.m - p.x, p.y]),
              ),
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `${line} is a ${p.vertical ? "vertical" : "horizontal"} line, so the ${p.vertical ? "x" : "y"}-coordinate changes.`,
            },
            {
              content: A.math(p.vertical ? coord([p.m, p.y]) : coord([p.x, p.m])),
              feedback:
                "That point is on the mirror line. The image is as far beyond the line as the point is before it.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `The point is ${Math.abs((p.vertical ? p.x : p.y) - p.m)} from the line, so the image is the same distance on the other side: `,
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Abi says a point on the mirror line moves when it is reflected."],
          truth: false,
          reasons: [
            {
              text: "False. A point on the mirror line is zero distance from it, so it stays where it is.",
              correct: true,
            },
            {
              text: "True. Every point moves to the other side of the line.",
              code: "POS.REFLECT.WRONG-AXIS",
            },
            { text: "True. It moves along the mirror line." },
          ],
          solution: [{ say: "Points on the mirror line are invariant." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === (p.xAxis ? coord([p.x, -p.y]) : coord([-p.x, p.y]));
    if (question.key.depth === 2) return chosenText(question) === image(p);
    return true;
  },
});
