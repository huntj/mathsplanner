/**
 * @statement Y7-RAT-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-03.c: Express a division as a ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  g: number;
  x: number;
  y: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y7-RAT-03.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.SIMPLIFY.SUBTRACT", "RAT.ORDER"],

  params(rng) {
    const p = {
      a: rng.int(1, 6),
      b: rng.int(2, 9),
      g: rng.int(2, 8),
      x: rng.pick([2, 4, 5, 8, 10]),
      y: rng.int(3, 40),
    };
    if (p.a >= p.b || gcdOf(p.a, p.b) > 1 || p.y % p.x === 0 || p.y < p.x)
      reject("a simplified ratio and a decimal unit ratio");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const big = [p.a * p.g, p.b * p.g];
        const right = `${p.a} : ${p.b}`;
        return A.choice({
          rng,
          question: ["Write ", A.math(`${big[0]} : ${big[1]}`), " in its simplest form."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`1 : ${(big[1] ?? 0) - (big[0] ?? 0) + 1}`),
              code: "RAT.SIMPLIFY.SUBTRACT",
              feedback: `Divide both parts by the same number (${p.g}); subtracting changes the ratio.`,
            },
            {
              content: A.math(`${p.b} : ${p.a}`),
              code: "RAT.ORDER",
              feedback: "Keep the parts in the same order as the question.",
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(right))),
          solution: [{ say: `Divide both by ${p.g}: `, math: right }],
        });
      }
      case 2: {
        const v = r(p.y / p.x);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write the ratio ",
                A.math(`${p.x} : ${p.y}`),
                " in the form ",
                A.math("1 : n"),
                ".",
              ],
              ask: "Find n.",
            },
            {
              question: [
                `A map shows ${p.x} cm for every ${p.y} km. Write this as 1 cm for every n km.`,
              ],
              ask: "Find n.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.ORDER",
              value: A.number(r(p.x / p.y)),
              feedback: `Divide both parts by ${p.x}, the first part, so it becomes 1.`,
            },
          ]),
          solution: [{ say: "", math: `${p.x} : ${p.y} = 1 : ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [`Dev says the ratio ${p.a} : ${p.b} is the same as ${p.b} : ${p.a}.`],
          truth: false,
          reasons: [
            {
              text: `False. Order matters: ${p.a} : ${p.b} means the first amount is ${p.a}/${p.b} of the second, but ${p.b} : ${p.a} means it is ${p.b}/${p.a} of it.`,
              correct: true,
            },
            { text: "True. The same numbers are used.", code: "RAT.ORDER" },
            {
              text: "True. Ratios work like adding, where order does not matter.",
              code: "RAT.ORDER",
            },
          ],
          solution: [
            { say: "A ratio a : b can be read as a ÷ b, and division is not commutative." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${p.a} : ${p.b}`;
    if (question.key.depth === 2) return numberAnswer(question) === r(p.y / p.x);
    return true;
  },
});
