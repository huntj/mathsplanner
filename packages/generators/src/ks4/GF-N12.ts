/**
 * @statement GF-N12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N12: Interpret fractions and percentages as operators
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  d: number;
  amount: number;
  pct: number;
  up: boolean;
  start: number;
}

export default defineGenerator<Params>({
  id: "GF-N12",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.OF-AMOUNT.UNIT-ONLY", "RAT.PERCENT.MULTIPLIER", "RAT.PERCENT.UNDO"],

  params(rng) {
    const d = rng.pick([3, 4, 5, 8]);
    const n = rng.int(2, d - 1);
    const amount = d * rng.int(5, 40);
    const pct = rng.pick([5, 12, 15, 20, 35, 40, 65, 85]);
    if (n === 1) reject("a non-unit fraction");
    return { n, d, amount, pct, up: rng.bool(), start: rng.pick([50, 80, 120, 200, 400]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = (p.amount / p.d) * p.n;
        return A.standard({
          question: ["Work out ", A.math(`\\frac{${p.n}}{${p.d}}`), ` of ${p.amount}.`],
          answer: A.number(right),
          wrong: wrongs(right, [
            {
              code: "FR.OF-AMOUNT.UNIT-ONLY",
              value: A.number(p.amount / p.d),
              feedback: `That is 1/${p.d}. Multiply by ${p.n} for ${p.n}/${p.d}.`,
            },
          ]),
          solution: [{ say: `${p.amount} ÷ ${p.d} = ${p.amount / p.d}, × ${p.n} = ${right}.` }],
        });
      }
      case 2: {
        const m = p.up ? 1 + p.pct / 100 : 1 - p.pct / 100;
        const right = String(Math.round(m * 100) / 100);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A price is ${p.up ? "increased" : "decreased"} by ${p.pct}%.`,
          ask: "Which single number do you multiply the price by?",
          correct: right,
          distractors: [
            {
              content: String(p.pct / 100),
              code: "RAT.PERCENT.MULTIPLIER",
              feedback: `That finds just the ${p.pct}%. The new price is ${p.up ? 100 + p.pct : 100 - p.pct}% of the old one.`,
            },
            {
              content: String(Math.round((p.up ? 1 - p.pct / 100 : 1 + p.pct / 100) * 100) / 100),
              code: "RAT.PERCENT.MULTIPLIER",
              feedback: `That ${p.up ? "decreases" : "increases"} it.`,
            },
            { content: String(p.pct), feedback: "Percentages become decimals by dividing by 100." },
          ].filter((d) => d.content !== right),
          solution: [{ say: `${p.up ? 100 + p.pct : 100 - p.pct}% = ${right}.` }],
        });
      }
      default: {
        const after = p.start * (1 + p.pct / 100) * (1 - p.pct / 100);
        return A.trueOrFalseWhy({
          rng,
          statement: `A price of £${p.start} goes up by ${p.pct}% and then comes down by ${p.pct}%. Sara says it is back to £${p.start}.`,
          truth: false,
          reasons: [
            {
              text: `False. The decrease is ${p.pct}% of a bigger amount, so it takes off more: £${p.start} × ${1 + p.pct / 100} × ${1 - p.pct / 100} = £${(Math.round(after * 100) / 100).toFixed(2)}.`,
              correct: true,
            },
            {
              text: "True. Up and down by the same percentage cancel out.",
              code: "RAT.PERCENT.UNDO",
            },
            { text: "True. The same amount is added and taken away.", code: "RAT.PERCENT.UNDO" },
          ],
          solution: [
            {
              say: `Multipliers: ${1 + p.pct / 100} × ${1 - p.pct / 100} = ${Math.round((1 + p.pct / 100) * (1 - p.pct / 100) * 10000) / 10000}, which is less than 1.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === (p.amount / p.d) * p.n;
    if (question.archetype === "varied-form")
      return (
        Math.abs(Number(chosenText(question)) - (p.up ? 1 + p.pct / 100 : 1 - p.pct / 100)) < 1e-9
      );
    return true;
  },
});
