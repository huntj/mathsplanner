/**
 * @statement Y4-FR-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-10: Solve simple measure and money problems involving fractions and decimals to two decimal
// places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Prices in pence; `tenth` is a whole number of 10p, shown as £0.80, the misaligned-point trap. */
  price: number;
  tenth: number;
  /** Depth 2: change from a note. */
  note: number;
  /** Depth 5: a jug of `jug` ml, `glasses` glasses of `glass` ml. */
  jug: number;
  glass: number;
  glasses: number;
}

const pounds = (p: number) => (p / 100).toFixed(2);

export default defineGenerator<Params>({
  id: "Y4-FR-10",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["FR.DECIMAL.PLACE", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const price = rng.int(numbers === "friendly" ? 105 : 115, numbers === "stretch" ? 895 : 495);
    const tenth = rng.int(1, 9) * 10;
    const note = price + tenth < 500 ? 5 : 10;
    const glass = rng.pick([250, 200, 125]);
    const glasses = rng.int(2, 4);
    const jug = rng.pick([1500, 2000, 1750]);
    if (price % 10 === 0 || glass * glasses >= jug) reject("untidy price; the jug is not emptied");
    return { price, tenth, note, jug, glass, glasses };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = p.price + p.tenth;
        // £1.35 + £0.80 worked as £1.35 + £0.08.
        const misaligned = p.price + p.tenth / 10;
        return A.standard({
          question: `A pen costs £${pounds(p.price)} and a rubber costs £${pounds(p.tenth)}.`,
          ask: "How much do they cost altogether, in pounds?",
          answer: A.number(total / 100),
          wrong: wrongs(total / 100, [
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(misaligned / 100),
              feedback: "Line up the decimal points: pounds under pounds, tenths under tenths.",
            },
          ]),
          solution: [{ say: `£${pounds(p.price)} + £${pounds(p.tenth)} = £${pounds(total)}.` }],
        });
      }
      case 2: {
        const change = p.note * 100 - p.price;
        return A.reverse({
          question: `Leo pays for a book with a £${p.note} note and gets £${pounds(change)} change.`,
          ask: "How much does the book cost, in pounds?",
          answer: A.number(p.price / 100),
          solution: [{ say: `£${p.note}.00 − £${pounds(change)} = £${pounds(p.price)}.` }],
        });
      }
      default: {
        const poured = p.glass * p.glasses;
        const left = p.jug - poured;
        const litres = (ml: number) => String(ml / 1000);
        return A.multiStepContext({
          context: `A jug holds ${litres(p.jug)} litres of juice. ${p.glasses} glasses are filled with ${litres(p.glass)} litres each.`,
          parts: [
            {
              ask: "How much juice is poured into the glasses, in litres?",
              answer: A.number(poured / 1000),
            },
            {
              ask: "How much juice is left in the jug, in litres?",
              answer: A.number(left / 1000),
              wrong: wrongs(left / 1000, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number((p.jug - p.glass) / 1000),
                  feedback: `${p.glasses} glasses are filled, not one.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.glasses} × ${litres(p.glass)} = ${litres(poured)} litres.` },
            { say: `${litres(p.jug)} − ${litres(poured)} = ${litres(left)} litres.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.round(numberAnswer(question) * 100) === p.price + p.tenth;
    if (question.archetype === "reverse")
      return Math.round(numberAnswer(question) * 100) === p.price;
    return Math.round(numberAnswer(question, 1) * 1000) === p.jug - p.glass * p.glasses;
  },
});
