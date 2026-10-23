/**
 * @statement FM-FP1-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-07.a: Use Euler's method
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-07.ts";

const own = concept(
  "FM-FP1-07.a",
  ["CALC.NUMERICAL"],
  [
    {
      question:
        "$\\frac{dy}{dx} = x + y$, with $y = 1$ at $x = 0$. One step of Euler's method uses $h = 0.1$.",
      ask: "What is the estimate of y at $x = 0.1$?",
      correct: "1.1",
      wrong: [
        ["2", "Multiply the gradient by h: 1 + 0.1 × 1.", "CALC.NUMERICAL"],
        ["1.01", "The gradient at (0, 1) is 0 + 1 = 1, so y increases by 0.1.", "CALC.NUMERICAL"],
      ],
      why: "$y_1 = y_0 + h f(x_0, y_0) = 1 + 0.1 \\times 1 = 1.1$.",
    },
  ],
  [
    {
      statement:
        "Ida says halving the step length in Euler's method usually makes the estimate less accurate.",
      truth: false,
      right:
        "False. Smaller steps follow the curve more closely, so the estimate usually improves.",
      wrong: [
        ["True. More steps add up more errors.", "CALC.NUMERICAL"],
        ["True. The step length does not affect accuracy.", "CALC.NUMERICAL"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-07.a" };

export default defineGenerator(mixFamilies("FM-FP1-07.a", { 1: base, 2: own, 4: own }));
