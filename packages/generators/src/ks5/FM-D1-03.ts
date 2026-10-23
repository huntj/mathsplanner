/**
 * @statement FM-D1-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-03: Find shortest paths (Dijkstra, Floyd)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { type Edge, dijkstra, edgeList, greedyWalk, name, network } from "../shared/dec.ts";

export interface Params {
  n: number;
  edges: Edge[];
  bc: number;
  ba: number;
  ac: number;
}

export default defineGenerator<Params>({
  id: "FM-D1-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.SHORTEST-PATH"],

  params(rng) {
    const n = rng.int(5, 6);
    const p = {
      n,
      edges: network(rng, n, rng.int(3, 5)),
      bc: rng.int(8, 30),
      ba: rng.int(2, 15),
      ac: rng.int(2, 15),
    };
    const best = dijkstra(n, p.edges, 0)[n - 1] ?? 0;
    const greedy = greedyWalk(p.edges, 0, n - 1);
    if (greedy === undefined || greedy === best)
      reject("a network where the greedy walk is not shortest");
    if (p.edges.some(([a, b]) => a === 0 && b === n - 1))
      reject("no direct edge from start to end");
    if (p.ba + p.ac >= p.bc) reject("a Floyd update that changes the entry");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = dijkstra(p.n, p.edges, 0)[p.n - 1] ?? 0;
        return A.standard({
          question: [`A network has these edges (with weights): ${edgeList(p.edges)}.`],
          ask: `Use Dijkstra's algorithm to find the length of the shortest path from A to ${name(p.n - 1)}.`,
          answer: A.number(d),
          wrong: wrongs(d, [
            {
              code: "DEC.SHORTEST-PATH",
              value: A.number(greedyWalk(p.edges, 0, p.n - 1) ?? 0),
              feedback:
                "Always taking the shortest edge from where you are does not find the shortest path. Label every vertex with its best distance so far.",
            },
          ]),
          solution: [
            { say: `Dijkstra's algorithm gives a final label of ${d} at ${name(p.n - 1)}.` },
          ],
        });
      }
      case 2: {
        const v = Math.min(p.bc, p.ba + p.ac);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `In Floyd's algorithm, the current distance table has d(B, C) = ${p.bc}, d(B, A) = ${p.ba} and d(A, C) = ${p.ac}.`,
              ],
              ask: "What is d(B, C) after the iteration that uses A as the intermediate vertex?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.SHORTEST-PATH",
              value: A.number(p.bc),
              feedback: `Compare: going via A gives ${p.ba} + ${p.ac} = ${p.ba + p.ac}, which is shorter.`,
            },
          ]),
          solution: [{ say: `min(${p.bc}, ${p.ba} + ${p.ac}) = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ned says Dijkstra's algorithm always finds shortest paths, even when some edges have negative weights.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Dijkstra's algorithm makes a label permanent once it is the smallest; a negative edge found later could still reduce it.",
              correct: true,
            },
            {
              text: "True. It checks every edge, so the signs do not matter.",
              code: "DEC.SHORTEST-PATH",
            },
            { text: "True. Negative weights just make paths shorter.", code: "DEC.SHORTEST-PATH" },
          ],
          solution: [{ say: "Dijkstra's algorithm needs non-negative weights." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === dijkstra(p.n, p.edges, 0)[p.n - 1];
    if (question.key.depth === 2) return numberAnswer(question) === Math.min(p.bc, p.ba + p.ac);
    return true;
  },
});
