/**
 * @statement FM-D1-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-03.a: Use Dijkstra's algorithm
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-03.ts";

const own = concept(
  "FM-D1-03.a",
  ["DEC.SHORTEST-PATH"],
  [
    {
      question: "In Dijkstra's algorithm, which vertex gets the next permanent label?",
      correct: "The vertex with the smallest temporary label",
      wrong: [
        [
          "The vertex nearest the vertex labelled last",
          "Compare every temporary label, not just the newest edges.",
          "DEC.SHORTEST-PATH",
        ],
        [
          "The vertex with the largest temporary label",
          "Permanent labels go in increasing order of distance.",
          "DEC.SHORTEST-PATH",
        ],
      ],
      why: "The smallest temporary label cannot be improved, so it becomes permanent.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D1-03.a" };

export default defineGenerator(mixFamilies("FM-D1-03.a", { 1: base, 2: own, 4: base }));
