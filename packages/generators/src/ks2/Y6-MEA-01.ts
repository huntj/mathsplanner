/**
 * @statement Y6-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-01: Solve problems involving the calculation and conversion of units of measure, using
// decimal notation up to three decimal places where appropriate
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  kg: number;
  a: number;
  g: number;
  km: number;
  m: number;
  bottle: number;
  glass: number;
  glasses: number;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "Y6-MEA-01",
  version: "1.1.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.CONVERT.FACTOR", "MEA.UNITS.MIXED", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const kg = r3(rng.int(1001, 9999) / 1000);
    if (Math.round(kg * 1000) % 10 === 0) reject("three decimal places");
    const km = r3(rng.int(1, 9) / 10);
    const m = Math.round(km * 1000) + rng.pick([-1, 1]) * rng.int(1, 9) * 10;
    const bottle = rng.pick([1.5, 2, 2.5]);
    const glass = rng.pick([150, 175, 200, 225, 250]);
    const glasses = rng.int(3, Math.floor((bottle * 1000) / glass) - 1);
    return {
      kg,
      a: r3(rng.int(numbers === "friendly" ? 2 : 11, 49) / (numbers === "friendly" ? 2 : 4)),
      g: rng.int(1, 19) * 50,
      km,
      m,
      bottle,
      glass,
      glasses,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const g = Math.round(p.kg * 1000);
        return A.standard({
          question: `A parcel has a mass of ${p.kg} kg.`,
          ask: "What is its mass in grams?",
          answer: A.number(g, { units: "g" }),
          wrong: wrongs(g, [
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(r3(p.kg * 100), { units: "g" }),
              feedback: "1 kg = 1000 g, so multiply by 1000: every digit moves three places.",
            },
          ]),
          solution: [{ say: `${p.kg} × 1000 = ${g} g.` }],
        });
      }
      case 2: {
        const total = r3(p.a + p.g / 1000);
        return A.standard({
          question: `Add ${p.a} kg and ${p.g} g.`,
          ask: "Give your answer in kilograms.",
          answer: A.number(total, { units: "kg" }),
          wrong: wrongs(total, [
            {
              code: "MEA.UNITS.MIXED",
              value: A.number(r3(p.a + p.g), { units: "kg" }),
              feedback: `Convert first: ${p.g} g = ${p.g / 1000} kg.`,
            },
          ]),
          solution: [
            { say: `${p.g} g = ${p.g / 1000} kg, and ${p.a} + ${p.g / 1000} = ${total} kg.` },
          ],
        });
      }
      case 4: {
        const truth = p.km * 1000 > p.m;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: `Mia says ${p.km} km is longer than ${p.m} m.`,
              truth,
              reasons: [
                {
                  text: `${truth ? "True" : "False"}. ${p.km} km = ${Math.round(p.km * 1000)} m, which is ${truth ? "more" : "less"} than ${p.m} m.`,
                  correct: true,
                },
                {
                  text: `${truth ? "False" : "True"}. ${p.m} is a bigger number than ${p.km}.`,
                  code: "MEA.UNITS.MIXED",
                },
                {
                  text: `${truth ? "False" : "True"}. ${p.km} km = ${Math.round(p.km * 100)} m.`,
                  code: "MEA.CONVERT.FACTOR",
                },
              ],
              solution: [
                { say: `Convert to metres: ${p.km} × 1000 = ${Math.round(p.km * 1000)} m.` },
              ],
            }),
          [
            {
              statement: "Amy says 2.5 kg is 2500 g.",
              truth: true,
              right: "True. 1 kg = 1000 g, so 2.5 kg = 2.5 × 1000 = 2500 g.",
              wrong: [["False. It is 250 g.", "MEA.CONVERT.FACTOR"], ["False. It is 25 g."]],
            },
            {
              statement: "Dan has 1.2 m of ribbon and uses 45 cm. He says 75 cm is left.",
              truth: true,
              right: "True. 1.2 m = 120 cm, and 120 − 45 = 75 cm.",
              wrong: [
                ["False. 1.2 − 45 cannot be done.", "MEA.UNITS.MIXED"],
                ["False. 45 − 1.2 = 43.8 cm is left.", "MEA.UNITS.MIXED"],
              ],
            },
            {
              claim: "To add 350 ml and 1.5 l, you must first write them in the same unit.",
              truth: "always",
              right: "Always. 350 ml + 1500 ml = 1850 ml, or 0.35 l + 1.5 l = 1.85 l.",
              wrong: [
                ["Never. Just add 350 and 1.5.", "MEA.UNITS.MIXED"],
                ["Sometimes. Only for big amounts."],
              ],
            },
          ],
        );
      }
      default: {
        const poured = p.glass * p.glasses;
        const left = p.bottle * 1000 - poured;
        return A.multiStepContext({
          context: `A bottle holds ${p.bottle} litres of juice. Ben pours ${p.glasses} glasses of ${p.glass} ml each.`,
          parts: [
            {
              ask: "How much juice does he pour, in ml?",
              answer: A.number(poured, { units: "ml" }),
            },
            {
              ask: "How much juice is left in the bottle, in litres?",
              answer: A.number(r3(left / 1000), { units: "l" }),
              wrong: wrongs(r3(left / 1000), [
                {
                  code: "MEA.UNITS.MIXED",
                  value: A.number(r3(p.bottle - poured / 100), { units: "l" }),
                  feedback: "1 litre is 1000 ml, not 100 ml.",
                },
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(r3(p.bottle - p.glass / 1000), { units: "l" }),
                  feedback: `Take away all ${p.glasses} glasses.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${p.glasses} × ${p.glass} = ${poured} ml.` },
            {
              say: `${p.bottle} l = ${p.bottle * 1000} ml, and ${p.bottle * 1000} − ${poured} = ${left} ml = ${r3(left / 1000)} l.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context")
      return (
        Math.abs(numberAnswer(question, 1) * 1000 - (p.bottle * 1000 - p.glass * p.glasses)) < 1e-6
      );
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === Math.round(p.kg * 1000) || Math.abs(n - (p.a + p.g / 1000)) < 1e-9;
  },
});
