/**
 * @statement Y6-RAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-RAT-02: Solve problems involving the calculation of percentages (e.g. of measures, 15% of 360)
// and the use of percentages for comparison
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  pc: number;
  amount: number;
  /** Depth 2: two percentages of two amounts to compare. */
  pc2: number;
  amount2: number;
}

const PERCENTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75];

export default defineGenerator<Params>({
  id: "Y6-RAT-02",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.PERCENT.DIVIDE-BY-PERCENT", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const pc = rng.pick(numbers === "friendly" ? [10, 20, 25, 50] : PERCENTS);
    const amount = rng.int(2, numbers === "stretch" ? 99 : 30) * 20;
    const pc2 = rng.pick(PERCENTS);
    const amount2 = rng.int(2, 30) * 20;
    if ((pc * amount) % 100 !== 0 || (pc2 * amount2) % 100 !== 0) reject("whole-number answers");
    if (pc * amount === pc2 * amount2 || pc === pc2) reject("a real comparison");
    if (amount % pc === 0 && amount / pc === (pc * amount) / 100) reject("the slip must differ");
    return { pc, amount, pc2, amount2 };
  },

  build(p, depth, rng): QuestionDraft {
    const of = (pc: number, n: number) => (pc * n) / 100;
    const how = (pc: number, n: number) =>
      `10% of ${n} is ${n / 10}${pc % 10 === 5 ? `, 5% is ${n / 20}` : ""}, so ${pc}% is ${of(pc, n)}.`;
    switch (depth) {
      case 1: {
        const answer = of(p.pc, p.amount);
        return A.standard({
          question: ["Work out ", A.math(`${p.pc}\\%`), ` of ${p.amount}.`],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            p.amount % p.pc === 0
              ? {
                  code: "RAT.PERCENT.DIVIDE-BY-PERCENT",
                  value: A.number(p.amount / p.pc),
                  feedback: `Per cent means out of 100: find 1% or 10% first, then build up to ${p.pc}%.`,
                }
              : undefined,
          ]),
          solution: [{ say: how(p.pc, p.amount) }],
        });
      }
      case 2: {
        const [x, y] = [of(p.pc, p.amount), of(p.pc2, p.amount2)];
        const [first, second] = [`${p.pc}% of ${p.amount}`, `${p.pc2}% of ${p.amount2}`];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: "Which is bigger?",
          correct: x > y ? first : second,
          distractors: [
            { content: x > y ? second : first, feedback: `${first} = ${x} and ${second} = ${y}.` },
            { content: "They are the same", feedback: `${first} = ${x} and ${second} = ${y}.` },
          ],
          solution: [{ say: how(p.pc, p.amount) }, { say: how(p.pc2, p.amount2) }],
        });
      }
      default: {
        const off = of(p.pc, p.amount);
        return A.multiStepContext({
          context: [
            "A bike costs £",
            String(p.amount),
            ". In a sale the price is cut by ",
            A.math(`${p.pc}\\%`),
            ".",
          ],
          parts: [
            {
              ask: "How much is taken off, in pounds?",
              answer: A.number(off),
              wrong: wrongs(off, [
                p.amount % p.pc === 0
                  ? {
                      code: "RAT.PERCENT.DIVIDE-BY-PERCENT",
                      value: A.number(p.amount / p.pc),
                      feedback: "Per cent means out of 100.",
                    }
                  : undefined,
              ]),
            },
            {
              ask: "What is the sale price, in pounds?",
              answer: A.number(p.amount - off),
              wrong: wrongs(p.amount - off, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(off),
                  feedback: "That is the amount taken off. Take it away from the price.",
                },
              ]),
            },
          ],
          solution: [
            { say: how(p.pc, p.amount) },
            { say: `£${p.amount} − £${off} = £${p.amount - off}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) * 100 === p.pc * p.amount;
    if (question.archetype === "varied-form")
      return (
        chosenText(question) ===
        (p.pc * p.amount > p.pc2 * p.amount2
          ? `${p.pc}% of ${p.amount}`
          : `${p.pc2}% of ${p.amount2}`)
      );
    return numberAnswer(question, 1) * 100 === p.amount * (100 - p.pc);
  },
});
