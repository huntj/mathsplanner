/**
 * @statement CM-SG8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG8: Use sigma notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  m: number;
  a: number;
  n: number;
}

const total = (p: Params) => {
  let s = 0;
  for (let r = p.k; r <= p.m; r++) s += 2 * r + 1;
  return s;
};

export default defineGenerator<Params>({
  id: "CM-SG8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIGMA.COUNT"],

  params(rng) {
    const k = rng.int(2, 5);
    return { k, m: k + rng.int(3, 5), a: rng.int(2, 7), n: rng.int(8, 25) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = total(p);
        return A.standard({
          question: ["Work out ", A.math(`\\sum_{r=${p.k}}^{${p.m}} (2r + 1)`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SIGMA.COUNT",
              value: A.number(v - (2 * p.m + 1)),
              feedback: `Include both ends: r runs from ${p.k} to ${p.m}, which is ${p.m - p.k + 1} terms.`,
            },
          ]),
          solution: [
            {
              say: `${Array.from({ length: p.m - p.k + 1 }, (_, i) => 2 * (p.k + i) + 1).join(" + ")} = ${v}.`,
            },
          ],
        });
      }
      case 2: {
        const right = `\\sum_{r=1}^{${p.n}} ${p.a}r`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Write ",
            A.math(`${p.a} + ${2 * p.a} + ${3 * p.a} + \\cdots + ${p.a * p.n}`),
            " in sigma notation.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\sum_{r=1}^{${p.a * p.n}} ${p.a}r`),
              code: "ALG.SIGMA.COUNT",
              feedback: `The top limit is the last value of r, not the last term: ${p.a}r = ${p.a * p.n} when r = ${p.n}.`,
            },
            {
              content: A.math(`\\sum_{r=${p.a}}^{${p.a * p.n}} r`),
              code: "ALG.SIGMA.COUNT",
              feedback: "That adds every whole number from the first to the last term.",
            },
          ],
          solution: [
            { say: `There are ${p.n} terms, each ${p.a} times its position: `, math: right },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lee says ",
            A.math(`\\sum_{r=1}^{${p.n}} ${p.a} = ${p.a}`),
            ", because there is no r to change.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The term ${p.a} is added once for each r from 1 to ${p.n}: the sum is ${p.n} × ${p.a} = ${p.n * p.a}.`,
              correct: true,
            },
            { text: "True. Without an r the sum has just one term.", code: "ALG.SIGMA.COUNT" },
            { text: "True. Sigma notation needs r in the expression.", code: "ALG.SIGMA.COUNT" },
          ],
          solution: [{ say: `${p.a} + ${p.a} + … + ${p.a} (${p.n} times).` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === total(p);
    if (question.key.depth === 2) return chosenText(question) === `\\sum_{r=1}^{${p.n}} ${p.a}r`;
    return true;
  },
});
