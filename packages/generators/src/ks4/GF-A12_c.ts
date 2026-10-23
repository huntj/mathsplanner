/**
 * @statement GF-A12.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A12.c: Recognise and sketch the reciprocal graph y = 1/x
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { grid } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-A12.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SHAPE"],

  params(rng) {
    const p = { a: rng.pick([2, 4, 6, 8, 12]), k: rng.pick([2, 4]) };
    if (p.a % p.k !== 0) reject("a whole-number value");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a / p.k;
        return A.standard({
          question: [
            "For the graph of ",
            A.math(`y = \\frac{${p.a}}{x}`),
            ", find y when ",
            A.math(`x = ${p.k}`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.SHAPE",
              value: A.number(p.a * p.k),
              feedback: `Divide: ${p.a} ÷ ${p.k}.`,
            },
          ]),
          solution: [{ say: "", math: `y = \\frac{${p.a}}{${p.k}} = ${v}` }],
        });
      }
      case 2: {
        const right = `y = \\frac{${p.a}}{x}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which equation does this graph show?",
            A.figure(grid(6, [`${p.a}/x`], [], "A two-part curve on a coordinate grid.")),
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`y = ${p.a}x`),
              code: "ALG.GRAPH.SHAPE",
              feedback: `y = ${p.a}x is a straight line through the origin.`,
            },
            {
              content: A.math(`y = x^2 - ${p.a}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "That is a U-shaped parabola.",
            },
          ],
          solution: [
            {
              say: `Two separate branches that approach the axes: the reciprocal graph. At x = 1, y = ${p.a}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy says the graph of ",
            A.math(`y = \\frac{${p.a}}{x}`),
            " crosses the y-axis.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. x = 0 is impossible (you cannot divide by 0), so the curve never reaches the y-axis; it gets closer and closer to it.`,
              correct: true,
            },
            { text: `True. It crosses at y = ${p.a}.`, code: "ALG.GRAPH.SHAPE" },
            { text: "True. Every graph crosses the y-axis.", code: "ALG.GRAPH.SHAPE" },
          ],
          solution: [{ say: "The axes are asymptotes of the reciprocal graph." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a / p.k;
    if (question.key.depth === 2) return chosenText(question) === `y = \\frac{${p.a}}{x}`;
    return true;
  },
});
