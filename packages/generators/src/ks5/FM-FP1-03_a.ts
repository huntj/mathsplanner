/**
 * @statement FM-FP1-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-03.a: Solve inequalities with rational functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-03.ts";

const own = concept(
  "FM-FP1-03.a",
  ["ALG.INEQUALITY.MULTIPLY"],
  [
    {
      question: "Solve $\\frac{1}{x - 2} > 0$.",
      correct: "$x > 2$",
      wrong: [
        ["$x < 2$", "1/(x − 2) is positive when x − 2 is positive.", "ALG.INEQUALITY.MULTIPLY"],
        [
          "$x \\ge 2$",
          "x = 2 makes the denominator 0, so it is not allowed.",
          "ALG.INEQUALITY.MULTIPLY",
        ],
      ],
      why: "The fraction is positive exactly when the denominator is positive: $x > 2$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-03.a" };

export default defineGenerator(mixFamilies("FM-FP1-03.a", { 1: base, 2: own, 4: base }));
