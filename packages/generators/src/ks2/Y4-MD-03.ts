/**
 * @statement Y4-MD-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MD-03: Recognise and use factor pairs and commutativity in mental calculations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: x × y, where y is 5, 25 or 50 and x splits into a factor pair that makes 10 or 100. */
  x: number;
  y: number;
  /** Depth 2: a × b × c = a × (b × c). */
  a: number;
  b: number;
  c: number;
  claimTrue: boolean;
}

const PARTNER: Record<number, number> = { 5: 2, 25: 4, 50: 2 };

export default defineGenerator<Params>({
  id: "Y4-MD-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    const y = rng.pick(numbers === "friendly" ? [5] : [5, 25, 50]);
    const partner = PARTNER[y] ?? 2;
    const x = partner * rng.int(3, numbers === "stretch" ? 25 : 12);
    const [b, c] = rng.pick([
      [2, 5],
      [5, 2],
      [4, 25],
      [25, 4],
      [5, 20],
    ] as const);
    const a = rng.int(3, 19);
    if (x === y) reject("different numbers");
    return { x, y, a, b, c, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const partner = PARTNER[p.y] ?? 2;
    switch (depth) {
      case 1: {
        const answer = p.x * p.y;
        return A.standard({
          question: ["Use factors to work out ", A.math(`${p.x} \\times ${p.y}`), " in your head."],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.x + p.y),
              feedback: "This is a multiplication.",
            },
          ]),
          solution: [
            {
              say: `${p.x} = ${p.x / partner} × ${partner}, so ${p.x} × ${p.y} = ${p.x / partner} × ${partner} × ${p.y} = ${p.x / partner} × ${partner * p.y} = ${answer}.`,
            },
          ],
        });
      }
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [p.a, "\\times", p.b, "\\times", p.c, "=", p.a, "\\times", p.b * p.c],
          hide: 8,
          wrong: wrongs(p.b * p.c, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.b + p.c),
              feedback: `${p.b} and ${p.c} are multiplied: ${p.b} × ${p.c} = ${p.b * p.c}.`,
            },
          ]),
          solution: [
            {
              say: `Multiply ${p.b} × ${p.c} = ${p.b * p.c} first. The order does not change the answer: ${p.a} × ${p.b * p.c} = ${p.a * p.b * p.c}.`,
            },
          ],
        });
      default: {
        const right: [number, number] = [p.x / 2, p.y * 2];
        const wrongPair: [number, number] = [p.x / 2, p.y / 2];
        const [l, r] = p.claimTrue || p.y % 2 !== 0 ? right : wrongPair;
        const truth = p.claimTrue || p.y % 2 !== 0;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Kai says ", A.math(`${p.x} \\times ${p.y} = ${l} \\times ${r}`), "."],
          truth,
          reasons: truth
            ? [
                {
                  text: `True. Halving ${p.x} and doubling ${p.y} keeps the product the same: both are ${p.x * p.y}.`,
                  correct: true,
                },
                { text: "False. Changing the numbers always changes the answer." },
                { text: "False. Only adding works like that.", code: "MD.MULTIPLY.ADDS" },
              ]
            : [
                {
                  text: `False. Halving both numbers makes the product four times smaller: ${l} × ${r} = ${l * r}, not ${p.x * p.y}.`,
                  correct: true,
                },
                { text: "True. Halving both keeps the answer the same." },
                { text: "True. Any factor pair gives the same answer.", code: "MD.MULTIPLY.ADDS" },
              ],
          solution: [
            { say: `${p.x} × ${p.y} = ${p.x * p.y}. If you halve one number, double the other.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.x * p.y;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.b * p.c;
    return true;
  },
});
