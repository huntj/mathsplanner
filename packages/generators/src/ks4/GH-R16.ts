/**
 * @statement GH-R16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-R16: Work with general iterative processes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A fish farm grows by `pct`% each year, then `out` fish are taken. */
  start: number;
  pct: 10 | 20;
  out: number;
  years: number;
  claimTrue: boolean;
}

const next = (p: Params, n: number) => (n * (100 + p.pct)) / 100 - p.out;
const after = (p: Params, years: number) => {
  let n = p.start;
  for (let i = 0; i < years; i++) n = next(p, n);
  return n;
};

export default defineGenerator<Params>({
  id: "GH-R16",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FUNCTION.ORDER", "ALG.ITERATION.SUBSTITUTE"],

  params(rng) {
    return {
      start: rng.pick([200, 400, 500, 600, 800, 1000]),
      pct: rng.pick([10, 20] as const),
      out: rng.pick([20, 30, 40, 50]),
      years: 3,
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const m = 1 + p.pct / 100;
    const intro = `A fish farm has ${p.start} fish. Each year the number of fish increases by ${p.pct}%, and then ${p.out} fish are sold.`;
    switch (depth) {
      case 1: {
        const one = next(p, p.start);
        return A.standard({
          question: intro,
          ask: "How many fish are there after one year?",
          answer: A.number(one),
          wrong: wrongs(one, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(Math.round((p.start - p.out) * m)),
              feedback: `Increase by ${p.pct}% first, then take away ${p.out}.`,
            },
          ]),
          solution: [{ say: `${p.start} × ${m} − ${p.out} = ${one}.` }],
        });
      }
      case 2: {
        const n = Math.round(after(p, p.years));
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: `How many fish are there after ${p.years} years? Give your answer to the nearest whole number.`,
            },
            {
              question: [
                "The number of fish after n years is given by ",
                A.math(`F_{n+1} = ${m}F_n - ${p.out}`),
                " with ",
                A.math(`F_0 = ${p.start}`),
                ".",
              ],
              ask: ["Work out ", A.math(`F_${p.years}`), " to the nearest whole number."],
            },
          ],
          answer: A.number(n, { accuracy: { dp: 0 } }),
          wrong: wrongs(n, [
            {
              code: "ALG.ITERATION.SUBSTITUTE",
              value: A.number(next(p, p.start)),
              feedback: "Use each year's answer as the starting number for the next year.",
            },
          ]),
          solution: [
            {
              say: `Year 1: ${after(p, 1)}. Year 2: ${Math.round(after(p, 2) * 100) / 100}. Year 3: ${Math.round(after(p, 3) * 1000) / 1000}, which is ${n} to the nearest whole number.`,
            },
          ],
        });
      }
      default: {
        const steady = (p.out * 100) / p.pct;
        const claimed = p.claimTrue ? steady : steady * 2;
        return A.trueOrFalseWhy({
          rng,
          statement: `Each year the number of fish on a farm increases by ${p.pct}%, then ${p.out} fish are sold. Ruth says that if the farm has ${claimed} fish, the number will stay the same every year.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${p.pct}% of ${steady} is ${p.out}, which is exactly the number sold.`,
                  correct: true,
                },
                {
                  text: "False. The number always grows, because the percentage increase comes first.",
                  code: "ALG.FUNCTION.ORDER",
                },
                { text: "False. The number of fish can never stay the same." },
              ]
            : [
                {
                  text: `False. ${p.pct}% of ${claimed} is ${(claimed * p.pct) / 100}, more than the ${p.out} sold, so the number grows. It stays the same at ${steady}.`,
                  correct: true,
                },
                {
                  text: "True. Any number of fish stays the same in the long run.",
                  code: "ALG.ITERATION.SUBSTITUTE",
                },
                { text: "True. The sale cancels the increase every year." },
              ],
          solution: [
            {
              say: `The number stays fixed when the increase equals the sale: ${p.pct}% of F = ${p.out}, so F = ${steady}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === next(p, p.start);
    if (question.key.depth === 2) return numberAnswer(question) === Math.round(after(p, p.years));
    return true;
  },
});
