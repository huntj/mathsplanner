/**
 * @statement FM-D1-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-02.a: Use graph theory vocabulary
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-02.ts";

const own = concept(
  "FM-D1-02.a",
  ["DEC.MST"],
  [
    {
      question: "What is a tree?",
      correct: "A connected graph with no cycles",
      wrong: [
        [
          "A graph in which every vertex has even degree",
          "That describes an Eulerian graph.",
          "DEC.MST",
        ],
        [
          "A graph with a cycle through every vertex",
          "That is a Hamiltonian cycle; a tree has no cycles.",
          "DEC.MST",
        ],
      ],
      why: "A tree is connected and has no cycles; on n vertices it has n − 1 edges.",
    },
    {
      question: "A graph has vertex degrees 3, 2, 2, 3 and 4.",
      ask: "How many edges does it have?",
      correct: "7",
      wrong: [
        ["14", "Each edge adds 2 to the sum of degrees: divide 14 by 2.", "DEC.MST"],
        ["5", "That is the number of vertices.", "DEC.MST"],
      ],
      why: "The sum of degrees, 14, is twice the number of edges, so there are 7.",
    },
  ],
  [
    {
      statement: "Amy says a graph can have an odd number of vertices of odd degree.",
      truth: false,
      right:
        "False. The sum of degrees is even (twice the edges), so the number of odd vertices is even.",
      wrong: [
        ["True. Any degrees are possible.", "DEC.MST"],
        ["True. Trees often have three odd vertices.", "DEC.MST"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-02.a" };

export default defineGenerator(mixFamilies("FM-D1-02.a", { 1: own, 2: base, 4: own }));
