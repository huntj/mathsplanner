/**
 * @statement GF-A19.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A19.c: Solve simultaneous equations graphically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

export interface Params {
  m1: number;
  m2: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "GF-A19.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.PAIR", "ALG.GRAPH.SOLUTION-Y"],

  params(rng) {
    const p = { m1: rng.int(1, 3), m2: -rng.int(1, 3), x: rng.int(-3, 3), y: rng.int(-3, 4) };
    const c1 = p.y - p.m1 * p.x;
    const c2 = p.y - p.m2 * p.x;
    if (p.x === 0 || p.y === 0 || p.x === p.y || Math.abs(c1) > 6 || Math.abs(c2) > 6)
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
    const right = `x = ${p.x}, \\; y = ${p.y}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The graphs of ",
            A.math(lineLatex(p.m1, c1)),
            " and ",
            A.math(lineLatex(p.m2, c2)),
            " are drawn.",
            fig,
          ],
          ask: "What is the solution of the simultaneous equations?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x = ${p.y}, \\; y = ${p.x}`),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Read x across the horizontal axis and y up the vertical axis.",
            },
            {
              content: A.math(`x = 0, \\; y = ${c1}`),
              code: "ALG.GRAPH.SOLUTION-Y",
              feedback:
                "That is where one line crosses the y-axis. The solution is where the lines cross each other.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "The lines cross at ", math: coord([p.x, p.y]) }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Two lines cross at ", A.math(coord([p.x, p.y])), "."],
          ask: "Which pair of equations could they be?",
          correct: A.math(`${lineLatex(p.m1, c1)}, \\; ${lineLatex(p.m2, c2)}`),
          distractors: [
            {
              content: A.math(`${lineLatex(p.m1, c1 + 1)}, \\; ${lineLatex(p.m2, c2)}`),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: `Substitute x = ${p.x} into each: both must give y = ${p.y}.`,
            },
            {
              content: A.math(`${lineLatex(p.m1, c1)}, \\; ${lineLatex(p.m1, c2)}`),
              code: "ALG.SIMULTANEOUS.PAIR",
              feedback: "Lines with the same gradient are parallel and never cross.",
            },
          ],
          solution: [{ say: `Both equations give y = ${p.y} when x = ${p.x}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ned says ",
            A.math(lineLatex(p.m1, c1)),
            " and ",
            A.math(lineLatex(p.m1, c1 + 3)),
            " have exactly one solution.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Both have gradient ${p.m1}, so the lines are parallel and never cross: there is no solution.`,
              correct: true,
            },
            { text: "True. Two straight lines always cross once.", code: "ALG.SIMULTANEOUS.PAIR" },
            {
              text: "True. The solution is where they cross the y-axis.",
              code: "ALG.GRAPH.SOLUTION-Y",
            },
          ],
          solution: [{ say: "Graphically, solutions are crossing points." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `x = ${p.x}, \\; y = ${p.y}`;
    return true;
  },
});
