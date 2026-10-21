/**
 * @statement GF-A11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A11: Identify and interpret roots, intercepts, turning points of quadratic functions
// graphically; deduce roots algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-A11",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.QUADRATIC.TURNING"],

  params(rng) {
    const a = rng.int(-5, 3);
    const b = a + 2 * rng.int(1, 3);
    const tx = (a + b) / 2;
    const ty = (tx - a) * (tx - b);
    if (a === 0 || b === 0 || ty < -8 || a * b > 8 || Math.abs(a) === Math.abs(b))
      reject("a parabola that fits the grid, roots off the origin");
    if (!curveClearOfOrigin((x) => (x - a) * (x - b))) reject("a curve clear of the origin label");
    return { a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const eq = poly([1, -(p.a + p.b), p.a * p.b]);
    const tx = (p.a + p.b) / 2;
    const ty = (tx - p.a) * (tx - p.b);
    const fig = grid(8, [eq], [], "A U-shaped curve on a coordinate grid.");
    const roots = `x = ${p.a} \\text{ and } x = ${p.b}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["The graph of ", A.math(`y = ${eq}`), " is shown.", A.figure(fig)],
          ask: "What are the roots of the equation y = 0?",
          correct: A.math(roots),
          distractors: [
            {
              content: A.math(`x = ${-p.a} \\text{ and } x = ${-p.b}`),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "Read where the curve crosses the x-axis.",
            },
            {
              content: A.math(`x = ${tx}`),
              code: "ALG.QUADRATIC.TURNING",
              feedback:
                "That is the line of symmetry, through the turning point. The roots are where y = 0.",
            },
            {
              content: A.math(`y = ${p.a * p.b}`),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "That is the y-intercept. Roots are on the x-axis.",
            },
          ].filter(distinctFrom(A.math(roots))),
          solution: [{ say: "The curve crosses the x-axis at ", math: roots }],
        });
      case 2: {
        const right = coord([tx, ty]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The graph of ", A.math(`y = ${eq}`), " is shown.", A.figure(fig)],
          ask: "What are the coordinates of the turning point?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([0, p.a * p.b])),
              code: "ALG.QUADRATIC.TURNING",
              feedback: "That is where the curve crosses the y-axis.",
            },
            { content: A.math(coord([ty, tx])), feedback: "x first, then y." },
            {
              content: A.math(coord([-tx, ty])),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "The turning point is halfway between the roots.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `Halfway between the roots ${p.a} and ${p.b} is x = ${tx}; y = (${tx} − ${p.a})(${tx} − ${p.b}) = ${ty}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jay says the roots of ",
            A.math(
              `(x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)})(x ${p.b < 0 ? "+" : "-"} ${Math.abs(p.b)}) = 0`,
            ),
            ` are x = ${-p.a} and x = ${-p.b}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. A product is 0 when a factor is 0: x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)} = 0 gives x = ${p.a}, and the other gives x = ${p.b}.`,
              correct: true,
            },
            {
              text: "True. Read the numbers straight out of the brackets.",
              code: "ALG.QUADRATIC.ROOT-SIGN",
            },
            {
              text: "True. The roots are where the curve crosses the y-axis.",
              code: "ALG.QUADRATIC.TURNING",
            },
          ],
          solution: [{ say: "Set each bracket equal to zero and solve: ", math: roots }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `x = ${p.a} \\text{ and } x = ${p.b}`;
    if (question.archetype === "varied-form") {
      const tx = (p.a + p.b) / 2;
      return chosenText(question) === coord([tx, (tx - p.a) * (tx - p.b)]);
    }
    return true;
  },
});
