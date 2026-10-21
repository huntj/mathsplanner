/**
 * @statement Y3-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-03: Add and subtract amounts of money to give change, using both £ and p in practical
// contexts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { noCarry, pounds, smallerFromLarger } from "../shared/mea.ts";

interface Params {
  /** Prices in pence. */
  a: number;
  b: number;
  note: number;
  cost: number;
  snack: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "Y3-MEA-03",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: [
    "AS.COLUMN.NO-CARRY",
    "AS.COLUMN.SMALLER-FROM-LARGER",
    "MEA.MONEY.POUNDS-PENCE",
    "AS.MULTISTEP.ONE-STEP",
  ],

  params(rng, numbers) {
    const step = numbers === "friendly" ? 10 : 5;
    const a = rng.int(Math.ceil(105 / step), Math.floor(495 / step)) * step;
    const b = rng.int(Math.ceil(105 / step), Math.floor(495 / step)) * step;
    if (noCarry(a, b) === a + b) reject("an addition with exchanging");
    const note = rng.pick([500, 1000]);
    const cost = rng.int(Math.ceil(note / 2 / step), Math.floor((note - 10) / step)) * step;
    if (smallerFromLarger(note, cost) === note - cost) reject("a subtraction with exchanging");
    const snack = rng.int(3, 9) * 10;
    if (a + snack >= 500) reject("a total under £5");
    return { a, b, note, cost, snack };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = r2((p.a + p.b) / 100);
        return A.standard({
          question: `A book costs ${pounds(p.a)} and a pen costs ${pounds(p.b)}.`,
          ask: "How much do they cost altogether, in pounds?",
          answer: A.number(total, { units: "£" }),
          wrong: wrongs(total, [
            {
              code: "AS.COLUMN.NO-CARRY",
              value: A.number(noCarry(p.a, p.b) / 100, { units: "£" }),
              feedback: "Exchange when a column makes ten or more.",
            },
          ]),
          solution: [{ say: `${pounds(p.a)} + ${pounds(p.b)} = ${pounds(p.a + p.b)}.` }],
        });
      }
      case 2: {
        const change = r2((p.note - p.cost) / 100);
        return A.standard({
          question: `A game costs ${pounds(p.cost)}. Mo pays with a £${p.note / 100} note.`,
          ask: "How much change should he get, in pounds?",
          answer: A.number(change, { units: "£" }),
          wrong: wrongs(change, [
            {
              code: "AS.COLUMN.SMALLER-FROM-LARGER",
              value: A.number(smallerFromLarger(p.note, p.cost) / 100, { units: "£" }),
              feedback:
                "You cannot take a bigger digit from a smaller one: exchange first. Or count on to the next pound.",
            },
          ]),
          solution: [
            {
              say: `Count on from ${pounds(p.cost)} to £${p.note / 100}: ${pounds(p.note - p.cost)}.`,
            },
          ],
        });
      }
      default: {
        const total = p.a + p.snack;
        return A.multiStepContext({
          context: `A comic costs ${pounds(p.a)} and a drink costs ${p.snack}p. Kira pays with a £5 note.`,
          parts: [
            {
              ask: "How much do they cost altogether, in pounds?",
              answer: A.number(r2(total / 100), { units: "£" }),
              wrong: wrongs(r2(total / 100), [
                {
                  code: "MEA.MONEY.POUNDS-PENCE",
                  value: A.number(r2(p.a / 100 + p.snack), { units: "£" }),
                  feedback: `${p.snack}p is £0.${p.snack}. Write both amounts in pounds before adding.`,
                },
              ]),
            },
            {
              ask: "How much change does she get, in pounds?",
              answer: A.number(r2((500 - total) / 100), { units: "£" }),
              wrong: wrongs(r2((500 - total) / 100), [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r2((500 - p.a) / 100), { units: "£" }),
                  feedback: "Take away the cost of both things.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${pounds(p.a)} + £0.${p.snack} = ${pounds(total)}.` },
            { say: `£5.00 − ${pounds(total)} = ${pounds(500 - total)}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return Math.abs(numberAnswer(question, 1) - (500 - p.a - p.snack) / 100) < 1e-9;
    const n = numberAnswer(question);
    return Math.abs(n - (p.a + p.b) / 100) < 1e-9 || Math.abs(n - (p.note - p.cost) / 100) < 1e-9;
  },
});
