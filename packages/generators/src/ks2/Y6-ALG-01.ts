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
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** Cost = rate × n + fee. */
  rate: number;
  fee: number;
  n: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-ALG-01",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
            }),
          [
            {
              statement:
                "Using $P = 4s$ for a square's perimeter, Ivy says a square with sides of 7 cm has perimeter 28 cm.",
              truth: true,
              right: "True. P = 4 × 7 = 28.",
              wrong: [
                ["False. It is 11 cm, as 4 + 7 = 11.", "NPV.ORDER.LEFT-TO-RIGHT"],
                ["False. It is 47 cm."],
              ],
            },
            {
              statement: "Using $C = 10 + 3n$, Max says $n = 4$ gives $C = 52$.",
              truth: false,
              right: "False. Multiply first: 3 × 4 = 12, then 10 + 12 = 22.",
              wrong: [
                ["True. 10 + 3 = 13, and 13 × 4 = 52.", "NPV.ORDER.LEFT-TO-RIGHT"],
                ["True. Work from left to right.", "NPV.ORDER.LEFT-TO-RIGHT"],
              ],
            },
            {
              claim: "In $y = 2x$, y is bigger than x.",
              truth: "sometimes",
              right: "Sometimes. When x = 3, y = 6 is bigger; but when x = 0, y = 0 is the same.",
              wrong: [
                ["Always. Doubling makes things bigger."],
                ["Never. y and x are the same.", "ALG.SOLVE.WRONG-INVERSE"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.rate * p.n + p.fee;
    if (question.archetype === "reverse") return numberAnswer(question) === p.n;
    return true;
  },
});
