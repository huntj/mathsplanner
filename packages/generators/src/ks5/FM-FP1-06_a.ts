/**
 * @statement FM-FP1-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-06.a: Solve differential equations using Taylor series
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-06.ts";

const own = concept(
  "FM-FP1-06.a",
  ["CALC.TAYLOR"],
  [
    {
      question: "$y(0) = 1$, $y'(0) = 2$ and $y''(0) = 6$.",
      ask: "What is the Taylor series for y about $x = 0$ up to $x^2$?",
      correct: "$1 + 2x + 3x^2$",
      wrong: [
        ["$1 + 2x + 6x^2$", "Divide y''(0) by 2!.", "CALC.TAYLOR"],
        ["$1 + 2x + 12x^2$", "The coefficient is y''(0)/2!, not y''(0) × 2.", "CALC.TAYLOR"],
      ],
      why: "$y(0) + y'(0)x + \\frac{y''(0)}{2!}x^2 = 1 + 2x + 3x^2$.",
    },
  ],
  [
    {
      statement:
        "Hal says that to find $y''(0)$ from a differential equation for $\\frac{dy}{dx}$, you must first solve the equation.",
      truth: false,
      right:
        "False. Differentiate the equation itself and substitute x = 0 and the known values; no solution is needed.",
      wrong: [
        ["True. You need y as a formula first.", "CALC.TAYLOR"],
        ["True. Taylor series only work for solved equations.", "CALC.TAYLOR"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-06.a" };

export default defineGenerator(mixFamilies("FM-FP1-06.a", { 1: base, 2: own, 4: own }));
