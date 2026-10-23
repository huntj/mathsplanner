/**
 * @statement Y8-ALG-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-08.b: Find approximate solutions of simultaneous linear equations from graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m1: number;
  m2: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-08.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COORD.ORDER", "ALG.GRAPH.SOLUTION-Y", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = { m1: rng.int(1, 3), m2: -rng.int(1, 2), x: rng.int(-3, 3), y: rng.int(-3, 4) };
    const c1 = p.y - p.m1 * p.x;
    const c2 = p.y - p.m2 * p.x;
    if (p.x === 0 || p.y === 0 || p.x === p.y || Math.abs(c1) > 6 || Math.abs(c2) > 6 || c1 === p.y)
      reject("a crossing that fits");
    if (!clearOfOrigin(p.m1, c1) || !clearOfOrigin(p.m2, c2))
      reject("lines clear of the origin label");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const c1 = p.y - p.m1 * p.x;
    const c2 = p.y - p.m2 * p.x;
    const fig = A.figure(
      grid(
        7,
        [poly([p.m1, c1]), poly([p.m2, c2])],
        [],
        "Two straight lines that cross on a coordinate grid.",
      ),
    );
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The graphs of ",
            A.math(lineLatex(p.m1, c1)),
            " and ",
            A.math(lineLatex(p.m2, c2)),
            " are drawn.",
            fig,
          ],
          ask: "Use the graph to find the x-value of the solution of the simultaneous equations.",
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.COORD.ORDER",
              value: A.number(p.y),
              feedback: "That is the y-value. Read x straight down from the crossing point.",
            },
          ]),
          solution: [{ say: `The lines cross at (${p.x}, ${p.y}), so x = ${p.x}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The graphs of ",
                A.math(lineLatex(p.m1, c1)),
                " and ",
                A.math(lineLatex(p.m2, c2)),
                " are drawn.",
                fig,
              ],
              ask: "Find the y-value of the solution of the simultaneous equations.",
            },
          ],
          answer: A.number(p.y),
          wrong: signedWrongs(p.y, [
            {
              code: "ALG.GRAPH.SOLUTION-Y",
              value: A.number(c1),
              feedback:
                "That is where one line crosses the y-axis. The solution is where the two lines cross each other.",
            },
          ]),
          solution: [{ say: `Read across from the crossing point: y = ${p.y}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lee says the equations ",
            A.math(lineLatex(p.m1, c1)),
            " and ",
            A.math(`${2}y = ${lineLatex(2 * p.m1, 2 * c1).slice(4)}`),
            " have exactly one solution.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The second equation is the first one doubled, so both draw the same line: every point on it is a solution.",
              correct: true,
            },
            { text: "True. Two lines always cross at one point.", code: "ALG.SIMULTANEOUS.PAIR" },
            {
              text: "True. The solution is where the line crosses the y-axis.",
              code: "ALG.GRAPH.SOLUTION-Y",
            },
          ],
          solution: [{ say: "Divide the second equation by 2." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.y;
    return true;
  },
});
