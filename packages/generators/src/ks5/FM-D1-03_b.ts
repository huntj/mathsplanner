/**
 * @statement FM-D1-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-03.b: Use Floyd's algorithm
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-03.ts";

const own = concept(
  "FM-D1-03.b",
  ["DEC.SHORTEST-PATH"],
  [
    {
      question: "Floyd's algorithm produces a distance table and a route table.",
      ask: "What does the route table show?",
      correct: "The first vertex to visit on the shortest route between each pair",
      wrong: [
        ["The total length of each route", "That is the distance table.", "DEC.SHORTEST-PATH"],
        [
          "Every vertex on the shortest route",
          "It gives the next vertex; follow it repeatedly to rebuild the route.",
          "DEC.SHORTEST-PATH",
        ],
      ],
      why: "Each entry gives the next vertex on the shortest route; repeat to trace the whole route.",
    },
  ],
  [
    {
      statement: "Cal says Floyd's algorithm finds the shortest path from one start vertex only.",
      truth: false,
      right: "False. Floyd finds the shortest distances between every pair of vertices.",
      wrong: [
        ["True. Like Dijkstra, it works from one vertex.", "DEC.SHORTEST-PATH"],
        ["True. You run it once for each vertex.", "DEC.SHORTEST-PATH"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-03.b" };

export default defineGenerator(mixFamilies("FM-D1-03.b", { 1: own, 2: base, 4: own }));
