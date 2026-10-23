/**
 * @statement FM-FM2-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-03.b: Find centres of mass of frameworks
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FM2-03.b",
  ["MECH.CENTRE-MASS"],
  [
    {
      question:
        "A framework is made of three uniform rods of equal mass per metre, forming a triangle.",
      ask: "How is the centre of mass of each rod found?",
      correct: "It is at the midpoint of the rod, with mass proportional to its length",
      wrong: [
        [
          "It is at the vertex where the rod starts",
          "A uniform rod's mass is spread evenly, so it balances at its midpoint.",
          "MECH.CENTRE-MASS",
        ],
        [
          "Every rod has the same mass",
          "Longer rods have more mass when the mass per metre is the same.",
          "MECH.CENTRE-MASS",
        ],
      ],
      why: "Treat each rod as a particle at its midpoint with mass proportional to its length.",
    },
    {
      question:
        "Rods of lengths 3 m (along the x-axis from 0) and 4 m (along the y-axis from 0) are joined at the origin. They have the same mass per metre.",
      ask: "Find the x-coordinate of the centre of mass.",
      correct: "$\\frac{9}{14}$",
      wrong: [
        ["$\\frac{3}{2}$", "Include the 4 m rod, whose midpoint has x = 0.", "MECH.CENTRE-MASS"],
        ["$\\frac{3}{4}$", "Weight by length: (3 × 1.5 + 4 × 0) ÷ 7.", "MECH.CENTRE-MASS"],
      ],
      why: "$\\bar{x} = \\frac{3 \\times 1.5 + 4 \\times 0}{7} = \\frac{9}{14}$.",
    },
  ],
  [
    {
      statement:
        "Uma says the centre of mass of a triangular wire frame is the same point as for a triangular lamina.",
      truth: false,
      right:
        "False. A lamina's mass is spread over the area; a frame's mass is only on the edges, weighted by their lengths. They usually differ.",
      wrong: [
        ["True. The shape is the same, so the centre of mass is the same.", "MECH.CENTRE-MASS"],
        ["True. Both are at the average of the vertices.", "MECH.CENTRE-MASS"],
      ],
    },
  ],
);

export default defineGenerator(own);
