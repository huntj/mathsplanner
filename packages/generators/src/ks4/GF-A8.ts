/**
 * @statement GF-A8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A8: Work with coordinates in all four quadrants
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  a: Coord;
  b: Coord;
}

const mid = (a: Coord, b: Coord): Coord => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

export default defineGenerator<Params>({
  id: "GF-A8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.MIDPOINT.DIFFERENCE", "NPV.NEGATIVE.SIGN-RULE"],

  params(rng) {
    const a: Coord = [rng.int(-8, 8), rng.int(-8, 8)];
    const b: Coord = [a[0] + 2 * rng.int(-6, 6), a[1] + 2 * rng.int(-6, 6)];
    if (a[0] === b[0] || a[1] === b[1] || (a[0] >= 0 && a[1] >= 0 && b[0] >= 0 && b[1] >= 0))
      reject("two points that differ, at least one coordinate negative");
    return { a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const m = mid(p.a, p.b);
    switch (depth) {
      case 1: {
        const right = coord(m);
        const half: Coord = [(p.b[0] - p.a[0]) / 2, (p.b[1] - p.a[1]) / 2];
        return A.choice({
          rng,
          question: ["A is ", A.math(coord(p.a)), " and B is ", A.math(coord(p.b)), "."],
          ask: "What are the coordinates of the midpoint of AB?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord(half)),
              code: "ALG.MIDPOINT.DIFFERENCE",
              feedback:
                "That is half the distance across and up. Add it to A, or average the coordinates.",
            },
            {
              content: A.math(coord([p.a[0] + p.b[0], p.a[1] + p.b[1]])),
              feedback: "Add the coordinates and then halve them.",
            },
            { content: A.math(coord([m[1], m[0]])), feedback: "Keep x first and y second." },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "Average the coordinates: ",
              math: `\\left(\\frac{${p.a[0]} + ${p.b[0]}}{2}, \\frac{${p.a[1]} + ${p.b[1]}}{2}\\right) = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const right = coord(p.b);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The midpoint of AB is ",
            A.math(coord(m)),
            ". A is ",
            A.math(coord(p.a)),
            ".",
          ],
          ask: "What are the coordinates of B?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([(p.a[0] + m[0]) / 2, (p.a[1] + m[1]) / 2])),
              code: "ALG.MIDPOINT.DIFFERENCE",
              feedback: "B is as far beyond the midpoint as A is before it.",
            },
            {
              content: A.math(coord([2 * m[0] + p.a[0], 2 * m[1] + p.a[1]])),
              code: "NPV.NEGATIVE.SIGN-RULE",
              feedback: "B = 2 × midpoint − A.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: "Step from A to the midpoint, then the same again: ",
              math: `B = 2M - A = ${right}`,
            },
          ],
        });
      }
      default: {
        const half: Coord = [(p.b[0] - p.a[0]) / 2, (p.b[1] - p.a[1]) / 2];
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy says the midpoint of ",
            A.math(`${coord(p.a)}`),
            " and ",
            A.math(`${coord(p.b)}`),
            " is ",
            A.math(coord(half)),
            ", halfway between the differences.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The midpoint is the average of the coordinates: ${coord(m)}. Half the difference tells you how far to move from A.`,
              correct: true,
            },
            { text: "True. Halve the difference in x and in y.", code: "ALG.MIDPOINT.DIFFERENCE" },
            { text: "True. Subtract the coordinates and halve.", code: "ALG.MIDPOINT.DIFFERENCE" },
          ],
          solution: [
            {
              say: "",
              math: `\\text{midpoint} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = ${coord(m)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question).includes(coord(mid(p.a, p.b)));
    if (question.archetype === "varied-form") return chosenText(question).includes(coord(p.b));
    return true;
  },
});
