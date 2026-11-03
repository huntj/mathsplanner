/**
 * @statement Y8-POS-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-POS-01.c: Describe reflections
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  x: number;
  y: number;
  yAxis: boolean;
}

export default defineGenerator<Params>({
  id: "Y8-POS-01.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.REFLECT.WRONG-AXIS"],

  params(rng) {
    const p = { x: rng.int(1, 7), y: rng.int(1, 7), yAxis: rng.bool() };
    if (p.x === p.y) reject("a point off the diagonal");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const image: [number, number] = p.yAxis ? [-p.x, p.y] : [p.x, -p.y];
        const right = `A reflection in the ${p.yAxis ? "y" : "x"}-axis`;
        return A.choice({
          rng,
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is reflected to ",
            A.math(coord(image)),
            ".",
          ],
          ask: "Describe the reflection.",
          correct: right,
          distractors: [
            {
              content: `A reflection in the ${p.yAxis ? "x" : "y"}-axis`,
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `Reflecting in the ${p.yAxis ? "y" : "x"}-axis changes the ${p.yAxis ? "x" : "y"}-coordinate, which is what happened here.`,
            },
            {
              content: "A reflection in the line y = x",
              feedback: `Reflecting in y = x swaps the coordinates: (${p.y}, ${p.x}).`,
            },
          ],
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const right = "A reflection in the line y = x";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            " is reflected to ",
            A.math(coord([p.y, p.x])),
            ".",
          ],
          ask: "Describe the reflection.",
          correct: right,
          distractors: [
            {
              content: "A reflection in the line y = −x",
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `Reflecting in y = −x gives (${-p.y}, ${-p.x}).`,
            },
            {
              content: "A reflection in the y-axis",
              code: "POS.REFLECT.WRONG-AXIS",
              feedback: `Reflecting in the y-axis gives (${-p.x}, ${p.y}).`,
            },
          ],
          solution: [{ say: "The coordinates swap: the mirror line is y = x." }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A reflection in the y-axis changes the x-coordinate of a point."],
              truth: "sometimes",
              reasons: [
                {
                  text: "Sometimes. x becomes −x, which is a change unless the point is on the y-axis (x = 0), where it stays put.",
                  correct: true,
                },
                {
                  text: "Always. Every point moves in a reflection.",
                  code: "POS.REFLECT.WRONG-AXIS",
                },
                {
                  text: "Never. Reflecting in the y-axis changes y.",
                  code: "POS.REFLECT.WRONG-AXIS",
                },
              ],
              solution: [{ say: "Points on the mirror line do not move." }],
            }),
          [
            {
              statement: "Ivy reflects the point (3, 5) in the x-axis and gets (3, −5).",
              truth: true,
              right: "True. A reflection in the x-axis keeps x and changes the sign of y.",
              wrong: [
                ["False. It is (−3, 5).", "POS.REFLECT.WRONG-AXIS"],
                ["False. It is (5, 3)."],
              ],
            },
            {
              statement: "Ben reflects the point (4, 2) in the y-axis and gets (4, −2).",
              truth: false,
              right: "False. A reflection in the y-axis changes the sign of x: (−4, 2).",
              wrong: [
                ["True. To reflect in the y-axis, change y.", "POS.REFLECT.WRONG-AXIS"],
                ["True. Reflections always change the second number."],
              ],
            },
            {
              claim: "A point on the mirror line stays where it is when it is reflected.",
              truth: "always",
              right: "Always. It is 0 away from the mirror line, so its image is itself.",
              wrong: [
                ["Never. Every point moves in a reflection."],
                ["Sometimes. Only on the x-axis.", "POS.REFLECT.WRONG-AXIS"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `A reflection in the ${p.yAxis ? "y" : "x"}-axis`;
    if (question.key.depth === 2) return chosenText(question) === "A reflection in the line y = x";
    return true;
  },
});
