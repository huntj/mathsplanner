/**
 * @statement GH-A19
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A19: Solve linear/quadratic simultaneous equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** The line y = mx + n meets y = x² + px + q at x1 and x2. */
  m: number;
  n: number;
  x1: number;
  x2: number;
}

const coef = (p: Params) => ({ p: p.m - (p.x1 + p.x2), q: p.n + p.x1 * p.x2 });
const y = (p: Params, x: number) => p.m * x + p.n;
const sol = (pts: [number, number][]) =>
  pts.map(([x, yy]) => `x = ${x},\\ y = ${yy}`).join(" \\text{ and } ");

export default defineGenerator<Params>({
  id: "GH-A19",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.PAIR", "ALG.QUADRATIC.ROOT-SIGN", "ALG.EXPAND.NEGATIVE"],

  params(rng) {
    const x1 = rng.int(-5, 4);
    const x2 = rng.int(x1 + 1, 5);
    const m = rng.int(-3, 3);
    const n = rng.int(-6, 6);
    const p = { m, n, x1, x2 };
    const { p: b, q } = coef(p);
    if (
      x1 === 0 ||
      x2 === 0 ||
      x1 === -x2 ||
      m === 0 ||
      y(p, x1) === y(p, x2) ||
      b === 0 ||
      q === 0
    )
      reject("two clear crossing points");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const { p: b, q } = coef(p);
    const quad = `y = ${poly([1, b, q])}`;
    const line = lineLatex(p.m, p.n);
    const [y1, y2] = [y(p, p.x1), y(p, p.x2)];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Solve the simultaneous equations ", A.math(quad), " and ", A.math(line), "."],
          correct: A.math(
            sol([
              [p.x1, y1],
              [p.x2, y2],
            ]),
          ),
          distractors: [
            {
              content: A.math(
                sol([
                  [p.x1, y2],
                  [p.x2, y1],
                ]),
              ),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Substitute each x into the linear equation to find its own y.",
            },
            {
              content: A.math(
                sol([
                  [-p.x1, y(p, -p.x1)],
                  [-p.x2, y(p, -p.x2)],
                ]),
              ),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "Check the signs when solving the quadratic from its brackets.",
            },
            {
              content: A.math(`x = ${p.x1} \\text{ and } x = ${p.x2}`),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Each solution needs its y-value too.",
            },
          ],
          solution: [
            {
              say: "Set the two expressions for y equal: ",
              math: `${poly([1, b - p.m, q - p.n])} = 0`,
            },
            {
              say: "Factorise: ",
              math: `(x ${p.x1 < 0 ? "+" : "-"} ${Math.abs(p.x1)})(x ${p.x2 < 0 ? "+" : "-"} ${Math.abs(p.x2)}) = 0`,
            },
            {
              say: "Substitute each x into the line: ",
              math: sol([
                [p.x1, y1],
                [p.x2, y2],
              ]),
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Substituting ",
                A.math(line),
                " into ",
                A.math(quad),
                " gives a quadratic equation.",
              ],
              ask: "Write it in the form x² + bx + c = 0.",
            },
            {
              question: ["The line ", A.math(line), " meets the curve ", A.math(quad), "."],
              ask: "Show that the x-coordinates satisfy a quadratic equation, written in the form x² + bx + c = 0.",
            },
          ],
          answer: A.exact(`${poly([1, b - p.m, q - p.n])} = 0`),
          wrong: [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.exact(`${poly([1, b + p.m, q + p.n])} = 0`),
              feedback: "Subtract the whole of the line's expression from both sides.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${poly([1, b, q])} = ${poly([p.m, p.n])} \\Rightarrow ${poly([1, b - p.m, q - p.n])} = 0`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Ava says a straight line always meets a parabola at exactly two points.",
          truth: false,
          reasons: [
            {
              text: "False. A line can miss the curve, touch it once (a tangent), or cross it twice: the quadratic can have 0, 1 or 2 solutions.",
              correct: true,
            },
            { text: "True. Every quadratic equation has two solutions." },
            { text: "True. A parabola has two sides, so a line must cross both." },
          ],
          solution: [
            {
              say: "The number of meeting points is the number of solutions of the quadratic you get by substituting.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(
        sol([
          [p.x1, y(p, p.x1)],
          [p.x2, y(p, p.x2)],
        ]),
      );
    return true;
  },
});
