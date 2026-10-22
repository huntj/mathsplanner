/**
 * @statement AL-P6.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.3: Know logₐx as the inverse of aˣ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  n: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P6.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LOG.INVERSE"],

  params(rng) {
    const a = rng.pick([2, 3, 4, 5]);
    const n = a === 2 ? rng.int(3, 7) : rng.int(2, 4);
    if (n === a) reject("a power different from the base");
    return { a, n, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const big = p.a ** p.n;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Work out ", A.math(`\\log_{${p.a}} ${big}`), "."],
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "ALG.LOG.INVERSE",
              value: A.number(big / p.a),
              feedback: `log₍${p.a}₎ ${big} asks: ${p.a} to what power gives ${big}?`,
            },
          ]),
          solution: [{ say: `${p.a}^${p.n} = ${big}, so log base ${p.a} of ${big} is ${p.n}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write ", A.math(`${p.a}^${p.n} = ${big}`), " using logarithms."],
          correct: A.math(`\\log_{${p.a}} ${big} = ${p.n}`),
          distractors: [
            {
              content: A.math(`\\log_{${p.n}} ${big} = ${p.a}`),
              code: "ALG.LOG.INVERSE",
              feedback: "The base of the power is the base of the log.",
            },
            {
              content: A.math(`\\log_{${big}} ${p.a} = ${p.n}`),
              code: "ALG.LOG.INVERSE",
              feedback: "aⁿ = b becomes logₐ b = n.",
            },
          ],
          solution: [{ say: "aⁿ = b ⇔ logₐ b = n." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? ["Vic says ", A.math(`\\log_{${p.a}} 1 = 0`), "."]
            : ["Vic says ", A.math(`\\log_{${p.a}} ${p.a} = 0`), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${p.a}⁰ = 1, so the power needed is 0.`, correct: true },
                { text: `False. It is ${p.a}.`, code: "ALG.LOG.INVERSE" },
                { text: "False. log of 1 is 1." },
              ]
            : [
                {
                  text: `False. ${p.a}¹ = ${p.a}, so log base ${p.a} of ${p.a} is 1.`,
                  correct: true,
                },
                { text: "True. The log of the base is always 0.", code: "ALG.LOG.INVERSE" },
                { text: `True. ${p.a} ÷ ${p.a} − 1 = 0.`, code: "ALG.LOG.INVERSE" },
              ],
          solution: [{ say: "logₐ 1 = 0 and logₐ a = 1 for every base a." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 2) return chosenText(question).startsWith(`\\log_{${p.a}}`);
    return true;
  },
});
