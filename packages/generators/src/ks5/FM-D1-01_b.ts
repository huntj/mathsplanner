/**
 * @statement FM-D1-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-01.b: Use bin packing algorithms
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-01.ts";

const own = concept(
  "FM-D1-01.b",
  ["DEC.BIN-PACKING"],
  [
    {
      question: "Items of total size 47 are packed into bins of capacity 10.",
      ask: "What is the lower bound for the number of bins?",
      correct: "5",
      wrong: [
        ["4", "Round 4.7 up: you cannot use part of a bin.", "DEC.BIN-PACKING"],
        ["4.7", "The number of bins must be a whole number, so round up.", "DEC.BIN-PACKING"],
      ],
      why: "$47 \\div 10 = 4.7$, rounded up to 5.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D1-01.b" };

export default defineGenerator(mixFamilies("FM-D1-01.b", { 1: own, 2: base, 4: base }));
