/**
 * @statement GF-R5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R5: Divide a given quantity into two parts in a given part:part or part:whole ratio; express the
// division of a quantity into two parts as a ratio; apply ratio to real contexts and problems (such
// as those involving conversion, comparison, scaling, mixing, concentrations)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  serves: number;
  people: number;
  flour: number;
}

export default defineGenerator<Params>({
  id: "GF-R5",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.SHARE.WRONG-TOTAL", "RAT.PART-WHOLE", "RAT.ADDITIVE"],

  params(rng) {
    const a = rng.int(1, 7);
    const b = rng.int(2, 9);
    if (a === b) reject("unequal parts");
    const serves = rng.pick([4, 6, 8]);
    const people = rng.pick([3, 10, 12, 14, 18]);
    if (people === serves) reject("a different number of people");
    return { a, b, k: rng.int(3, 15), serves, people, flour: rng.int(4, 12) * 50 };
  },

  build(p, depth): QuestionDraft {
    const total = (p.a + p.b) * p.k;
    switch (depth) {
      case 1: {
        const larger = Math.max(p.a, p.b) * p.k;
        return A.standard({
          question: `£${total} is shared between Ann and Ben in the ratio ${p.a} : ${p.b}.`,
          ask: "How much does the person with the larger share get?",
          answer: A.number(larger, { units: "£" }),
          wrong: wrongs(larger, [
            {
              code: "RAT.SHARE.WRONG-TOTAL",
              value: A.number(Math.round((total / Math.min(p.a, p.b)) * 100) / 100),
              feedback: `There are ${p.a} + ${p.b} = ${p.a + p.b} parts. One part = £${total} ÷ ${p.a + p.b}.`,
            },
            {
              code: "RAT.SHARE.WRONG-TOTAL",
              value: A.number(Math.round((total / Math.max(p.a, p.b)) * 100) / 100),
              feedback: `Divide by the total number of parts, ${p.a + p.b}, then multiply.`,
            },
          ]),
          solution: [
            {
              say: `One part = ${total} ÷ ${p.a + p.b} = ${p.k}. Larger share = ${Math.max(p.a, p.b)} × ${p.k} = £${larger}.`,
            },
          ],
        });
      }
      case 2: {
        const boys = p.a * p.k;
        return A.standard({
          question: `In a choir the ratio of boys to girls is ${p.a} : ${p.b}. There are ${boys} boys.`,
          ask: "How many children are in the choir altogether?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "RAT.PART-WHOLE",
              value: A.number(p.b * p.k),
              feedback: "That is the number of girls. Add the boys.",
            },
            {
              code: "RAT.ADDITIVE",
              value: A.number(boys + p.b - p.a + boys),
              feedback: `One part is ${boys} ÷ ${p.a} = ${p.k} children.`,
            },
          ]),
          solution: [
            {
              say: `One part = ${boys} ÷ ${p.a} = ${p.k}. Total = ${p.a + p.b} × ${p.k} = ${total}.`,
            },
          ],
        });
      }
      default: {
        const need = (p.flour / p.serves) * p.people;
        return A.multiStepContext({
          context: `A recipe for ${p.serves} people uses ${p.flour} g of flour and flour and sugar in the ratio 3 : 1 by mass.`,
          parts: [
            {
              ask: `How much flour is needed for ${p.people} people?`,
              answer: A.number(need, { units: "g" }),
              wrong: wrongs(need, [
                {
                  code: "RAT.ADDITIVE",
                  value: A.number(p.flour + p.people - p.serves),
                  feedback: `Find the flour for 1 person (${p.flour} ÷ ${p.serves}), then multiply by ${p.people}.`,
                },
              ]),
            },
            {
              ask: `How much sugar is needed for ${p.people} people?`,
              answer: A.number(Math.round((need / 3) * 10) / 10, {
                units: "g",
                accuracy: { dp: 1 },
              }),
              wrong: wrongs(Math.round((need / 3) * 10) / 10, [
                {
                  code: "RAT.PART-WHOLE",
                  value: A.number(Math.round((need / 4) * 10) / 10),
                  feedback:
                    "Flour : sugar = 3 : 1, so the sugar is a third of the flour, not a quarter.",
                },
              ]),
            },
          ],
          solution: [
            { say: `Flour: ${p.flour} ÷ ${p.serves} × ${p.people} = ${need} g.` },
            { say: `Sugar: ${need} ÷ 3 = ${Math.round((need / 3) * 10) / 10} g.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const total = (p.a + p.b) * p.k;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === (p.flour / p.serves) * p.people;
    const n = numberAnswer(question);
    return n === Math.max(p.a, p.b) * p.k || n === total;
  },
});
