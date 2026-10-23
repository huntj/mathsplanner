/**
 * @statement FM-FP1-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-07.b: Use the midpoint method
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP1-07.b",
  ["CALC.NUMERICAL"],
  [
    {
      question:
        "The midpoint method for $\\frac{dy}{dx} = f(x, y)$ is $y_{r+1} = y_{r-1} + 2h f(x_r, y_r)$.",
      ask: "Which values does each step need?",
      correct: "Two earlier values, $y_{r-1}$ and $y_r$",
      wrong: [
        [
          "Only $y_r$",
          "The formula starts from y_(r−1) and uses the gradient at y_r.",
          "CALC.NUMERICAL",
        ],
        [
          "Only $y_{r-1}$",
          "It also needs the gradient at the middle point, x_r.",
          "CALC.NUMERICAL",
        ],
      ],
      why: "Each step jumps $2h$ from $y_{r-1}$ using the gradient at the midpoint $x_r$.",
    },
    {
      question:
        "Using $y_{r+1} = y_{r-1} + 2h f(x_r, y_r)$ with $h = 0.1$, $y_0 = 1$, $y_1 = 1.2$ and $f(x_1, y_1) = 2.5$.",
      ask: "Find $y_2$.",
      correct: "1.5",
      wrong: [
        ["1.45", "Start from y₀ = 1, not y₁: 1 + 0.2 × 2.5.", "CALC.NUMERICAL"],
        ["1.25", "The step is 2h = 0.2.", "CALC.NUMERICAL"],
      ],
      why: "$y_2 = y_0 + 2h f(x_1, y_1) = 1 + 0.2 \\times 2.5 = 1.5$.",
    },
  ],
  [
    {
      statement:
        "Jai says the midpoint method can start straight from the initial condition alone.",
      truth: false,
      right:
        "False. It needs two starting values, so the first step is usually found another way, e.g. with Euler's method.",
      wrong: [
        ["True. It only uses one earlier value.", "CALC.NUMERICAL"],
        ["True. Every numerical method needs just y₀.", "CALC.NUMERICAL"],
      ],
    },
  ],
);

export default defineGenerator(own);
