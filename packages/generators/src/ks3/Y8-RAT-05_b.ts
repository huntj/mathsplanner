/**
 * @statement Y8-RAT-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-05.b: Solve problems with unit pricing
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  each: number;
  g: number;
  price: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-05.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    const p = {
      n: rng.int(4, 12),
      each: rng.int(15, 95),
      g: rng.pick([250, 400, 500, 750]),
      price: rng.int(80, 450),
    };
    if (((p.price * 100) / p.g) % 1 !== 0) reject("a whole number of pence per 100 g");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = p.n * p.each;
        return A.standard({
          question: [`A pack of ${p.n} batteries costs £${(total / 100).toFixed(2)}.`],
          ask: "What is the cost of one battery, in pence?",
          answer: A.number(p.each),
          wrong: wrongs(p.each, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r2((p.n / total) * 100)),
              feedback: "Cost per battery = total cost ÷ number of batteries.",
            },
          ]),
          solution: [{ say: "", math: `${total} \\div ${p.n} = ${p.each}\\text{p}` }],
        });
      }
      case 2: {
        const v = (p.price * 100) / p.g;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A ${p.g} g bag of pasta costs ${p.price}p.`],
              ask: "What is the cost of 100 g, in pence?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r2((p.g * 100) / p.price)),
              feedback: `Divide the price by ${p.g / 100} (the number of 100 g in the bag).`,
            },
          ]),
          solution: [{ say: "", math: `${p.price} \\div ${p.g / 100} = ${v}\\text{p}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The pack that is cheaper per gram costs less to buy."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. A big pack can be cheaper per gram but cost more in total, because you are buying more.",
              correct: true,
            },
            { text: "Always. Cheaper is cheaper.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
            { text: "Never. Cheaper per gram always costs more." },
          ],
          solution: [{ say: "Value for money and total cost are different questions." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.each;
    if (question.key.depth === 2) return numberAnswer(question) === (p.price * 100) / p.g;
    return true;
  },
});
