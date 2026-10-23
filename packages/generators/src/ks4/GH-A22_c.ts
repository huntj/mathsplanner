/**
 * @statement GH-A22.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A22.c: Use set notation for solution sets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GH-A22.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.FLIP"],

  params(rng) {
    const a = rng.int(-6, 3);
    return { a, b: a + rng.int(3, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `\\{x : ${p.a} < x \\le ${p.b}\\}`;
        return A.choice({
          rng,
          question: ["Write ", A.math(`${p.a} < x \\le ${p.b}`), " in set notation."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\{${p.a}, ${p.b}\\}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "That set has only the two end values in it.",
            },
            {
              content: A.math(`\\{x : ${p.a} \\le x < ${p.b}\\}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "Keep the same inequality signs at each end.",
            },
          ],
          solution: [{ say: "Read it as “the set of x such that …”: ", math: right }],
        });
      }
      case 2: {
        const v = p.b - p.a;
        return A.standard({
          question: [
            "How many integers are in the set ",
            A.math(`\\{x : ${p.a} \\le x < ${p.b}, \\; x \\in \\mathbb{Z}\\}`),
            "?",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.INEQUALITY.FLIP",
              value: A.number(v + 1),
              feedback: `${p.b} is not included (x < ${p.b}), but ${p.a} is.`,
            },
          ]),
          solution: [{ say: `The integers from ${p.a} to ${p.b - 1}: ${v} of them.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Cy says the set ", A.math(`\\{x : x > ${p.b}\\}`), ` includes ${p.b}.`],
          truth: false,
          reasons: [
            {
              text: `False. x > ${p.b} is strict, so ${p.b} itself is not included; {x : x ≥ ${p.b}} would include it.`,
              correct: true,
            },
            {
              text: "True. The number in the set is always included.",
              code: "ALG.INEQUALITY.FLIP",
            },
            { text: "True. > and ≥ mean the same in set notation.", code: "ALG.INEQUALITY.FLIP" },
          ],
          solution: [{ say: "Strict inequalities leave out the end value." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `\\{x : ${p.a} < x \\le ${p.b}\\}`;
    if (question.key.depth === 2) return numberAnswer(question) === p.b - p.a;
    return true;
  },
});
