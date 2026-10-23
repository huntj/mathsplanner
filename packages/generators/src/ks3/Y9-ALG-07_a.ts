/**
 * @statement Y9-ALG-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-07.a: Use linear graphs to estimate values
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  c: number;
  x: number;
  x2: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-07.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SOLUTION-Y", "ALG.COORD.ORDER"],

  params(rng) {
    const p = {
      m: rng.int(1, 2) * rng.pick([1, -1]),
      c: rng.int(-3, 3),
      x: rng.int(-3, 3),
      x2: rng.int(-3, 3),
    };
    const k = p.m * p.x + p.c;
    if (
      p.c === 0 ||
      p.x === 0 ||
      p.x2 === 0 ||
      k === p.x ||
      Math.abs(k) > 6 ||
      Math.abs(p.m * p.x2 + p.c) > 6 ||
      p.m * p.x2 + p.c === p.x2
    )
      reject("readings that fit and differ");
    if (!clearOfOrigin(p.m, p.c)) reject("a line clear of the origin label");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const k = p.m * p.x + p.c;
    const fig = A.figure(grid(7, [poly([p.m, p.c])], [], "A straight line on a coordinate grid."));
    switch (depth) {
      case 1:
        return A.standard({
          question: ["The graph of ", A.math(lineLatex(p.m, p.c)), " is drawn.", fig],
          ask: ["Use the graph to solve ", A.math(`${poly([p.m, p.c])} = ${k}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(k),
              feedback: `Find ${k} on the y-axis, go across to the line, then read down to the x-axis.`,
            },
          ]),
          solution: [{ say: `The line reaches y = ${k} at x = ${p.x}.` }],
        });
      case 2: {
        const v = p.m * p.x2 + p.c;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph of ", A.math(lineLatex(p.m, p.c)), " is drawn.", fig],
              ask: ["Read off the value of y when ", A.math(`x = ${p.x2}`), "."],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.x2),
              feedback: `Go from x = ${p.x2} on the horizontal axis up or down to the line, then across to read y.`,
            },
          ]),
          solution: [{ say: `At x = ${p.x2}, the line is at y = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dan says the solution of ",
            A.math(`${poly([p.m, p.c])} = 0`),
            " is where the line crosses the y-axis.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. "= 0" means y = 0, which is where the line crosses the x-axis. The y-axis crossing is at y = ${p.c}.`,
              correct: true,
            },
            { text: "True. The y-intercept is the solution.", code: "ALG.GRAPH.SOLUTION-Y" },
            { text: "True. x = 0 there.", code: "ALG.GRAPH.SOLUTION-Y" },
          ],
          solution: [{ say: "Solving f(x) = k: find where the graph meets the line y = k." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.m * p.x2 + p.c;
    return true;
  },
});
