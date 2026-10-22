/**
 * @statement AL-P6.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.1: Know and use y = aˣ and its graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
  x: number;
  d: 2 | 3 | 4;
}

export default defineGenerator<Params>({
  id: "AL-P6.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.TIMES-INDEX", "ALG.GRAPH.SHAPE", "NPV.INDEX.NEGATIVE"],

  params(rng) {
    return {
      k: rng.int(2, 6),
      a: rng.pick([2, 3, 5]),
      x: rng.int(3, 5),
      d: rng.pick([2, 3, 4] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const y = p.k * p.a ** p.x;
        return A.standard({
          question: [
            "Find the value of ",
            A.math(`y = ${p.k} \\times ${p.a}^x`),
            ` when x = ${p.x}.`,
          ],
          answer: A.number(y),
          wrong: wrongs(y, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(p.k * p.a * p.x),
              feedback: `${p.a}^${p.x} means ${p.x} lots of ${p.a} multiplied together.`,
            },
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number((p.k * p.a) ** p.x),
              feedback: `Only the ${p.a} is raised to the power; multiply by ${p.k} afterwards.`,
            },
          ]),
          solution: [{ say: `${p.a}^${p.x} = ${p.a ** p.x}, and ${p.k} × ${p.a ** p.x} = ${y}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which describes the graph of ",
            A.math(`y = \\left(\\frac{1}{${p.d}}\\right)^x`),
            "?",
          ],
          correct:
            "It decreases from left to right, passes through (0, 1) and approaches the x-axis as x gets large.",
          distractors: [
            {
              content: "It increases from left to right and passes through (0, 1).",
              code: "ALG.GRAPH.SHAPE",
              feedback: `The base 1/${p.d} is less than 1, so the values get smaller as x increases.`,
            },
            {
              content: `It decreases and passes through (0, 1/${p.d}).`,
              code: "ALG.GRAPH.SHAPE",
              feedback: `Any number to the power 0 is 1, so it passes through (0, 1).`,
            },
            {
              content: "It is a straight line through the origin.",
              code: "ALG.GRAPH.SHAPE",
              feedback: "Exponential graphs are curves that never touch the x-axis.",
            },
          ],
          solution: [
            { say: `(1/${p.d})^x = ${p.d}^(−x): a reflection of y = ${p.d}^x in the y-axis.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says ",
            A.math(`y = ${p.a}^x`),
            " is negative for large negative values of x.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.a}^x is always positive: for negative x it is 1/${p.a}^|x|, a small positive number.`,
              correct: true,
            },
            { text: "True. Negative x gives negative y.", code: "ALG.GRAPH.SHAPE" },
            { text: `True. ${p.a}^(−3) = −${p.a ** 3}.`, code: "NPV.INDEX.NEGATIVE" },
          ],
          solution: [
            { say: "The x-axis is an asymptote: the curve gets close to it but never reaches it." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.a ** p.x;
    if (question.key.depth === 2)
      return chosenText(question).startsWith("It decreases from left to right, passes");
    return true;
  },
});
