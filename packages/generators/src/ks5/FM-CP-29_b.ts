/**
 * @statement FM-CP-29.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-29.b: Solve second-order non-homogeneous differential equations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-29.b",
  ["CALC.AUXILIARY"],
  [
    {
      question:
        "For $\\frac{d^2y}{dx^2} - 3\\frac{dy}{dx} + 2y = 4$, the complementary function is $Ae^x + Be^{2x}$.",
      ask: "What is the particular integral?",
      correct: "$y = 2$",
      wrong: [
        ["$y = 4$", "Try y = k: 2k = 4, so k = 2.", "CALC.AUXILIARY"],
        [
          "$y = 4x$",
          "For a constant on the right, try a constant particular integral.",
          "CALC.AUXILIARY",
        ],
      ],
      why: "Try $y = k$: the derivatives are 0, so $2k = 4$ and $k = 2$.",
    },
    {
      question:
        "For $\\frac{d^2y}{dx^2} + y = 3x$, which trial function should you use for the particular integral?",
      correct: "$y = ax + b$",
      wrong: [
        [
          "$y = ax$",
          "Include a constant term as well: a linear right-hand side needs ax + b.",
          "CALC.AUXILIARY",
        ],
        ["$y = ae^{3x}$", "The right-hand side is linear, not exponential.", "CALC.AUXILIARY"],
      ],
      why: "A linear right-hand side needs a general linear trial function, $ax + b$.",
    },
  ],
  [
    {
      statement:
        "Mo says the general solution of a non-homogeneous equation is just the particular integral.",
      truth: false,
      right:
        "False. The general solution is the complementary function plus the particular integral.",
      wrong: [
        ["True. The particular integral solves the equation.", "CALC.AUXILIARY"],
        ["True. The complementary function is only for checking.", "CALC.AUXILIARY"],
      ],
    },
  ],
);

export default defineGenerator(own);
