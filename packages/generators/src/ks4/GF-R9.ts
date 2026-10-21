/**
 * @statement GF-R9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R9: Define percentage as 'number of parts per hundred'; interpret percentages and percentage
// changes as a fraction or a decimal, and interpret these multiplicatively; express one quantity as a
// percentage of another; compare two quantities using percentages; work with percentages greater
// than 100%; solve problems involving percentage change, including original value problems, and
// simple interest including in financial mathematics
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  old: number;
  pct: number;
  rise: number;
  rate: number;
  years: number;
  principal: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R9",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.PERCENT.CHANGE-BASE", "RAT.PERCENT.REVERSE", "RAT.COMPOUND.SIMPLE"],

  params(rng) {
    const old = rng.int(4, 40) * 5;
    const pct = rng.pick([5, 10, 15, 20, 25, 30, 40, 60]);
    const rise = rng.pick([10, 20, 25, 50]);
    if (((old * pct) / 100) % 1 !== 0) reject("a whole-number change");
    return {
      old,
      pct,
      rise,
      rate: rng.int(2, 6),
      years: rng.int(2, 5),
      principal: rng.int(4, 30) * 100,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const now = p.old + (p.old * p.pct) / 100;
        return A.standard({
          question: `A price rises from £${p.old} to £${now}.`,
          ask: "What is the percentage increase?",
          answer: A.number(p.pct, { units: "%" }),
          wrong: wrongs(p.pct, [
            {
              code: "RAT.PERCENT.CHANGE-BASE",
              value: A.number(r2(((now - p.old) / now) * 100), { accuracy: { dp: 1 } }),
              feedback: "Divide the change by the original price, not the new one.",
            },
          ]),
          solution: [
            { say: `Increase £${now - p.old}. ${now - p.old} ÷ ${p.old} × 100 = ${p.pct}%.` },
          ],
        });
      }
      case 2: {
        const original = p.old;
        const now = r2(original * (1 + p.rise / 100));
        return A.reverse({
          question: `After a ${p.rise}% increase, a jacket costs £${now}.`,
          ask: "What was the price before the increase?",
          answer: A.number(original, { units: "£" }),
          wrong: wrongs(original, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(r2(now * (1 - p.rise / 100))),
              feedback: `£${now} is ${100 + p.rise}% of the original. Divide by ${1 + p.rise / 100}.`,
            },
          ]),
          solution: [
            {
              say: `${100 + p.rise}% = £${now}, so 100% = ${now} ÷ ${1 + p.rise / 100} = £${original}.`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `A town's population grew from ${p.old * 100} to ${p.old * 300}. Asha says that is a 300% increase.`,
          truth: false,
          reasons: [
            {
              text: `False. The increase is ${p.old * 200}, which is 200% of the original ${p.old * 100}. The new population is 300% of the old one.`,
              correct: true,
            },
            {
              text: "True. It is three times as big, so 300% bigger.",
              code: "RAT.PERCENT.CHANGE-BASE",
            },
            { text: "True. Percentages over 100% are not possible, so 300% means tripling." },
          ],
          solution: [
            { say: `Change ÷ original × 100 = ${p.old * 200} ÷ ${p.old * 100} × 100 = 200%.` },
          ],
        });
      default: {
        const interest = (p.principal * p.rate * p.years) / 100;
        return A.multiStepContext({
          context: `£${p.principal} is invested at ${p.rate}% per year simple interest for ${p.years} years.`,
          parts: [
            {
              ask: "How much interest is earned each year?",
              answer: A.number((p.principal * p.rate) / 100, { units: "£" }),
            },
            {
              ask: `How much is the investment worth after ${p.years} years?`,
              answer: A.number(p.principal + interest, { units: "£" }),
              wrong: wrongs(p.principal + interest, [
                {
                  code: "RAT.COMPOUND.SIMPLE",
                  value: A.number(r2(p.principal * (1 + p.rate / 100) ** p.years)),
                  feedback: "Simple interest is the same amount each year; it does not compound.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.rate}% of £${p.principal} = £${(p.principal * p.rate) / 100}.` },
            {
              say: `£${p.principal} + ${p.years} × £${(p.principal * p.rate) / 100} = £${p.principal + interest}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.pct;
    if (question.archetype === "reverse") return numberAnswer(question) === p.old;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === p.principal + (p.principal * p.rate * p.years) / 100;
    return true;
  },
});
