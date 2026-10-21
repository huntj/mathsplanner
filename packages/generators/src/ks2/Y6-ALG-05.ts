/**
 * @statement Y6-ALG-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-ALG-05: Enumerate possibilities of combinations of two variables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: tops × trousers. */
  tops: number;
  trousers: number;
  /** Depth 2: positive whole solutions of ca·a + cb·b = total. */
  ca: number;
  cb: number;
  total: number;
}

const solutions = (ca: number, cb: number, total: number) => {
  const out: [number, number][] = [];
  for (let a = 1; ca * a < total; a++) {
    const rest = total - ca * a;
    if (rest % cb === 0 && rest > 0) out.push([a, rest / cb]);
  }
  return out;
};

export default defineGenerator<Params>({
  id: "Y6-ALG-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    const tops = rng.int(2, numbers === "friendly" ? 4 : 7);
    const trousers = rng.int(2, numbers === "friendly" ? 4 : 6);
    const ca = rng.int(2, 5);
    const cb = rng.int(2, 6);
    const total = rng.int(12, numbers === "stretch" ? 60 : 30);
    const n = solutions(ca, cb, total).length;
    if (ca === cb || n < 2 || n > 8 || tops === trousers) reject("between 2 and 8 solutions");
    return { tops, trousers, ca, cb, total };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const answer = p.tops * p.trousers;
        return A.standard({
          question: `Zoe has ${p.tops} tops and ${p.trousers} pairs of trousers.`,
          ask: "How many different outfits of one top and one pair of trousers can she make?",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.tops + p.trousers),
              feedback: `Each of the ${p.tops} tops can go with each of the ${p.trousers} pairs of trousers: ${p.tops} × ${p.trousers}.`,
            },
          ]),
          solution: [
            {
              say: `List them systematically: for each top there are ${p.trousers} outfits, so ${p.tops} × ${p.trousers} = ${answer}.`,
            },
          ],
        });
      }
      case 2: {
        const sols = solutions(p.ca, p.cb, p.total);
        return A.standard({
          question: [
            `Pens cost £${p.ca} and notebooks cost £${p.cb}. Tom spends exactly £${p.total} and buys at least one of each.`,
          ],
          ask: "How many different combinations of pens and notebooks could he buy?",
          answer: A.number(sols.length),
          solution: [
            {
              say: `Try each number of pens in turn: ${sols.map(([a, b]) => `${a} pen${a === 1 ? "" : "s"} and ${b} notebook${b === 1 ? "" : "s"}`).join("; ")}. That is ${sols.length} combinations.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Zoe has ${p.tops} tops and ${p.trousers} pairs of trousers. She says she can make ${p.tops + p.trousers} different outfits.`,
          truth: false,
          reasons: [
            {
              text: `False. Each top goes with every pair of trousers, so there are ${p.tops} × ${p.trousers} = ${p.tops * p.trousers}.`,
              correct: true,
            },
            {
              text: `True. ${p.tops} + ${p.trousers} = ${p.tops + p.trousers}.`,
              code: "MD.MULTIPLY.ADDS",
            },
            { text: "True. Each item makes one outfit." },
          ],
          solution: [
            {
              say: `Top 1 with each pair of trousers, then top 2, and so on: ${p.tops} groups of ${p.trousers}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === p.tops * p.trousers
      : numberAnswer(question) === solutions(p.ca, p.cb, p.total).length;
  },
});
