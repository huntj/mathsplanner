/**
 * @statement FM-D2-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-04: Use dynamic programming for stage and state problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** S→A, S→B */
  s: number[];
  /** A→C, A→D, B→C, B→D */
  m: number[];
  /** C→T, D→T */
  t: number[];
}

const ROUTES = [
  ["A", "C"],
  ["A", "D"],
  ["B", "C"],
  ["B", "D"],
] as const;

const legs = (p: Params, k: number) => {
  const first = p.s[k < 2 ? 0 : 1] ?? 0;
  const middle = p.m[k] ?? 0;
  const last = p.t[k % 2] ?? 0;
  return [first, middle, last];
};
const minCost = (p: Params) =>
  Math.min(...[0, 1, 2, 3].map((k) => legs(p, k).reduce((s, x) => s + x, 0)));
const maximin = (p: Params) => Math.max(...[0, 1, 2, 3].map((k) => Math.min(...legs(p, k))));

/** Take the cheaper arc at each stage from S. */
function greedy(p: Params): number {
  const a = (p.s[0] ?? 0) <= (p.s[1] ?? 0) ? 0 : 1;
  const k = (p.m[2 * a] ?? 0) <= (p.m[2 * a + 1] ?? 0) ? 2 * a : 2 * a + 1;
  return legs(p, k).reduce((s, x) => s + x, 0);
}

const arcs = (p: Params) =>
  `SA ${p.s[0]}, SB ${p.s[1]}, AC ${p.m[0]}, AD ${p.m[1]}, BC ${p.m[2]}, BD ${p.m[3]}, CT ${p.t[0]}, DT ${p.t[1]}`;

export default defineGenerator<Params>({
  id: "FM-D2-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.DYNAMIC"],

  params(rng) {
    const e = () => rng.int(2, 20);
    const p = { s: [e(), e()], m: [e(), e(), e(), e()], t: [e(), e()] };
    if (greedy(p) === minCost(p)) reject("a network where the greedy choice fails");
    const sums = [0, 1, 2, 3].map((k) => legs(p, k).reduce((s, x) => s + x, 0));
    const bestSum = Math.max(...sums);
    const maxiRoute = [0, 1, 2, 3].find((k) => Math.min(...legs(p, k)) === maximin(p)) ?? 0;
    if ((sums[maxiRoute] ?? 0) === bestSum) reject("a maximin route that is not the longest route");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `A network has stages S, then A or B, then C or D, then T. The arcs have weights ${arcs(p)}.`;
    switch (depth) {
      case 1: {
        const v = minCost(p);
        return A.standard({
          question: [intro],
          ask: "Use dynamic programming to find the least total weight of a route from S to T.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.DYNAMIC",
              value: A.number(greedy(p)),
              feedback:
                "Choosing the cheapest arc at each stage from S is not always best. Work backwards from T.",
            },
          ]),
          solution: [
            {
              say: `Working back from T: best from C is ${p.t[0]}, from D is ${p.t[1]}; then from A and B; then from S, giving ${v}.`,
            },
          ],
        });
      }
      case 2: {
        const v = maximin(p);
        const best = [0, 1, 2, 3].map((k) => legs(p, k).reduce((s, x) => s + x, 0));
        const longest = best.indexOf(Math.max(...best));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                intro,
                " The weights are the heights of bridges (in metres) on each road.",
              ],
              ask: "A lorry wants the route whose lowest bridge is as high as possible (a maximin route). What is the height of the lowest bridge on that route?",
            },
          ],
          answer: A.number(v, { units: "m" }),
          wrong: wrongs(v, [
            {
              code: "DEC.DYNAMIC",
              value: A.number(Math.min(...legs(p, longest)), { units: "m" }),
              feedback: "A maximin route maximises the smallest arc, not the total.",
            },
          ]),
          solution: [
            {
              say: `For each route, find its smallest arc, then choose the route where that is largest: ${v} m (S–${ROUTES[[0, 1, 2, 3].find((k) => Math.min(...legs(p, k)) === v) ?? 0]?.join("–")}–T).`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Una says the shortest route from S to T must start along the shortest arc out of S.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A short first arc can lead to long arcs later. Dynamic programming works backwards so every choice accounts for the rest of the route.",
              correct: true,
            },
            { text: "True. Starting short always helps.", code: "DEC.DYNAMIC" },
            {
              text: "True. Bellman's principle says to choose the best arc at each stage.",
              code: "DEC.DYNAMIC",
            },
          ],
          solution: [
            {
              say: "Bellman's principle: any part of an optimal route is itself optimal for that part.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === minCost(p);
    if (question.key.depth === 2) return numberAnswer(question) === maximin(p);
    return true;
  },
});
