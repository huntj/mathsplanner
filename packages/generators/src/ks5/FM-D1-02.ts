/**
 * @statement FM-D1-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-02: Use graph theory vocabulary and find minimum spanning trees (Kruskal, Prim)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { type Edge, edgeList, kruskal, network } from "../shared/dec.ts";

export interface Params {
  n: number;
  edges: Edge[];
}

const smallest = (p: Params) =>
  [...p.edges]
    .sort((x, y) => x[2] - y[2])
    .slice(0, p.n - 1)
    .reduce((s, e) => s + e[2], 0);

export default defineGenerator<Params>({
  id: "FM-D1-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.MST"],

  params(rng) {
    const n = rng.int(5, 6);
    const p = { n, edges: network(rng, n, rng.int(3, 4)) };
    if (smallest(p) === kruskal(n, p.edges))
      reject("a network where the smallest edges make a cycle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const mst = kruskal(p.n, p.edges);
    const intro = `A network has ${p.n} vertices and these edges (with weights): ${edgeList(p.edges)}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro],
          ask: "Use Kruskal's algorithm to find the total weight of a minimum spanning tree.",
          answer: A.number(mst),
          wrong: wrongs(mst, [
            {
              code: "DEC.MST",
              value: A.number(smallest(p)),
              feedback:
                "Take the edges in order of weight, but reject any edge that would make a cycle.",
            },
          ]),
          solution: [
            {
              say: `Add edges from the smallest, rejecting any that form a cycle, until ${p.n - 1} edges are chosen. Total weight ${mst}.`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: [intro], ask: "How many edges does a spanning tree of this network have?" },
          ],
          answer: A.number(p.n - 1),
          wrong: wrongs(p.n - 1, [
            {
              code: "DEC.MST",
              value: A.number(p.n),
              feedback: `A tree on ${p.n} vertices has ${p.n - 1} edges; one more would make a cycle.`,
            },
          ]),
          solution: [{ say: `A spanning tree on n vertices has n − 1 edges: ${p.n - 1}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says a minimum spanning tree gives the shortest route that visits every vertex.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A spanning tree connects every vertex with the least total weight, but it is a tree, not a route: following it may mean going back along edges.",
              correct: true,
            },
            { text: "True. It is the shortest way to reach every vertex.", code: "DEC.MST" },
            { text: "True. Kruskal's algorithm finds the shortest tour.", code: "DEC.MST" },
          ],
          solution: [
            { say: "A tour that visits every vertex is a travelling salesperson problem." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === kruskal(p.n, p.edges);
    if (question.key.depth === 2) return numberAnswer(question) === p.n - 1;
    return true;
  },
});
