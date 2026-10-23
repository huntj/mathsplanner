/**
 * @statement FM-D2-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D2-01.b: Improve a solution by the stepping-stone method
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-D2-01.b",
  ["DEC.TRANSPORT"],
  [
    {
      question:
        "In the stepping-stone method, what does a negative improvement index for an empty cell show?",
      correct: "Using that cell would reduce the total cost",
      wrong: [
        [
          "The solution is already optimal",
          "The solution is optimal only when no index is negative.",
          "DEC.TRANSPORT",
        ],
        [
          "That cell cannot be used",
          "Negative means it is worth bringing that cell in.",
          "DEC.TRANSPORT",
        ],
      ],
      why: "A negative index gives the change in cost per unit moved into that cell; negative means a saving.",
    },
    {
      question: "A transportation problem has 3 sources and 4 destinations.",
      ask: "How many cells are used in a non-degenerate solution?",
      correct: "6",
      wrong: [
        ["7", "A non-degenerate solution uses m + n − 1 = 3 + 4 − 1 cells.", "DEC.TRANSPORT"],
        ["12", "That is every cell in the table.", "DEC.TRANSPORT"],
      ],
      why: "$m + n - 1 = 3 + 4 - 1 = 6$ cells.",
    },
  ],
  [
    {
      statement:
        "Ian says that if total supply is greater than total demand, the transportation method cannot be used.",
      truth: false,
      right:
        "False. Add a dummy destination with zero costs to take the surplus, then proceed as usual.",
      wrong: [
        ["True. Supply must equal demand exactly.", "DEC.TRANSPORT"],
        ["True. Remove a source instead.", "DEC.TRANSPORT"],
      ],
    },
  ],
);

export default defineGenerator(own);
