/**
 * @statement GF-A12.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A12.a: Recognise and sketch linear and quadratic graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

const SHAPES = [
  "A U-shaped curve (a parabola)",
  "An upside-down U-shaped curve",
  "A straight line",
];

interface Params {
  c: number;
  shape: number;
  m: number;
}

const expr = (p: Params, shape: number) =>
  shape === 0
    ? `x^2 ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`
    : shape === 1
      ? `${p.c} - x^2`
      : `${p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`;

export default defineGenerator<Params>({
  id: "GF-A12.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SHAPE"],

  params(rng) {
    const p = { c: rng.int(-4, 4), shape: rng.int(0, 2), m: rng.int(2, 3) };
    if (p.c === 0) reject("a curve off the origin");
    const f = (x: number) =>
      p.shape === 0 ? x * x + p.c : p.shape === 1 ? p.c - x * x : p.m * x + p.c;
    if (!curveClearOfOrigin(f)) reject("a curve clear of the origin label");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["What shape is the graph of ", A.math(`y = ${expr(p, p.shape)}`), "?"],
          correct: SHAPES[p.shape] as string,
          distractors: SHAPES.filter((_, i) => i !== p.shape).map((s) => ({
            content: s,
            code: "ALG.GRAPH.SHAPE",
            feedback:
              "An x² term makes a curve; its sign decides whether it opens upwards or downwards.",
          })),
          solution: [
            {
              say:
                p.shape === 2
                  ? "There is no x² term, so it is a straight line."
                  : `The x² term has a ${p.shape === 0 ? "positive" : "negative"} coefficient.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which equation does this graph show?",
            A.figure(grid(6, [expr(p, p.shape)], [], "A graph on a coordinate grid.")),
          ],
          correct: A.math(`y = ${expr(p, p.shape)}`),
          distractors: [0, 1, 2]
            .filter((s) => s !== p.shape)
            .map((s) => ({
              content: A.math(`y = ${expr(p, s)}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "Check the shape and where it crosses the y-axis.",
            })),
          solution: [{ say: `${SHAPES[p.shape]} crossing the y-axis at ${p.c}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gina says the graph of ",
            A.math(`y = x^2 + ${p.m}x`),
            " is a straight line, because there is an x term.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Any x² term makes the graph a parabola, whatever other terms there are.",
              correct: true,
            },
            { text: "True. A graph with an x term is linear.", code: "ALG.GRAPH.SHAPE" },
            { text: "True. Two terms always make a straight line.", code: "ALG.GRAPH.SHAPE" },
          ],
          solution: [
            { say: "The highest power of x decides the shape: here it is 2, a quadratic." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === SHAPES[p.shape];
    return true;
  },
});
