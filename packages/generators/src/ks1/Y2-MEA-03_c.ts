/**
 * @statement Y2-MEA-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-03.c: Find different combinations of coins for the same value
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coinName } from "../shared/mea.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y2-MEA-03.ts";

// Ways to make each amount.
const WAYS: Record<number, number[][]> = {
  10: [
    [5, 5],
    [5, 2, 2, 1],
    [2, 2, 2, 2, 2],
  ],
  15: [
    [10, 5],
    [5, 5, 5],
    [10, 2, 2, 1],
  ],
  20: [
    [10, 10],
    [10, 5, 5],
    [5, 5, 5, 5],
  ],
  30: [
    [20, 10],
    [10, 10, 10],
    [20, 5, 5],
  ],
  50: [
    [20, 20, 10],
    [20, 10, 10, 10],
    [10, 10, 10, 10, 10],
  ],
};
const AMOUNTS = Object.keys(WAYS).map(Number);
const show = (coins: number[]) => coins.map(coinName).join(" + ");
const sum = (coins: number[]) => coins.reduce((s, c) => s + c, 0);

interface Params {
  target: number;
  way: number;
  /** Depth 1: two wrong sets, made by swapping one coin. */
  swaps: [number, number];
  /** Depth 2: the single coin used. */
  only: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y2-MEA-03.c",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["MEA.MONEY.COIN-COUNT"],

  params(rng, numbers) {
    const target = rng.pick(numbers === "friendly" ? [10, 15, 20] : AMOUNTS);
    const only = rng.pick(
      [1, 2, 5, 10].filter((c) => target % c === 0 && c < target && target / c <= 10),
    );
    const swaps = rng.sample([1, 2, 5, 10, 20], 2) as [number, number];
    return { target, way: rng.int(0, 2), swaps, only };
  },

  build(p, depth, rng): QuestionDraft {
    const right = WAYS[p.target]?.[p.way] ?? [];
    if (depth === 1) {
      const wrong = p.swaps.map((c) => [c, ...right.slice(1)]).filter((w) => sum(w) !== p.target);
      if (wrong.length < 2 || show(wrong[0] ?? []) === show(wrong[1] ?? []))
        return reject("two wrong sets");
      return A.choice({
        rng,
        question: [`Which coins make ${p.target}p?`],
        correct: show(right),
        distractors: wrong.map((w) => ({
          content: show(w),
          feedback: `Add the values: ${show(w)} = ${sum(w)}p.`,
        })),
        solution: [{ say: `${show(right)} = ${p.target}p.` }],
      });
    }
    const n = p.target / p.only;
    const other = WAYS[p.target]?.[(p.way + 1) % 3] ?? [];
    return A.standard({
      question: `Sam makes ${p.target}p with ${show(other)}. Ben makes ${p.target}p using only ${coinName(p.only)} coins.`,
      ask: "How many coins does Ben use?",
      answer: A.number(n),
      wrong: wrongs(n, [
        {
          code: "MEA.MONEY.COIN-COUNT",
          value: A.number(p.target),
          feedback: `Each coin is worth ${coinName(p.only)}, not 1p. Count in ${p.only}s to ${p.target}.`,
        },
      ]),
      solution: [{ say: `Count in ${p.only}s to ${p.target}: that is ${n} coins.` }],
    });
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === show(WAYS[p.target]?.[p.way] ?? []);
    return numberAnswer(question) * p.only === p.target;
  },
};

export default defineGenerator(
  mixFamilies("Y2-MEA-03.c", { 1: own, 2: own, 4: { ...parent.definition, id: "Y2-MEA-03.c" } }),
);
