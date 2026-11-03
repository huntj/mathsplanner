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
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  each: number;
  g: number;
  price: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-05.b",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
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
            }),
          [
            {
              statement:
                "A 500 g bag of rice costs £1.50 and a 1 kg bag costs £2.80. Pam says the 1 kg bag is better value.",
              truth: true,
              right: "True. The 1 kg bag costs £1.40 for each 500 g, which is less than £1.50.",
              wrong: [
                [
                  "False. £1.50 is less than £2.80, so the small bag is cheaper.",
                  "RAT.COMPOUND-UNIT.ARRANGEMENT",
                ],
                ["False. Bigger bags always cost more per gram."],
              ],
            },
            {
              statement:
                "Jim works out price ÷ grams for two packs and says the pack with the bigger answer is better value.",
              truth: false,
              right:
                "False. Price ÷ grams is the cost of 1 gram, so the smaller answer is better value.",
              wrong: [
                [
                  "True. A bigger answer means more for your money.",
                  "RAT.COMPOUND-UNIT.ARRANGEMENT",
                ],
                ["True. Better value always has the bigger number."],
              ],
            },
            {
              claim: "A bigger pack of the same thing is better value.",
              truth: "sometimes",
              right:
                "Sometimes. Big packs often cost less per gram, but not always: compare the cost per gram.",
              wrong: [
                ["Always. You get more, so it is better value.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["Never. Bigger packs cost more."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.each;
    if (question.key.depth === 2) return numberAnswer(question) === (p.price * 100) / p.g;
    return true;
  },
});
