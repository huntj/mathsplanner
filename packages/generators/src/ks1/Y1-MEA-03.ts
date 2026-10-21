/**
 * @statement Y1-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-03: Recognise and know the value of different coins and notes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coinName } from "../shared/mea.ts";

interface Params {
  coins: number[];
  /** Depth 2: how many 1p (or 2p) coins make this coin. */
  big: number;
  small: number;
  /** Depth 4: many small coins against one big one. */
  many: number[];
  one: number;
}

const SMALL = [1, 2, 5, 10];

export default defineGenerator<Params>({
  id: "Y1-MEA-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.MONEY.COIN-COUNT"],

  params(rng, numbers) {
    const pool = numbers === "friendly" ? [1, 2, 5, 10] : [1, 2, 5, 10, 20, 50, 100, 200];
    const coins = rng.shuffle(pool).slice(0, 4);
    const small = numbers === "stretch" ? rng.pick([2, 5, 10]) : 1;
    const big = rng.pick(
      [2, 5, 10, 20, 50, 100].filter((c) => c > small && c % small === 0 && c / small <= 20),
    );
    const many = Array.from({ length: rng.int(3, 4) }, () => rng.pick(SMALL.slice(0, 2)));
    const one = rng.pick([5, 10, 20, 50]);
    if (many.reduce((s, c) => s + c, 0) === one) reject("different totals");
    return { coins, big, small, many, one };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const best = Math.max(...p.coins);
        return A.choice({
          rng,
          question: `Here are four coins: ${p.coins.map(coinName).join(", ")}.`,
          ask: "Which coin is worth the most?",
          correct: coinName(best),
          distractors: p.coins
            .filter((c) => c !== best)
            .map((c) => ({
              content: coinName(c),
              feedback: `${coinName(best)} is worth more than ${coinName(c)}.${best >= 100 ? " £1 is the same as 100p." : ""}`,
            })),
          solution: [
            {
              say: `${coinName(best)} has the biggest value.${best >= 100 ? ` ${coinName(best)} = ${best}p.` : ""}`,
            },
          ],
        });
      }
      case 2: {
        const n = p.big / p.small;
        return A.standard({
          question: `How many ${coinName(p.small)} coins have the same value as one ${coinName(p.big)} coin?`,
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "MEA.MONEY.COIN-COUNT",
              value: A.number(1),
              feedback: `One ${coinName(p.small)} coin is only worth ${p.small}p. You need ${p.big}p altogether.`,
            },
          ]),
          solution: [
            {
              say: `${coinName(p.big)} is ${p.big}p, and ${p.big} ÷ ${p.small} = ${n}, so ${n} coins.`,
            },
          ],
        });
      }
      default: {
        const total = p.many.reduce((s, c) => s + c, 0);
        const truth = total > p.one;
        return A.trueOrFalseWhy({
          rng,
          statement: `Ben has ${p.many.length} coins: ${p.many.map(coinName).join(", ")}. Amy has one ${coinName(p.one)} coin. Ben says he has more money because he has more coins.`,
          truth,
          reasons: truth
            ? [
                {
                  text: `True, but not because he has more coins. His coins make ${total}p, which is more than ${p.one}p.`,
                  correct: true,
                },
                { text: "True. More coins always means more money.", code: "MEA.MONEY.COIN-COUNT" },
                { text: `False. ${coinName(p.one)} is a big coin.` },
              ]
            : [
                {
                  text: `False. His coins only make ${total}p, which is less than ${p.one}p.`,
                  correct: true,
                },
                { text: "True. More coins always means more money.", code: "MEA.MONEY.COIN-COUNT" },
                { text: `True. ${p.many.length} is more than 1.`, code: "MEA.MONEY.COIN-COUNT" },
              ],
          solution: [
            { say: `Add the values: ${p.many.join(" + ")} = ${total}p. Compare with ${p.one}p.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.big / p.small;
    if (question.archetype === "standard")
      return chosenText(question) === coinName(Math.max(...p.coins));
    return true;
  },
});
