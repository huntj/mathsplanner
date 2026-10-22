/**
 * @statement AL-P2.9a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.9a: Apply transformations y = af(x), y = f(x) + a, y = f(x + a), y = f(ax)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** A point (x, y) on y = f(x). */
  x: number;
  y: number;
  a: number;
  b: number;
}

const pt = (x: string | number, y: string | number) => `(${x}, ${y})`;

export default defineGenerator<Params>({
  id: "AL-P2.9a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRANSFORM.DIRECTION", "ALG.FUNCTION.ORDER"],

  params(rng) {
    const x = 2 * rng.int(-4, 4);
    const y = rng.int(-6, 6);
    const a = rng.int(2, 4);
    const b = rng.int(1, 5);
    if (x === 0 || y === 0 || Math.abs(x) === Math.abs(y))
      reject("a point off the axes with different coordinates");
    return { x, y, a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "The point ",
      A.math(pt(p.x, p.y)),
      " lies on the curve ",
      A.math("y = f(x)"),
      ".",
    ];
    switch (depth) {
      case 1: {
        const right = pt(toLatex(frac(p.x, p.a)), p.y);
        return A.choice({
          rng,
          question: intro,
          ask: ["What is the corresponding point on ", A.math(`y = f(${p.a}x)`), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(pt(p.a * p.x, p.y)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: `f(${p.a}x) is a horizontal stretch by scale factor 1/${p.a}: divide the x-coordinate by ${p.a}.`,
            },
            {
              content: A.math(pt(p.x, p.a * p.y)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "A change inside the bracket acts on x, not y.",
            },
          ],
          solution: [
            { say: `Horizontal stretch, scale factor 1/${p.a}: (${p.x} ÷ ${p.a}, ${p.y}).` },
          ],
        });
      }
      case 2: {
        const right = pt(p.x, p.a * p.y - p.b);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: ["What is the corresponding point on ", A.math(`y = ${p.a}f(x) - ${p.b}`), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(pt(p.x, p.a * (p.y - p.b))),
              code: "ALG.FUNCTION.ORDER",
              feedback: `Multiply f(x) by ${p.a} first, then subtract ${p.b}.`,
            },
            {
              content: A.math(pt(p.x - p.b, p.a * p.y)),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: "Subtracting outside f moves the curve down, not sideways.",
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(right))),
          solution: [{ say: `y-coordinate: ${p.a} × ${p.y} − ${p.b} = ${p.a * p.y - p.b}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Joe says ",
            A.math(`y = f\\left(\\frac{x}{${p.a}}\\right)`),
            ` is a horizontal stretch of y = f(x) with scale factor 1/${p.a}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Replacing x with x/${p.a} stretches horizontally by scale factor ${p.a}: each x-coordinate is multiplied by ${p.a}.`,
              correct: true,
            },
            { text: "True. Dividing x shrinks the graph.", code: "ALG.TRANSFORM.DIRECTION" },
            {
              text: `False. It is a vertical stretch by scale factor ${p.a}.`,
              code: "ALG.TRANSFORM.DIRECTION",
            },
          ],
          solution: [
            {
              say: "Changes inside the bracket act on x and do the opposite of what they look like.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question).includes(pt(p.x, p.a * p.y - p.b));
    return true;
  },
});
