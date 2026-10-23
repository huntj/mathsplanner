/**
 * @statement FM-D1-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-02.b: Use Kruskal's algorithm
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-02.ts";

const own = concept(
  "FM-D1-02.b",
  ["DEC.MST"],
  [
    {
      question:
        "In Kruskal's algorithm, the next smallest edge would join two vertices already connected in the tree.",
      ask: "What do you do?",
      correct: "Reject it, because it would make a cycle",
      wrong: [
        [
          "Add it, because it is the smallest edge left",
          "A spanning tree cannot contain a cycle.",
          "DEC.MST",
        ],
        ["Stop the algorithm", "Move on to the next smallest edge.", "DEC.MST"],
      ],
      why: "Kruskal adds the smallest edge that does not make a cycle, until there are n − 1 edges.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D1-02.b" };

export default defineGenerator(mixFamilies("FM-D1-02.b", { 1: base, 2: own, 4: base }));
