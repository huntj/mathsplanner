/**
 * @statement Y6-ALG-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-ALG-01: Use simple formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Cost = rate × n + fee. */
  rate: number;
  fee: number;
  n: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-ALG-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const rate = rng.int(2, numbers === "friendly" ? 5 : 12);
    const fee = rng.int(2, numbers === "stretch" ? 25 : 10);
    const n = rng.int(2, numbers === "stretch" ? 20 : 9);
    if (rate === fee || n === fee) reject("different numbers");
    return { rate, fee, n, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const cost = p.rate * p.n + p.fee;
    const formula = [
      "The cost in pounds, C, of hiring a bike for h hours is ",
      A.math(`C = ${p.fee} + ${p.rate}h`),
      ".",
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: formula,
          ask: `Find the cost of hiring a bike for ${p.n} hours.`,
          answer: A.number(cost),
          wrong: wrongs(cost, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.fee + p.rate) * p.n),
              feedback: `${p.rate}h means ${p.rate} × h, which is worked out before adding ${p.fee}.`,
            },
          ]),
          solution: [
            { say: `C = ${p.fee} + ${p.rate} × ${p.n} = ${p.fee} + ${p.rate * p.n} = ${cost}.` },
          ],
        });
      case 2:
        return A.reverse({
          question: formula,
          ask: `A hire cost £${cost}. For how many hours was the bike hired?`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number((cost + p.fee) / p.rate),
              feedback: `Undo adding ${p.fee} by subtracting it: ${cost} − ${p.fee} = ${cost - p.fee}, then divide by ${p.rate}.`,
            },
          ]),
          solution: [
            {
              say: `${cost} − ${p.fee} = ${cost - p.fee}, and ${cost - p.fee} ÷ ${p.rate} = ${p.n} hours.`,
            },
          ],
        });
      default: {
        const said = p.claimTrue ? cost : (p.fee + p.rate) * p.n;
        return A.trueOrFalseWhy({
          rng,
          statement: [...formula, ` Kit says ${p.n} hours costs £${said}.`],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${p.rate} × ${p.n} = ${p.rate * p.n}, then add ${p.fee}: ${cost}.`,
                  correct: true,
                },
                {
                  text: `False. Work from left to right: (${p.fee} + ${p.rate}) × ${p.n}.`,
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                },
                { text: "False. You cannot put numbers into a formula." },
              ]
            : [
                {
                  text: `False. ${p.rate}h means ${p.rate} × ${p.n}, which comes before the addition: ${p.fee} + ${p.rate * p.n} = ${cost}.`,
                  correct: true,
                },
                { text: "True. Work from left to right.", code: "NPV.ORDER.LEFT-TO-RIGHT" },
                { text: "True. The cost goes up with the hours, so it must be right." },
              ],
          solution: [{ say: `C = ${p.fee} + ${p.rate} × ${p.n} = ${cost}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.rate * p.n + p.fee;
    if (question.archetype === "reverse") return numberAnswer(question) === p.n;
    return true;
  },
});
