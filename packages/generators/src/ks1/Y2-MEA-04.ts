/**
 * @statement Y2-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-04: Solve simple problems in a practical context involving addition and subtraction of
// money of the same unit, including giving change
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { changeSlip, noCarry } from "../shared/mea.ts";

interface Params {
  paid: number;
  cost: number;
  a: number;
  b: number;
}

const ITEMS = ["a pencil", "a rubber", "a sticker", "a ruler", "a notebook", "a bookmark"];

export default defineGenerator<Params>({
  id: "Y2-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["MEA.MONEY.CHANGE", "AS.COLUMN.NO-CARRY", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const paid = numbers === "friendly" ? rng.pick([10, 20, 50]) : 100;
    const cost = rng.int(numbers === "friendly" ? 2 : 11, paid - 1);
    const a = rng.int(11, 48);
    const b = rng.int(11, 48);
    if (numbers !== "friendly" && (a % 10) + (b % 10) < 10) reject("an addition that crosses ten");
    if (a + b >= paid && numbers !== "friendly") reject("two items that cost less than £1");
    if (numbers === "friendly" && a + b >= 100) reject("small amounts");
    return { paid, cost, a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = rng.shuffle(ITEMS);
    const paidText = p.paid === 100 ? "£1" : `${p.paid}p`;
    switch (depth) {
      case 1: {
        const slip = p.paid === 100 ? changeSlip(100, p.cost) : undefined;
        return A.standard({
          question: `${x} costs ${p.cost}p. Ana pays with ${paidText}.`,
          ask: "How much change does she get?",
          answer: A.number(p.paid - p.cost, { units: "p" }),
          wrong: wrongs(p.paid - p.cost, [
            slip === undefined
              ? undefined
              : {
                  code: "MEA.MONEY.CHANGE",
                  value: A.number(slip, { units: "p" }),
                  feedback: `Count on from ${p.cost}p to ${paidText}. Check: ${slip} + ${p.cost} is not 100.`,
                },
          ]),
          solution: [
            {
              say: `Count on from ${p.cost}p to ${paidText}: ${p.paid} − ${p.cost} = ${p.paid - p.cost}p.`,
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: `${x} costs ${p.a}p and ${y} costs ${p.b}p.`,
          ask: "How much do they cost altogether?",
          answer: A.number(p.a + p.b, { units: "p" }),
          wrong: wrongs(p.a + p.b, [
            {
              code: "AS.COLUMN.NO-CARRY",
              value: A.number(noCarry(p.a, p.b), { units: "p" }),
              feedback: `The ones make ${(p.a % 10) + (p.b % 10)}: exchange ten ones for a ten.`,
            },
          ]),
          solution: [{ say: `${p.a} + ${p.b} = ${p.a + p.b}p.` }],
        });
      default: {
        const total = p.a + p.b;
        const pay = total < 50 ? 50 : 100;
        return A.multiStepContext({
          context: `${x} costs ${p.a}p and ${y} costs ${p.b}p. Ana buys both and pays with ${pay === 100 ? "£1" : "50p"}.`,
          parts: [
            { ask: "How much do they cost altogether?", answer: A.number(total, { units: "p" }) },
            {
              ask: "How much change does she get?",
              answer: A.number(pay - total, { units: "p" }),
              wrong: wrongs(pay - total, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(pay - p.a, { units: "p" }),
                  feedback: "Take away the cost of both things, not just one.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.a} + ${p.b} = ${total}p.` },
            { say: `${pay} − ${total} = ${pay - total}p change.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === (p.a + p.b < 50 ? 50 : 100) - p.a - p.b;
    const n = numberAnswer(question);
    return n === p.paid - p.cost || n === p.a + p.b;
  },
});
