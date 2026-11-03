/**
 * @statement Y7-RAT-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-01.a: Convert units of length, mass and capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const UNITS: [string, string, number][] = [
  ["g", "kg", 1000],
  ["ml", "litres", 1000],
  ["m", "km", 1000],
  ["cm", "m", 100],
  ["mm", "cm", 10],
];

interface Params {
  u: number;
  n: number;
  m: number;
  cm: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-RAT-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION"],

  params(rng) {
    const p = {
      u: rng.int(0, UNITS.length - 1),
      n: rng.int(15, 950),
      m: rng.int(1, 9),
      cm: rng.int(50, 990),
    };
    if (p.cm === p.m * 100 || p.cm % 10 === 0) reject("two lengths that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [small, big, f] = UNITS[p.u] ?? ["g", "kg", 1000];
        const v = r(p.n / f);
        return A.standard({
          question: [`Convert ${p.n} ${small} to ${big}.`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(p.n * f),
              feedback: `There are fewer ${big} than ${small}, so divide by ${f}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} \\div ${f} = ${v}` }],
        });
      }
      case 2: {
        const right = p.m * 100 > p.cm ? `${p.m} m` : `${p.cm} cm`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Which is longer, ${p.m} m or ${p.cm} cm?`],
          correct: right,
          distractors: [
            {
              content: right === `${p.m} m` ? `${p.cm} cm` : `${p.m} m`,
              code: "RAT.UNITS.DIRECTION",
              feedback: `Change to the same units: ${p.m} m = ${p.m * 100} cm.`,
            },
            {
              content: "They are the same length",
              feedback: `${p.m} m = ${p.m * 100} cm, which is not ${p.cm} cm.`,
            },
          ],
          solution: [{ say: `${p.m} m = ${p.m * 100} cm, so ${right} is longer.` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Ivy says 1 litre is 100 ml."],
              truth: false,
              reasons: [
                {
                  text: "False. Milli means a thousandth: 1 litre = 1000 ml, just as 1 m = 1000 mm.",
                  correct: true,
                },
                { text: "True. Metric units go up in 100s.", code: "RAT.UNITS.DIRECTION" },
                { text: "True. 1 m = 100 cm, so 1 litre = 100 ml.", code: "RAT.UNITS.DIRECTION" },
              ],
              solution: [{ say: "kilo = 1000, centi = 1/100, milli = 1/1000." }],
            }),
          [
            {
              statement: `Ola says ${p.m} kg = ${p.m * 1000} g.`,
              truth: true,
              right: "True. 1 kg = 1000 g, so multiply by 1000.",
              wrong: [
                [`False. Divide: ${p.m / 1000} g.`, "RAT.UNITS.DIRECTION"],
                [`False. It is ${p.m * 100} g.`],
              ],
            },
            {
              statement: `Pip says ${p.n} cm = ${p.n * 100} m.`,
              truth: false,
              right: `False. Metres are bigger, so divide: ${p.n} ÷ 100 = ${p.n / 100} m.`,
              wrong: [
                ["True. There are 100 cm in a metre, so multiply by 100.", "RAT.UNITS.DIRECTION"],
                ["True. Metres are bigger, so the number gets bigger.", "RAT.UNITS.DIRECTION"],
              ],
            },
            {
              claim:
                "Changing an amount from a smaller unit to a bigger unit gives a smaller number.",
              truth: "always",
              right: "Always. Fewer of the bigger units are needed: 300 cm = 3 m.",
              wrong: [
                ["Sometimes. Only for lengths.", "RAT.UNITS.DIRECTION"],
                ["Never. Bigger units give bigger numbers.", "RAT.UNITS.DIRECTION"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const [, , f] = UNITS[p.u] ?? ["g", "kg", 1000];
    if (question.key.depth === 1) return numberAnswer(question) === r(p.n / f);
    if (question.key.depth === 2)
      return chosenText(question) === (p.m * 100 > p.cm ? `${p.m} m` : `${p.cm} cm`);
    return true;
  },
});
