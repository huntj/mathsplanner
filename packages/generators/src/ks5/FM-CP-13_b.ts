/**
 * @statement FM-CP-13.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-13.b: Form equations with transformed roots
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-13.b",
  ["ALG.ROOTS-COEFF"],
  [
    {
      question: "$x^2 - 5x + 3 = 0$ has roots $\\alpha$ and $\\beta$.",
      ask: "Which equation has roots $2\\alpha$ and $2\\beta$?",
      correct: "$x^2 - 10x + 12 = 0$",
      wrong: [
        ["$x^2 - 10x + 6 = 0$", "The product of the new roots is 4αβ = 12.", "ALG.ROOTS-COEFF"],
        [
          "$2x^2 - 10x + 6 = 0$",
          "That has the same roots as the original equation.",
          "ALG.ROOTS-COEFF",
        ],
      ],
      why: "Sum $2(\\alpha + \\beta) = 10$, product $4\\alpha\\beta = 12$, so $x^2 - 10x + 12 = 0$.",
    },
    {
      question: "$x^2 + 3x - 2 = 0$ has roots $\\alpha$ and $\\beta$.",
      ask: "Using the substitution $w = x + 1$, which equation has roots $\\alpha + 1$ and $\\beta + 1$?",
      correct: "$w^2 + w - 4 = 0$",
      wrong: [
        ["$w^2 + 5w + 2 = 0$", "Substitute x = w − 1, not x = w + 1.", "ALG.ROOTS-COEFF"],
        [
          "$w^2 + 3w - 1 = 0$",
          "Substitute x = w − 1 into every term and expand.",
          "ALG.ROOTS-COEFF",
        ],
      ],
      why: "$(w-1)^2 + 3(w-1) - 2 = w^2 + w - 4$.",
    },
  ],
  [
    {
      statement:
        "To find an equation with roots $\\alpha + 2$ and $\\beta + 2$, Ash substitutes $x = w + 2$.",
      truth: false,
      right: "False. If w = x + 2 then x = w − 2. Substitute x = w − 2 into the original equation.",
      wrong: [
        ["True. Add 2 to x to get the new roots.", "ALG.ROOTS-COEFF"],
        ["True. Either substitution gives the same equation.", "ALG.ROOTS-COEFF"],
      ],
    },
  ],
);

export default defineGenerator(own);
