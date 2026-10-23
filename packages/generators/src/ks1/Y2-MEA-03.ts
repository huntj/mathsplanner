/**
 * @statement Y2-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-03: Recognise and use symbols for pounds (£) and pence (p); combine amounts to make a
// particular value; find different combinations of coins that equal the same amounts of money
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coinName, coinsMaking, fewestCoins, pounds } from "../shared/mea.ts";

export interface Params {
  coins: number[];
  whole: number;
  pence: number;
  /** Depth 4: can `count` coins make `target`p? */
  target: number;
  count: number;
  spend: number;
}

export default defineGenerator<Params>({
  id: "Y2-MEA-03",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.MONEY.COIN-COUNT", "MEA.MONEY.POUNDS-PENCE", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const pool = numbers === "friendly" ? [1, 2, 5, 10] : [1, 2, 5, 10, 20, 50];
    const coins = Array.from({ length: rng.int(3, numbers === "stretch" ? 5 : 4) }, () =>
      rng.pick(pool),
    ).sort((a, b) => b - a);
    const total = coins.reduce((s, c) => s + c, 0);
    if (total >= 100) reject("a total under £1");
    const target = rng.int(numbers === "friendly" ? 6 : 15, numbers === "friendly" ? 30 : 99);
    const fewest = fewestCoins(target).length;
    const count = rng.bool() ? fewest + rng.int(0, 1) : fewest - 1;
    if (count < 2) reject("at least two coins in the claim");
    return {
      coins,
      whole: rng.int(1, 9),
      pence: rng.int(1, 99),
      target,
      count,
      spend: rng.int(1, total - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.coins.reduce((s, c) => s + c, 0);
    switch (depth) {
      case 1:
        return A.standard({
          question: `Ravi has these coins: ${p.coins.map(coinName).join(", ")}.`,
          ask: "How much money is that, in pence?",
          answer: A.number(total, { units: "p" }),
          wrong: wrongs(total, [
            {
              code: "MEA.MONEY.COIN-COUNT",
              value: A.number(p.coins.length, { units: "p" }),
              feedback: "Add the values of the coins, not how many coins there are.",
            },
          ]),
          solution: [{ say: `${p.coins.join(" + ")} = ${total}p.` }],
        });
      case 2: {
        const right = pounds(p.whole * 100 + p.pence);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `How do you write ${p.whole} pounds and ${p.pence} pence?`,
          correct: right,
          distractors: [
            {
              content: `£${p.whole}.${p.pence}`,
              code: "MEA.MONEY.POUNDS-PENCE",
              feedback: `Pence always take two places after the point: ${p.pence}p is .${String(p.pence).padStart(2, "0")}.`,
            },
            {
              content: `£${p.whole}${String(p.pence).padStart(2, "0")}`,
              code: "MEA.MONEY.POUNDS-PENCE",
              feedback: "The point separates the pounds from the pence.",
            },
            {
              content: `${p.whole}.${String(p.pence).padStart(2, "0")}p`,
              code: "MEA.MONEY.POUNDS-PENCE",
              feedback: "When there are pounds, write £ at the front and no p.",
            },
          ].filter((d) => d.content !== right),
          solution: [
            { say: `Pounds before the point and pence after it, using two digits: ${right}.` },
          ],
        });
      }
      case 4: {
        const fewest = fewestCoins(p.target);
        const made = coinsMaking(p.target, p.count);
        const truth = made !== undefined;
        return A.trueOrFalseWhy({
          rng,
          statement: `Mel says she can make ${p.target}p using exactly ${p.count} coins.`,
          truth,
          reasons: truth
            ? [
                {
                  text: `True. For example ${(made ?? []).map(coinName).join(" + ")} = ${p.target}p.`,
                  correct: true,
                },
                {
                  text: `False. You need ${p.target} coins to make ${p.target}p.`,
                  code: "MEA.MONEY.COIN-COUNT",
                },
                { text: "False. Coins can only make round numbers." },
              ]
            : [
                {
                  text:
                    p.count < fewest.length
                      ? `False. The fewest coins that make ${p.target}p is ${fewest.length}: ${fewest.map(coinName).join(" + ")}.`
                      : `False. No ${p.count} coins add up to exactly ${p.target}p.`,
                  correct: true,
                },
                {
                  text: "True. Any amount can be made with any number of coins.",
                  code: "MEA.MONEY.COIN-COUNT",
                },
                {
                  text: `True. ${p.count} coins of ${Math.ceil(p.target / p.count)}p would do it.`,
                },
              ],
          solution: [
            {
              say: `Use the biggest coins you can: ${fewest.map(coinName).join(" + ")} = ${p.target}p.`,
            },
          ],
        });
      }
      default:
        return A.multiStepContext({
          context: `Ravi has these coins: ${p.coins.map(coinName).join(", ")}.`,
          parts: [
            {
              ask: "How much money does Ravi have, in pence?",
              answer: A.number(total, { units: "p" }),
              wrong: wrongs(total, [
                {
                  code: "MEA.MONEY.COIN-COUNT",
                  value: A.number(p.coins.length),
                  feedback: "Add the values of the coins.",
                },
              ]),
            },
            {
              ask: `He spends ${p.spend}p. How much does he have left?`,
              answer: A.number(total - p.spend, { units: "p" }),
              wrong: wrongs(total - p.spend, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(p.spend, { units: "p" }),
                  feedback: "That is what he spent. Take it away from what he had.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.coins.join(" + ")} = ${total}p.` },
            { say: `${total} − ${p.spend} = ${total - p.spend}p.` },
          ],
        });
    }
  },

  verify(p, question) {
    const total = p.coins.reduce((s, c) => s + c, 0);
    if (question.archetype === "standard") return numberAnswer(question) === total;
    if (question.archetype === "varied-form")
      return chosenText(question) === `£${p.whole}.${String(p.pence).padStart(2, "0")}`;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === total - p.spend;
    return true;
  },
});
