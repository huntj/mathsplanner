/**
 * @statement GH-A17
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A17: Find approximate solutions to linear equations using a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: y = mx + c, solved for y = k at x = x1. */
  m: number;
  c: number;
  x1: number;
  /** Depth 2: a second line through the crossing point (x2, y2). */
  m2: number;
  x2: number;
  y2: number;
}

export default defineGenerator<Params>({
  id: "GH-A17",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SOLUTION-Y"],

  params(rng) {
    const m = rng.pick([-2, -1, 1, 2, 3]);
    const c = rng.int(-4, 4);
    const x1 = rng.int(-3, 3);
    const x2 = rng.int(-3, 3);
    const y2 = m * x2 + c;
    const m2 = rng.pick([-3, -2, -1, 1, 2, 3]);
    const k = m * x1 + c;
    const c2 = y2 - m2 * x2;
    if (
      m2 === m ||
      x2 === 0 ||
      x1 === k ||
      x2 === y2 ||
      Math.abs(k) > 8 ||
      Math.abs(y2) > 8 ||
      Math.abs(c2) > 9
    )
      reject("readable crossings that differ from their y-values");
    if (!clearOfOrigin(m, c) || !clearOfOrigin(m2, c2)) reject("lines clear of the origin label");
    return { m, c, x1, m2, x2, y2 };
  },

  build(p, depth, rng): QuestionDraft {
    const line = lineLatex(p.m, p.c);
    switch (depth) {
      case 1: {
        const k = p.m * p.x1 + p.c;
        return A.standard({
          question: [
            "The graph of ",
            A.math(line),
            " is drawn.",
            A.figure(grid(8, [poly([p.m, p.c])])),
          ],
          ask: ["Use the graph to solve ", A.math(`${poly([p.m, p.c])} = ${k}`), "."],
          answer: A.number(p.x1),
          wrong: [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(k),
              feedback: `Find where the line meets y = ${k}, then read down to the x-axis.`,
            },
          ],
          solution: [{ say: `Go across from y = ${k} to the line, then down: x = ${p.x1}.` }],
        });
      }
      case 2: {
        const c2 = p.y2 - p.m2 * p.x2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The graphs of ",
                A.math(line),
                " and ",
                A.math(lineLatex(p.m2, c2)),
                " are drawn.",
                A.figure(grid(8, [poly([p.m, p.c]), poly([p.m2, c2])])),
              ],
              ask: [
                "Use the graphs to solve ",
                A.math(`${poly([p.m, p.c])} = ${poly([p.m2, c2])}`),
                ".",
              ],
            },
          ],
          answer: A.number(p.x2),
          wrong: [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(p.y2),
              feedback: "The solution is the x-coordinate of the crossing point.",
            },
          ],
          solution: [{ say: `The lines cross at (${p.x2}, ${p.y2}), so x = ${p.x2}.` }],
        });
      }
      default: {
        const k = p.m * p.x1 + p.c;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Leo says you can solve ",
            A.math(`${poly([p.m, p.c])} = ${k}`),
            " by reading where the graph of ",
            A.math(line),
            " crosses the x-axis.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The x-axis is where y = 0. To solve this, read where the line meets y = ${k}.`,
              correct: true,
            },
            {
              text: "True. Solutions are always where a graph crosses the x-axis.",
              code: "ALG.GRAPH.SOLUTION-Y",
            },
            { text: "True. Read the y-intercept instead.", code: "ALG.GRAPH.SOLUTION-Y" },
          ],
          solution: [
            {
              say: `Draw the line y = ${k} and read the x-coordinate where it meets ${line.replace("y = ", "y = ")}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x1;
    if (question.key.depth === 2) return numberAnswer(question) === p.x2;
    return true;
  },
});
