/**
 * @statement Y8-ALG-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-08: Use linear graphs to estimate values of y for given x and vice versa, and find approximate
// solutions of simultaneous linear equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { clearOfOrigin, grid, lineLatex } from "../shared/alg.ts";

interface Params {
  /** Two lines y = m1 x + c1 and y = m2 x + c2 crossing at (x0, y0). */
  m1: number;
  m2: number;
  x0: number;
  y0: number;
  /** Depth 1: read x for this y on line 1. */
  y: number;
}

const HIDDEN = "Straight lines on a coordinate grid.";

export default defineGenerator<Params>({
  id: "Y8-ALG-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COORD.ORDER"],

  params(rng) {
    const m1 = rng.pick([1, 2, -1]);
    const m2 = rng.pick([-2, -1, 1, 3]);
    const x0 = rng.int(-3, 3);
    const y0 = rng.int(-3, 4);
    const [c1, c2] = [y0 - m1 * x0, y0 - m2 * x0];
    if (m1 === m2 || Math.abs(c1) > 6 || Math.abs(c2) > 6 || x0 === y0)
      reject("crossing lines on the grid");
    if (!clearOfOrigin(m1, c1) || !clearOfOrigin(m2, c2)) reject("lines clear of the origin label");
    const x = rng.int(-4, 4);
    const y = m1 * x + c1;
    if (Math.abs(y) > 6 || x === y) reject("a point on the grid");
    return { m1, m2, x0, y0, y };
  },

  build(p, depth, rng): QuestionDraft {
    const c1 = p.y0 - p.m1 * p.x0;
    const c2 = p.y0 - p.m2 * p.x0;
    const line1 = `${p.m1}*x + ${c1}`;
    const line2 = `${p.m2}*x + ${c2}`;
    switch (depth) {
      case 1: {
        const x = (p.y - c1) / p.m1;
        return A.standard({
          question: [
            "The graph shows the line ",
            A.math(lineLatex(p.m1, c1)),
            ".",
            A.figure(grid(6, [line1], [], HIDDEN)),
          ],
          ask: ["Use the graph to find x when ", A.math(`y = ${p.y}`), "."],
          answer: A.number(x),
          wrong: wrongs(x, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.m1 * p.y + c1),
              feedback: `Find ${p.y} on the y-axis (up the side), go across to the line, then down to the x-axis.`,
            },
          ]),
          solution: [{ say: `From y = ${p.y} go across to the line and read down: x = ${x}.` }],
        });
      }
      case 2:
        return A.standard({
          question: [
            "The graph shows the lines ",
            A.math(lineLatex(p.m1, c1)),
            " and ",
            A.math(lineLatex(p.m2, c2)),
            ".",
            A.figure(grid(6, [line1, line2], [], HIDDEN)),
          ],
          ask: "Use the graph to solve the two equations together. What is x?",
          answer: A.number(p.x0),
          wrong: wrongs(p.x0, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.y0),
              feedback: `That is the y-coordinate of the crossing point. x is the across value: ${p.x0}.`,
            },
          ]),
          solution: [
            { say: `The lines cross at (${p.x0}, ${p.y0}), so x = ${p.x0} and y = ${p.y0}.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Two lines cross at ",
            A.math(`(${p.x0}, ${p.y0})`),
            ". Sam says the solution of their simultaneous equations is ",
            A.math(`x = ${p.y0},\\ y = ${p.x0}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The crossing point (${p.x0}, ${p.y0}) gives x = ${p.x0} and y = ${p.y0}: x comes first.`,
              correct: true,
            },
            { text: "True. The coordinates can be read either way.", code: "ALG.COORD.ORDER" },
            { text: "True. The solution is wherever a line meets an axis." },
          ],
          solution: [
            {
              say: "The solution of two simultaneous equations is the point on both lines, where they cross.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    if (question.key.depth === 2) return numberAnswer(question) === p.x0;
    const c1 = p.y0 - p.m1 * p.x0;
    return p.m1 * numberAnswer(question) + c1 === p.y;
  },
});
