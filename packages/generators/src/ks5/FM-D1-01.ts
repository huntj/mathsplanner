/**
 * @statement FM-D1-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-01: Follow, trace and judge the order of algorithms, including sorting and bin packing
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  list: number[];
  items: number[];
  cap: number;
}

/** One left-to-right pass of a bubble sort into ascending order. */
function onePass(xs: number[]): number[] {
  const out = [...xs];
  for (let i = 0; i < out.length - 1; i++) {
    if ((out[i] ?? 0) > (out[i + 1] ?? 0)) [out[i], out[i + 1]] = [out[i + 1] ?? 0, out[i] ?? 0];
  }
  return out;
}

function firstFit(items: number[], cap: number): number {
  const bins: number[] = [];
  for (const x of items) {
    const i = bins.findIndex((b) => b + x <= cap);
    if (i < 0) bins.push(x);
    else bins[i] = (bins[i] ?? 0) + x;
  }
  return bins.length;
}

const show = (xs: number[]) => xs.join(", ");

export default defineGenerator<Params>({
  id: "FM-D1-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.SORT", "DEC.BIN-PACKING"],

  params(rng) {
    const list = rng.shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, 6);
    const cap = rng.pick([10, 12, 15, 20]);
    const items = Array.from({ length: 7 }, () => rng.int(2, cap - 1));
    const sorted = [...list].sort((a, b) => a - b);
    const once = onePass(list);
    if (show(once) === show(sorted) || show(once) === show(list))
      reject("a pass that changes the list but does not finish it");
    const swapFirst = [...list];
    if ((swapFirst[0] ?? 0) > (swapFirst[1] ?? 0))
      [swapFirst[0], swapFirst[1]] = [swapFirst[1] ?? 0, swapFirst[0] ?? 0];
    else [swapFirst[1], swapFirst[2]] = [swapFirst[2] ?? 0, swapFirst[1] ?? 0];
    if (show(swapFirst) === show(once)) reject("a pass with more than one swap");
    const bound = Math.ceil(items.reduce((s, x) => s + x, 0) / cap);
    if (firstFit(items, cap) === bound) reject("first fit that misses the lower bound");
    return { list, items, cap };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const once = onePass(p.list);
        const swapFirst = [...p.list];
        if ((swapFirst[0] ?? 0) > (swapFirst[1] ?? 0))
          [swapFirst[0], swapFirst[1]] = [swapFirst[1] ?? 0, swapFirst[0] ?? 0];
        else [swapFirst[1], swapFirst[2]] = [swapFirst[2] ?? 0, swapFirst[1] ?? 0];
        return A.choice({
          rng,
          question: [
            `A bubble sort is used to put this list into ascending order: ${show(p.list)}.`,
          ],
          ask: "What is the list after the first pass?",
          correct: show(once),
          distractors: [
            {
              content: show([...p.list].sort((a, b) => a - b)),
              code: "DEC.SORT",
              feedback:
                "That is the end of the whole sort. One pass compares each neighbouring pair once, from left to right.",
            },
            {
              content: show(swapFirst),
              code: "DEC.SORT",
              feedback:
                "Keep going along the list: a pass compares every neighbouring pair, and the largest value moves to the end.",
            },
          ],
          solution: [
            {
              say: `Compare each neighbouring pair in turn, swapping when they are out of order. The largest value, ${Math.max(...p.list)}, ends up last: ${show(once)}.`,
            },
          ],
        });
      }
      case 2: {
        const bins = firstFit(p.items, p.cap);
        const bound = Math.ceil(p.items.reduce((s, x) => s + x, 0) / p.cap);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Items of sizes ${show(p.items)} are packed in that order into bins of capacity ${p.cap} using the first-fit algorithm.`,
              ],
              ask: "How many bins are used?",
            },
          ],
          answer: A.number(bins),
          wrong: wrongs(bins, [
            {
              code: "DEC.BIN-PACKING",
              value: A.number(bound),
              feedback: `${bound} is the lower bound (total ÷ capacity, rounded up). First fit does not always reach it: trace the algorithm.`,
            },
          ]),
          solution: [{ say: `Put each item in the first bin with room. This uses ${bins} bins.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lia says first-fit decreasing always uses the smallest possible number of bins.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It is a heuristic: it is quick and usually good, but there are examples where a better packing exists.",
              correct: true,
            },
            { text: "True. Sorting the items first makes it optimal.", code: "DEC.BIN-PACKING" },
            { text: "True. It always meets the lower bound.", code: "DEC.BIN-PACKING" },
          ],
          solution: [
            {
              say: "For example, with capacity 10, the sizes 5, 4, 4, 3, 2, 2 fit in 2 bins (5 + 3 + 2, 4 + 4 + 2), but first-fit decreasing uses 3.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === show(onePass(p.list));
    if (question.key.depth === 2) return numberAnswer(question) === firstFit(p.items, p.cap);
    return true;
  },
});
