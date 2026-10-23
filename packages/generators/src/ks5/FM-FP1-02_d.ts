/**
 * @statement FM-FP1-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-02.d: Find tangents and normals to conics
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP1-02.d",
  ["GEO.CONIC", "CALC.STATIONARY"],
  [
    {
      question: "Find the gradient of the parabola $y^2 = 8x$ at the point $(2, 4)$.",
      correct: "1",
      wrong: [
        ["2", "Differentiate implicitly: 2y dy/dx = 8, so dy/dx = 4/y = 1.", "CALC.IMPLICIT"],
        ["−1", "That is the gradient of the normal.", "CALC.STATIONARY"],
      ],
      why: "$2y\\frac{dy}{dx} = 8$, so $\\frac{dy}{dx} = \\frac{4}{y} = 1$ at $(2, 4)$.",
    },
    {
      question: "The tangent to a conic at P has gradient $\\frac{2}{3}$.",
      ask: "What is the gradient of the normal at P?",
      correct: "$-\\frac{3}{2}$",
      wrong: [
        [
          "$\\frac{3}{2}$",
          "The normal's gradient is the negative reciprocal.",
          "ALG.PERPENDICULAR.GRADIENT",
        ],
        [
          "$-\\frac{2}{3}$",
          "Take the reciprocal as well as changing the sign.",
          "ALG.PERPENDICULAR.GRADIENT",
        ],
      ],
      why: "Tangent and normal are perpendicular, so the gradients multiply to −1.",
    },
  ],
  [
    {
      statement: "Eli says the tangent to $xy = 4$ at $(2, 2)$ has gradient 1.",
      truth: false,
      right: "False. y = 4/x gives dy/dx = −4/x² = −1 at x = 2.",
      wrong: [
        ["True. The point is on the line y = x, so the gradient is 1.", "CALC.STATIONARY"],
        ["True. A hyperbola always has gradient 1 at its vertex.", "GEO.CONIC"],
      ],
    },
  ],
);

export default defineGenerator(own);
