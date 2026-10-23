/**
 * @statement FM-D1-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-02.c: Use Prim's algorithm
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-D1-02.c",
  ["DEC.MST"],
  [
    {
      question: "How does Prim's algorithm choose the next edge?",
      correct: "The smallest edge joining a vertex in the tree to a vertex not yet in it",
      wrong: [
        [
          "The smallest edge anywhere that makes no cycle",
          "That is Kruskal's algorithm.",
          "DEC.MST",
        ],
        [
          "The smallest edge from the vertex added last",
          "Consider edges from every vertex already in the tree.",
          "DEC.MST",
        ],
      ],
      why: "Prim grows one tree, always adding the cheapest edge from the tree to a new vertex.",
    },
    {
      question: "Why is Prim's algorithm well suited to a distance matrix?",
      correct: "You can scan the rows of the vertices already in the tree for the smallest entry",
      wrong: [
        ["It needs the edges sorted by weight first", "That is Kruskal's algorithm.", "DEC.MST"],
        [
          "It only uses one row of the matrix",
          "It uses every row for vertices already in the tree.",
          "DEC.MST",
        ],
      ],
      why: "Cross out columns as vertices join, and look along the chosen rows for the smallest remaining entry.",
    },
  ],
  [
    {
      statement:
        "Ben says Prim's and Kruskal's algorithms always give minimum spanning trees of the same total weight.",
      truth: true,
      right:
        "True. Both find a minimum spanning tree, so the totals match (the trees can differ if weights tie).",
      wrong: [
        ["False. Kruskal always gives a lighter tree.", "DEC.MST"],
        ["False. Prim depends on the starting vertex.", "DEC.MST"],
      ],
    },
  ],
);

export default defineGenerator(own);
