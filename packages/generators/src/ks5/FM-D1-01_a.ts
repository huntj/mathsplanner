/**
 * @statement FM-D1-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-01.a: Trace sorting algorithms
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-01.ts";

const own = concept(
  "FM-D1-01.a",
  ["DEC.SORT"],
  [
    {
      question: "How do you know a bubble sort has finished?",
      correct: "A pass is made with no swaps",
      wrong: [
        [
          "The largest item has reached the end",
          "That happens after the first pass; the rest may still be unsorted.",
          "DEC.SORT",
        ],
        [
          "The number of passes equals the number of items",
          "You can stop as soon as a pass makes no swaps.",
          "DEC.SORT",
        ],
      ],
      why: "When a complete pass makes no swaps, every neighbouring pair is in order.",
    },
  ],
  [
    {
      statement:
        "Yan says that after one pass of a bubble sort into ascending order, the list is always sorted.",
      truth: false,
      right: "False. One pass only guarantees the largest item is at the end.",
      wrong: [
        ["True. One pass compares every pair.", "DEC.SORT"],
        ["True. A pass swaps every item into place.", "DEC.SORT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D1-01.a" };

export default defineGenerator(mixFamilies("FM-D1-01.a", { 1: base, 2: own, 4: own }));
