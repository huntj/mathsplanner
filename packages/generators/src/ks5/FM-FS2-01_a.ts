/**
 * @statement FM-FS2-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-01.a: Fit least squares regression lines
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-01.ts";

const own = concept(
  "FM-FS2-01.a",
  ["STA.REGRESSION.VARIABLES"],
  [
    {
      question: "The regression line of y on x is $y = 3 + 2x$, and $\\bar{x} = 5$.",
      ask: "What is $\\bar{y}$?",
      correct: "13",
      wrong: [
        ["10", "The line passes through (x̄, ȳ): ȳ = 3 + 2 × 5.", "STA.REGRESSION.VARIABLES"],
        ["5", "x̄ and ȳ are not usually equal.", "STA.REGRESSION.VARIABLES"],
      ],
      why: "The least squares line passes through $(\\bar{x}, \\bar{y})$: $\\bar{y} = 3 + 2 \\times 5 = 13$.",
    },
  ],
  [
    {
      statement: "Hana uses the regression line of y on x to estimate x from a given value of y.",
      truth: false,
      right:
        "False. The line of y on x minimises errors in y; to estimate x from y, use the regression line of x on y.",
      wrong: [
        ["True. Rearrange the line for x.", "STA.REGRESSION.VARIABLES"],
        ["True. Both lines are the same.", "STA.REGRESSION.VARIABLES"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-01.a" };

export default defineGenerator(mixFamilies("FM-FS2-01.a", { 1: base, 2: own, 4: own }));
