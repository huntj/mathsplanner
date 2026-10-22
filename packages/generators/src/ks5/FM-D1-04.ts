/**
 * @statement FM-D1-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-04: Solve route inspection and travelling salesperson problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  total: number;
  /** Shortest distances AB, CD, AC, BD, AD, BC between the odd vertices. */
  d: number[];
  w: number;
  fromA: number[];
}

const pairings = (d: number[]) => [
  (d[0] ?? 0) + (d[1] ?? 0),
  (d[2] ?? 0) + (d[3] ?? 0),
  (d[4] ?? 0) + (d[5] ?? 0),
];
const lowerBound = (p: Params) =>
  p.w +
  [...p.fromA]
    .sort((a, b) => a - b)
    .slice(0, 2)
    .reduce((s, x) => s + x, 0);

export default defineGenerator<Params>({
  id: "FM-D1-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.ROUTE-INSPECTION", "DEC.TSP"],

  params(rng) {
    const p = {
      total: rng.int(60, 150),
      d: Array.from({ length: 6 }, () => rng.int(3, 20)),
      w: rng.int(20, 60),
      fromA: Array.from({ length: 4 }, () => rng.int(4, 25)),
    };
    const pr = pairings(p.d);
    if ((pr[0] ?? 0) === Math.min(...pr)) reject("a first pairing that is not the best");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.total + Math.min(...pairings(p.d));
        const [ab, cd, ac, bd, ad, bc] = p.d;
        return A.standard({
          question: [
            `A network has total weight ${p.total}. Its odd vertices are A, B, C and D, with shortest distances AB = ${ab}, CD = ${cd}, AC = ${ac}, BD = ${bd}, AD = ${ad} and BC = ${bc}.`,
          ],
          ask: "Find the length of the shortest route that travels every edge and returns to the start.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.ROUTE-INSPECTION",
              value: A.number(p.total + (pairings(p.d)[0] ?? 0)),
              feedback:
                "Check all three pairings (AB + CD, AC + BD, AD + BC) and repeat the shortest.",
            },
          ]),
          solution: [
            {
              say: `The pairings give ${pairings(p.d).join(", ")}. The least is ${Math.min(...pairings(p.d))}, so the route is ${p.total} + ${Math.min(...pairings(p.d))} = ${v}.`,
            },
          ],
        });
      }
      case 2: {
        const v = lowerBound(p);
        const sorted = [...p.fromA].sort((a, b) => a - b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `For a travelling salesperson problem, a minimum spanning tree of the network with A deleted has weight ${p.w}. The edges from A have weights ${p.fromA.join(", ")}.`,
              ],
              ask: "Find the lower bound given by deleting A.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.TSP",
              value: A.number(p.w + (sorted[0] ?? 0)),
              feedback: "A tour enters and leaves A, so add the two shortest edges from A.",
            },
          ]),
          solution: [{ say: `${p.w} + ${sorted[0]} + ${sorted[1]} = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ola says the nearest neighbour algorithm always finds the shortest tour."],
          truth: false,
          reasons: [
            {
              text: "False. It gives an upper bound: a real tour, but not necessarily the shortest. Taking the nearest vertex now can force long edges later.",
              correct: true,
            },
            {
              text: "True. Choosing the shortest edge each time must give the shortest tour.",
              code: "DEC.TSP",
            },
            { text: "True. It is the same as finding a minimum spanning tree.", code: "DEC.TSP" },
          ],
          solution: [
            { say: "The optimal tour lies between the lower bound and the best upper bound." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === p.total + Math.min(...pairings(p.d));
    if (question.key.depth === 2) return numberAnswer(question) === lowerBound(p);
    return true;
  },
});
