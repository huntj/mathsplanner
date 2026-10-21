/**
 * @statement Y8-RAT-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-RAT-03: Compare two quantities using percentages, and solve problems involving percentage
// change, including percentage increase, decrease, original value problems and simple interest in
// financial mathematics
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Price in pounds, percentage, up or down. */
  price: number;
  pc: number;
  up: boolean;
  /** Simple interest: principal, rate, years. */
  principal: number;
  rate: number;
  years: number;
}

const money = (x: number) => Number(x.toFixed(2));

export default defineGenerator<Params>({
  id: "Y8-RAT-03",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.PERCENT.MULTIPLIER", "RAT.PERCENT.REVERSE", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const pc = rng.pick(numbers === "friendly" ? [10, 20, 25, 50] : [5, 10, 15, 20, 25, 30, 40]);
    const price = rng.int(2, numbers === "stretch" ? 200 : 50) * 20;
    const up = rng.bool();
    const principal = rng.int(2, 50) * 100;
    const rate = rng.pick([2, 3, 4, 5, 6]);
    const years = rng.int(2, numbers === "stretch" ? 10 : 5);
    if (!up && pc >= 50) reject("a sensible decrease");
    return { price, pc, up, principal, rate, years };
  },

  build(p, depth): QuestionDraft {
    const m = (100 + (p.up ? p.pc : -p.pc)) / 100;
    const after = money(p.price * m);
    const word = p.up ? "increase" : "decrease";
    switch (depth) {
      case 1:
        return A.standard({
          question: `A coat costs £${p.price.toLocaleString("en-GB")}. Its price is ${p.up ? "increased" : "decreased"} by ${p.pc}%.`,
          ask: "What is the new price, in pounds?",
          answer: A.number(after),
          wrong: wrongs(after, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(money((p.price * p.pc) / 100)),
              feedback: `That is the ${word}. ${p.up ? "Add it to" : "Take it from"} the original price, or multiply by ${m}.`,
            },
          ]),
          solution: [
            {
              say: `Multiply by ${m}: £${p.price.toLocaleString("en-GB")} × ${m} = £${after.toFixed(2)}.`,
            },
          ],
        });
      case 2: {
        const slip = money(after * (p.up ? (100 - p.pc) / 100 : (100 + p.pc) / 100));
        return A.reverse({
          question: `After a ${p.pc}% ${word}, a coat costs £${after.toFixed(2)}.`,
          ask: "What was the price before the change, in pounds?",
          answer: A.number(p.price),
          wrong: wrongs(p.price, [
            {
              code: "RAT.PERCENT.REVERSE",
              value: A.number(slip),
              feedback: `The ${p.pc}% was of the original price, not the new one. £${after.toFixed(2)} is ${100 + (p.up ? p.pc : -p.pc)}% of the original, so divide by ${m}.`,
            },
          ]),
          solution: [
            {
              say: `£${after.toFixed(2)} is ${100 + (p.up ? p.pc : -p.pc)}% of the original: £${after.toFixed(2)} ÷ ${m} = £${p.price.toLocaleString("en-GB")}.`,
            },
          ],
        });
      }
      default: {
        const yearly = (p.principal * p.rate) / 100;
        const interest = yearly * p.years;
        return A.multiStepContext({
          context: `£${p.principal.toLocaleString("en-GB")} is invested at ${p.rate}% simple interest per year for ${p.years} years.`,
          parts: [
            {
              ask: "How much interest is earned altogether, in pounds?",
              answer: A.number(interest),
              wrong: wrongs(interest, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(yearly),
                  feedback: `That is one year's interest. There are ${p.years} years.`,
                },
              ]),
            },
            {
              ask: "By what percentage has the investment grown?",
              answer: A.number(p.rate * p.years, { units: "%" }),
            },
          ],
          solution: [
            {
              say: `${p.rate}% of £${p.principal.toLocaleString("en-GB")} is £${yearly} a year; over ${p.years} years that is £${interest}.`,
            },
            {
              say: `£${interest} out of £${p.principal.toLocaleString("en-GB")} is ${p.rate * p.years}%.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        Math.abs(numberAnswer(question) - (p.price * (100 + (p.up ? p.pc : -p.pc))) / 100) < 0.005
      );
    if (question.archetype === "reverse") return numberAnswer(question) === p.price;
    return (
      numberAnswer(question, 0) === (p.principal * p.rate * p.years) / 100 &&
      numberAnswer(question, 1) === p.rate * p.years
    );
  },
});
