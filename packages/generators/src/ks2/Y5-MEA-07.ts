/**
 * @statement Y5-MEA-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-07: Use all four operations to solve problems involving measure [for example, length, mass,
// volume, money] using decimal notation, including scaling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { pounds } from "../shared/mea.ts";

interface Params {
  serves: number;
  needed: number;
  grams: number;
  ribbon: number;
  pieces: number;
  kgA: number;
  priceA: number;
  kgB: number;
  priceB: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "Y5-MEA-07",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.ADDITIVE", "NPV.DECIMAL.POINT-PLACE", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const serves = rng.pick([2, 4]);
    const needed = serves * rng.int(2, numbers === "friendly" ? 3 : 5);
    const pieces = rng.int(3, 8);
    const ribbon = r2((pieces * rng.int(2, 9)) / 10);
    if (Number.isInteger(ribbon)) reject("a decimal ribbon length");
    return {
      serves,
      needed,
      grams: rng.int(3, 9) * 25,
      ribbon,
      pieces,
      kgA: rng.int(2, 4),
      priceA: rng.int(80, 190),
      kgB: rng.pick([1.5, 2.5, 0.5]),
      priceB: rng.int(4, 9) * 10,
    };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const g = (p.grams * p.needed) / p.serves;
        return A.standard({
          question: `A recipe for ${p.serves} people uses ${p.grams} g of flour.`,
          ask: `How much flour is needed for ${p.needed} people?`,
          answer: A.number(g, { units: "g" }),
          wrong: wrongs(g, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.grams + p.needed - p.serves, { units: "g" }),
              feedback: `There are ${p.needed / p.serves} times as many people, so multiply the flour by ${p.needed / p.serves}.`,
            },
          ]),
          solution: [
            {
              say: `${p.needed} ÷ ${p.serves} = ${p.needed / p.serves}, so ${p.grams} × ${p.needed / p.serves} = ${g} g.`,
            },
          ],
        });
      }
      case 2: {
        const each = r2(p.ribbon / p.pieces);
        return A.standard({
          question: `A ribbon ${p.ribbon} m long is cut into ${p.pieces} equal pieces.`,
          ask: "How long is each piece, in metres?",
          answer: A.number(each, { units: "m" }),
          wrong: wrongs(each, [
            {
              code: "NPV.DECIMAL.POINT-PLACE",
              value: A.number(r2(each * 10), { units: "m" }),
              feedback: `Check the size: ${p.pieces} pieces of ${r2(each * 10)} m would be far longer than ${p.ribbon} m.`,
            },
          ]),
          solution: [{ say: `${p.ribbon} ÷ ${p.pieces} = ${each} m.` }],
        });
      }
      default: {
        const a = p.kgA * p.priceA;
        const b = Math.round(p.kgB * p.priceB);
        return A.multiStepContext({
          context: `Apples cost ${pounds(p.priceA)} per kg and grapes cost ${pounds(p.priceB)} per kg. Zoe buys ${p.kgA} kg of apples and ${p.kgB} kg of grapes.`,
          parts: [
            {
              ask: "How much do the apples cost, in pounds?",
              answer: A.number(r2(a / 100), { units: "£" }),
            },
            {
              ask: "How much does she spend altogether, in pounds?",
              answer: A.number(r2((a + b) / 100), { units: "£" }),
              wrong: wrongs(r2((a + b) / 100), [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r2((a + p.priceB) / 100), { units: "£" }),
                  feedback: `She buys ${p.kgB} kg of grapes, so multiply their price per kg by ${p.kgB}.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${pounds(p.priceA)} × ${p.kgA} = ${pounds(a)}.` },
            {
              say: `${pounds(p.priceB)} × ${p.kgB} = ${pounds(b)}, and ${pounds(a)} + ${pounds(b)} = ${pounds(a + b)}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return (
        Math.abs(numberAnswer(question, 1) - (p.kgA * p.priceA + p.kgB * p.priceB) / 100) < 1e-9
      );
    const n = numberAnswer(question);
    return n === (p.grams * p.needed) / p.serves || Math.abs(n * p.pieces - p.ribbon) < 1e-9;
  },
});
