/**
 * @statement AL-P2.9b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.9b: Apply combinations of transformations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** A turning point (x, y) of y = f(x). */
  x: number;
  y: number;
  a: number;
  b: number;
  c: number;
}

const pt = (x: number, y: number) => `(${x}, ${y})`;

export default defineGenerator<Params>({
  id: "AL-P2.9b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRANSFORM.DIRECTION", "POS.COMBINE"],

  params(rng) {
    const p = {
      x: rng.int(-5, 5),
      y: rng.int(-5, 5),
      a: rng.int(2, 3),
      b: rng.int(1, 4),
      c: rng.int(1, 5),
    };
    if (p.x === 0 || p.y === 0 || p.b === p.c) reject("a point off the axes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "The curve ",
      A.math("y = f(x)"),
      " has a maximum point at ",
      A.math(pt(p.x, p.y)),
      ".",
    ];
    switch (depth) {
      case 1: {
        const eq = `y = ${p.a}f(x + ${p.b}) + ${p.c}`;
        const right = pt(p.x - p.b, p.a * p.y + p.c);
        return A.choice({
          rng,
          question: intro,
          ask: ["What is the maximum point of ", A.math(eq), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(pt(p.x + p.b, p.a * p.y + p.c)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: `f(x + ${p.b}) moves the curve ${p.b} units left.`,
            },
            {
              content: A.math(pt(p.x - p.b, p.a * (p.y + p.c))),
              code: "POS.COMBINE",
              feedback: `Stretch first (× ${p.a}), then add ${p.c}.`,
            },
          ],
          solution: [
            {
              say: `x: ${p.x} − ${p.b} = ${p.x - p.b}. y: ${p.a} × ${p.y} + ${p.c} = ${p.a * p.y + p.c}.`,
            },
          ],
        });
      }
      case 2: {
        const eq = `y = -f(x) + ${p.c}`;
        const right = pt(p.x, -p.y + p.c);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: ["Describe the corresponding point on ", A.math(eq), "."],
          correct: [A.math(right), ", a minimum point"],
          distractors: [
            {
              content: [A.math(right), ", a maximum point"],
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "Reflecting in the x-axis turns a maximum into a minimum.",
            },
            {
              content: [A.math(pt(p.x, -(p.y + p.c))), ", a minimum point"],
              code: "POS.COMBINE",
              feedback: `Reflect first (−${p.y}), then add ${p.c}.`,
            },
            {
              content: [A.math(pt(-p.x, p.y + p.c)), ", a maximum point"],
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "−f(x) reflects in the x-axis, not the y-axis.",
            },
          ],
          solution: [
            {
              say: `Reflect in the x-axis: (${p.x}, ${-p.y}), a minimum. Then up ${p.c}: ${right}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Pia says ",
            A.math(`y = f(2x + ${2 * p.b})`),
            ` is y = f(x) stretched horizontally by scale factor ½ and then translated ${2 * p.b} units left.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. f(2x + ${2 * p.b}) = f(2(x + ${p.b})): after the stretch, the translation is only ${p.b} units left. (Or translate ${2 * p.b} left first, then stretch.)`,
              correct: true,
            },
            {
              text: "True. Read the transformations from the bracket in order.",
              code: "POS.COMBINE",
            },
            { text: `False. It moves ${2 * p.b} units right.`, code: "ALG.TRANSFORM.DIRECTION" },
          ],
          solution: [{ say: "Track a point: the x-coordinate solves 2x + c = original x." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(pt(p.x - p.b, p.a * p.y + p.c));
    return true;
  },
});
