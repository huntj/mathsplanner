/**
 * @statement FM-D1-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-06.c: Solve linear programs by the simplex method
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D1-06.ts";

const own = concept(
  "FM-D1-06.c",
  ["DEC.LP"],
  [
    {
      question: "In the simplex method, why are slack variables added?",
      correct: "To turn each ≤ constraint into an equation",
      wrong: [
        [
          "To make the objective bigger",
          "Slack variables measure unused resources; they are not profit.",
          "DEC.LP",
        ],
        [
          "To remove the non-negativity conditions",
          "Slack variables are also non-negative.",
          "DEC.LP",
        ],
      ],
      why: "$x + y \\le 10$ becomes $x + y + s = 10$ with $s \\ge 0$.",
    },
    {
      question:
        "Once the pivot column is chosen in a simplex tableau, how is the pivot row chosen?",
      correct:
        "The smallest non-negative ratio of the value column to the positive entry in the pivot column",
      wrong: [
        ["The largest ratio", "The smallest ratio keeps every variable non-negative.", "DEC.LP"],
        [
          "The row with the largest entry in the pivot column",
          "Use the ratio test, not the size of the entry.",
          "DEC.LP",
        ],
      ],
      why: "The smallest ratio is the first constraint to become tight, so the solution stays feasible.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D1-06.c" };

export default defineGenerator(mixFamilies("FM-D1-06.c", { 1: own, 2: own, 4: base }));
