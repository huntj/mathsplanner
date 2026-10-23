/**
 * @statement GF-A12.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A12.b: Recognise and sketch simple cubic graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { curveClearOfOrigin, grid } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  c: number;
  k: number;
  onCurve: boolean;
}

export default defineGenerator<Params>({
  id: "GF-A12.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SHAPE", "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    const p = { c: rng.int(-3, 3), k: rng.int(2, 4), onCurve: rng.bool() };
    if (
      p.c === 0 ||
      !curveClearOfOrigin((x) => x ** 3 + p.c) ||
      !curveClearOfOrigin((x) => p.c - x ** 3)
    )
      reject("curves clear of the origin label");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const sgn = (c: number) => `${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which equation has an S-shaped (cubic) graph?"],
          correct: A.math(`y = x^3 ${sgn(p.c)}`),
          distractors: [
            {
              content: A.math(`y = x^2 ${sgn(p.c)}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "x² gives a U-shaped parabola.",
            },
            {
              content: A.math(`y = 3x ${sgn(p.c)}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "3x gives a straight line.",
            },
          ],
          solution: [{ say: "The x³ term gives the cubic shape." }],
        });
      case 2: {
        const right = `y = ${p.c} - x^3`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which equation does this graph show?",
            A.figure(grid(6, [`${p.c} - x^3`], [], "A cubic curve on a coordinate grid.")),
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`y = x^3 ${sgn(p.c)}`),
              code: "ALG.GRAPH.SHAPE",
              feedback:
                "y = x³ rises from left to right; this curve falls, so the x³ term is negative.",
            },
            {
              content: A.math(`y = ${p.c} - x^2`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "−x² gives an upside-down U, not an S-shape.",
            },
          ],
          solution: [
            { say: `It falls from left to right like −x³ and crosses the y-axis at ${p.c}.` },
          ],
        });
      }
      default: {
        const y = p.onCurve ? -(p.k ** 3) : p.k ** 3;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Hugo says the point ",
            A.math(coord([-p.k, y])),
            " lies on the curve ",
            A.math("y = x^3"),
            ".",
          ],
          truth: p.onCurve,
          reasons: p.onCurve
            ? [
                { text: `True. (−${p.k})³ = −${p.k ** 3}.`, correct: true },
                {
                  text: `False. (−${p.k})³ = ${p.k ** 3}, since cubes are positive.`,
                  code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
                },
                { text: "False. Cubic curves do not have points with negative x." },
              ]
            : [
                { text: `False. (−${p.k})³ = −${p.k ** 3}, not ${p.k ** 3}.`, correct: true },
                {
                  text: "True. Cubing a negative number gives a positive number.",
                  code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
                },
                {
                  text: "True. The cubic curve is symmetrical about the y-axis.",
                  code: "ALG.GRAPH.SHAPE",
                },
              ],
          solution: [{ say: "A negative number cubed is negative." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question) === `y = ${p.c} - x^3`;
    return true;
  },
});
