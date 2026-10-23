/**
 * @statement FM-D2-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D2-06.b: Use decision trees
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D2-06.ts";

const own = concept(
  "FM-D2-06.b",
  ["DEC.DECISION-TREE"],
  [
    {
      question: "In a decision tree, what happens at a chance node?",
      correct: "The expected monetary value is found by weighting each outcome by its probability",
      wrong: [
        ["The best outcome is chosen", "That happens at a decision node.", "DEC.DECISION-TREE"],
        [
          "The outcomes are added up",
          "Weight each outcome by its probability.",
          "DEC.DECISION-TREE",
        ],
      ],
      why: "Chance nodes take expected values; decision nodes choose the best option.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D2-06.b" };

export default defineGenerator(mixFamilies("FM-D2-06.b", { 1: base, 2: own, 4: base }));
