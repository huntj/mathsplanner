/**
 * @statement FM-D1-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-04.a: Solve route inspection problems
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-04.ts";

const own = concept(
  "FM-D1-04.a",
  ["DEC.ROUTE-INSPECTION"],
  [
    {
      question: "A network has exactly two odd vertices, P and Q.",
      ask: "Which edges must be repeated in the shortest inspection route?",
      correct: "The edges on the shortest path from P to Q",
      wrong: [
        [
          "The shortest edge in the network",
          "Repeating edges must make every vertex even, so join P to Q.",
          "DEC.ROUTE-INSPECTION",
        ],
        [
          "No edges",
          "With two odd vertices the route cannot return to its start without repeating.",
          "DEC.ROUTE-INSPECTION",
        ],
      ],
      why: "Repeating the shortest P–Q path makes every degree even, giving an Eulerian circuit.",
    },
  ],
  [
    {
      statement:
        "Dee says a network with every vertex of even degree needs some edges repeated for a route inspection.",
      truth: false,
      right:
        "False. If every vertex is even the network is Eulerian: a closed route uses each edge exactly once.",
      wrong: [
        ["True. Every route inspection repeats edges.", "DEC.ROUTE-INSPECTION"],
        ["True. The shortest edge is always repeated.", "DEC.ROUTE-INSPECTION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-04.a" };

export default defineGenerator(mixFamilies("FM-D1-04.a", { 1: base, 2: own, 4: own }));
