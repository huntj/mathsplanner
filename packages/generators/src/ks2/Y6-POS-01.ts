/**
 * @statement Y6-POS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-POS-01: Describe positions on the full coordinate grid (all four quadrants)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { grid } from "../shared/alg.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom, same } from "../shared/pos.ts";

interface Params {
  p: Coord;
  /** Depth 2: two points level with each other on opposite sides of the y-axis. */
  a: number;
  b: number;
  level: number;
  claimRight: boolean;
}

const R = 6;

export default defineGenerator<Params>({
  id: "Y6-POS-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.COORD.ORDER", "NPV.NEGATIVE.MIRROR"],

  params(rng) {
    const p: Coord = [rng.int(-5, 5), rng.int(-5, 5)];
    if (p[0] === 0 || p[1] === 0 || Math.abs(p[0]) === Math.abs(p[1]) || (p[0] > 0 && p[1] > 0))
      reject("a point off the axes with a negative coordinate");
    if (Math.abs(p[0]) === 1 && Math.abs(p[1]) === 1) reject("a point clear of the origin label");
    return { p, a: rng.int(1, 5), b: rng.int(1, 5), level: rng.int(-5, 5), claimRight: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = p.p;
    const right = coord(p.p);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "What are the coordinates of point P?",
            A.figure(
              grid(
                R,
                [],
                [{ at: p.p, label: "P" }],
                "A coordinate grid in four quadrants with one point, P, marked.",
              ),
            ),
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([y, x])),
              code: "ALG.COORD.ORDER",
              feedback: "Across first (x), then up or down (y).",
            },
            {
              content: A.math(coord([Math.abs(x), Math.abs(y)])),
              code: "NPV.NEGATIVE.MIRROR",
              feedback: "Left of the y-axis, x is negative; below the x-axis, y is negative.",
            },
            {
              content: A.math(coord([-x, y])),
              feedback: `P is ${x > 0 ? "right" : "left"} of the y-axis, so x is ${x > 0 ? "positive" : "negative"}.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `Go ${Math.abs(x)} ${x > 0 ? "right" : "left"} and ${Math.abs(y)} ${y > 0 ? "up" : "down"}: ${right}.`,
            },
          ],
        });
      case 2: {
        const dist = p.a + p.b;
        return A.standard({
          question: [
            "Point A is at ",
            A.math(coord([-p.a, p.level])),
            " and point B is at ",
            A.math(coord([p.b, p.level])),
            ".",
          ],
          ask: "How many units apart are A and B?",
          answer: A.number(dist),
          wrong: wrongs(dist, [
            {
              code: "NPV.NEGATIVE.MIRROR",
              value: A.number(Math.abs(p.b - p.a)),
              feedback: `From −${p.a} to 0 is ${p.a}, then 0 to ${p.b} is ${p.b}: add them.`,
            },
          ]),
          solution: [
            {
              say: `They are level, so count across: ${p.a} from −${p.a} to 0, and ${p.b} from 0 to ${p.b}. ${p.a} + ${p.b} = ${dist}.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which grid shows the point ", A.math(right), "?"],
          correct: grid(R, [], [{ at: p.p }], "A coordinate grid with a point marked."),
          distractors: [
            {
              figure: grid(R, [], [{ at: [y, x] }], "A coordinate grid with a point marked."),
              code: "ALG.COORD.ORDER",
              feedback: `That point is at ${coord([y, x])}.`,
            },
            {
              figure: grid(R, [], [{ at: [-x, -y] }], "A coordinate grid with a point marked."),
              code: "NPV.NEGATIVE.MIRROR",
              feedback: `That point is at ${coord([-x, -y])}: the signs are the wrong way round.`,
            },
          ],
          solution: [
            { say: `x = ${x}: ${x > 0 ? "right" : "left"}. y = ${y}: ${y > 0 ? "up" : "down"}.` },
          ],
        });
      default: {
        const truth = p.claimRight ? x > 0 : y > 0;
        const claim = p.claimRight ? "to the right of the y-axis" : "above the x-axis";
        return A.trueOrFalseWhy({
          rng,
          statement: ["Mo says the point ", A.math(right), ` is ${claim}.`],
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. ${p.claimRight ? `The x-coordinate ${x} is ${x > 0 ? "positive, so it is right of" : "negative, so it is left of"} the y-axis` : `The y-coordinate ${y} is ${y > 0 ? "positive, so it is above" : "negative, so it is below"} the x-axis`}.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. ${p.claimRight ? "The second number tells you left or right." : "The first number tells you up or down."}`,
              code: "ALG.COORD.ORDER",
            },
            {
              text: `${truth ? "False" : "True"}. Negative numbers are always to the left of and below the origin.`,
              code: "NPV.NEGATIVE.MIRROR",
            },
          ],
          solution: [
            {
              say: "x tells you left (negative) or right (positive); y tells you down (negative) or up (positive).",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.a + p.b;
    if (question.archetype === "standard") return chosenText(question).includes(coord(p.p));
    if (question.archetype === "choose-the-diagram") {
      const at = (chosenFigure(question) as CartesianSpec | undefined)?.points?.[0]?.at;
      return at !== undefined && same(at, p.p);
    }
    return true;
  },
});
