/**
 * @statement FM-D1-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-04.b: Solve travelling salesperson problems
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-04.ts";

const own = concept(
  "FM-D1-04.b",
  ["DEC.TSP"],
  [
    {
      question:
        "For a travelling salesperson problem you find a lower bound of 64 and an upper bound of 71.",
      ask: "What can you say about the optimal tour length, L?",
      correct: "$64 \\le L \\le 71$",
      wrong: [
        ["$L = 64$", "A lower bound may not be achievable by a real tour.", "DEC.TSP"],
        [
          "$L > 71$",
          "The upper bound comes from a real tour, so the best is at most 71.",
          "DEC.TSP",
        ],
      ],
      why: "The optimal tour lies between the best lower bound and the best upper bound.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D1-04.b" };

export default defineGenerator(mixFamilies("FM-D1-04.b", { 1: own, 2: base, 4: base }));
