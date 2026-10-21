/**
 * @statement Y4-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-04: Estimate, compare and calculate different measures, including money in pounds and pence
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { pounds } from "../shared/mea.ts";

interface Params {
  /** Two amounts in pence, one shown in pence. */
  a: number;
  b: number;
  item: number;
  prices: [number, number, number];
  budget: number;
  price: number;
  count: number;
}

// [thing, best estimate, too small, too big, wrong unit]
const ESTIMATES: [string, string, string, string, string][] = [
  ["the mass of a bag of sugar", "1 kg", "1 g", "100 kg", "1 litre"],
  ["the height of a classroom door", "2 m", "2 cm", "20 m", "2 km"],
  ["the water in a full bath", "150 litres", "150 ml", "15 000 litres", "150 kg"],
  ["the length of a car", "4 m", "4 cm", "40 m", "4 km"],
  ["the mass of an apple", "150 g", "1 g", "15 kg", "150 ml"],
];
const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "Y4-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.MONEY.POUNDS-PENCE", "MEA.COMPARE.LOOKS", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const a = rng.int(105, 995);
    // b has the same digits in pence as a does in pounds and pence, e.g. £3.45 and 354p.
    const b = Number(String(a).split("").reverse().join(""));
    if (b < 100 || b === a || a % 10 === 0) reject("amounts that look alike");
    const prices = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)].map((x) => x * 100 + 99) as [
      number,
      number,
      number,
    ];
    const near = prices.reduce((s, x) => s + x + 1, 0) / 100;
    const budget = near + rng.pick([-1, 1]);
    const price =
      rng.int(numbers === "friendly" ? 2 : 1, numbers === "friendly" ? 5 : 9) * 100 +
      rng.int(1, 19) * 5;
    return {
      a,
      b,
      item: rng.int(0, ESTIMATES.length - 1),
      prices,
      budget,
      price,
      count: rng.int(2, numbers === "stretch" ? 6 : 4),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const bigger = p.a > p.b ? pounds(p.a) : `${p.b}p`;
        return A.choice({
          rng,
          question: `Which is more money: ${pounds(p.a)} or ${p.b}p?`,
          correct: bigger,
          distractors: [
            {
              content: p.a > p.b ? `${p.b}p` : pounds(p.a),
              code: "MEA.MONEY.POUNDS-PENCE",
              feedback: `${p.b}p is ${pounds(p.b)}. Compare both in pounds.`,
            },
            {
              content: "They are the same",
              code: "MEA.MONEY.POUNDS-PENCE",
              feedback: `${p.b}p = ${pounds(p.b)}, which is not the same as ${pounds(p.a)}.`,
            },
          ],
          solution: [
            { say: `${p.b}p = ${pounds(p.b)}. Compare ${pounds(p.a)} and ${pounds(p.b)}.` },
          ],
        });
      }
      case 2: {
        const [thing, best, small, big, unit] = (ESTIMATES[p.item] ??
          ESTIMATES[0]) as (typeof ESTIMATES)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Which is the best estimate for ${thing}?`,
          correct: best,
          distractors: [
            {
              content: small,
              code: "MEA.COMPARE.LOOKS",
              feedback: "That is far too small. Picture the unit.",
            },
            {
              content: big,
              code: "MEA.COMPARE.LOOKS",
              feedback: "That is far too big. Picture the unit.",
            },
            { content: unit, feedback: "That unit measures something different." },
          ],
          solution: [{ say: `${thing[0]?.toUpperCase()}${thing.slice(1)} is about ${best}.` }],
        });
      }
      case 4: {
        const total = r2(p.prices.reduce((s, x) => s + x, 0) / 100);
        const truth = total < p.budget;
        return A.trueOrFalseWhy({
          rng,
          statement: `Ami buys three things costing ${p.prices.map(pounds).join(", ")}. She says they cost less than £${p.budget}.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. Each price is 1p less than a whole pound, so the total is ${p.prices.length}p less than £${r2(total + 0.03)}: ${pounds(Math.round(total * 100))}.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Each price is about £${Math.floor(p.prices[0] / 100)}, so the total is about £${p.prices.reduce((s, x) => s + Math.floor(x / 100), 0)}.`,
            },
            {
              text: `${truth ? "False" : "True"}. Add the pounds and the pence separately: ${p.prices.reduce((s, x) => s + Math.floor(x / 100), 0)} pounds and 297 pence.`,
              code: "MEA.MONEY.POUNDS-PENCE",
            },
          ],
          solution: [
            {
              say: `Round each price up a penny: ${p.prices.map((x) => `£${(x + 1) / 100}`).join(" + ")} = £${r2(total + 0.03)}, then take off 3p: ${pounds(Math.round(total * 100))}.`,
            },
          ],
        });
      }
      default: {
        const total = p.price * p.count;
        const note = Math.ceil(total / 1000) * 1000 + (total % 1000 === 0 ? 1000 : 0);
        return A.multiStepContext({
          context: `A book costs ${pounds(p.price)}. Jade buys ${p.count} of them and pays with £${note / 100}.`,
          parts: [
            {
              ask: "How much do the books cost altogether, in pounds?",
              answer: A.number(total / 100, { units: "£" }),
            },
            {
              ask: "How much change does she get, in pounds?",
              answer: A.number(r2((note - total) / 100), { units: "£" }),
              wrong: wrongs(r2((note - total) / 100), [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r2((note - p.price) / 100), { units: "£" }),
                  feedback: `Take away the cost of all ${p.count} books.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${pounds(p.price)} × ${p.count} = ${pounds(total)}.` },
            { say: `£${note / 100} − ${pounds(total)} = ${pounds(note - total)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (p.a > p.b ? pounds(p.a) : `${p.b}p`);
    if (question.archetype === "multi-step-context")
      return Math.abs(numberAnswer(question) - (p.price * p.count) / 100) < 1e-9;
    return true;
  },
});
