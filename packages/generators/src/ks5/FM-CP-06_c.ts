/**
 * @statement FM-CP-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-06.c: Derive trig identities from de Moivre's theorem
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-06.c",
  ["CPLX.DE-MOIVRE", "GEO.TRIG.IDENTITY"],
  [
    {
      question:
        "Using de Moivre's theorem, $\\cos 2\\theta + i\\sin 2\\theta = (\\cos\\theta + i\\sin\\theta)^2$.",
      ask: "Comparing real parts, what is $\\cos 2\\theta$?",
      correct: "$\\cos^2\\theta - \\sin^2\\theta$",
      wrong: [
        ["$\\cos^2\\theta + \\sin^2\\theta$", "(i sin θ)² = −sin²θ.", "CPLX.ARITHMETIC"],
        ["$2\\sin\\theta\\cos\\theta$", "That is the imaginary part, sin 2θ.", "CPLX.DE-MOIVRE"],
      ],
      why: "$(\\cos\\theta + i\\sin\\theta)^2 = \\cos^2\\theta - \\sin^2\\theta + 2i\\sin\\theta\\cos\\theta$.",
    },
    {
      question: "Expanding $(\\cos\\theta + i\\sin\\theta)^3$, which gives $\\sin 3\\theta$?",
      correct: "$3\\cos^2\\theta\\sin\\theta - \\sin^3\\theta$",
      wrong: [
        [
          "$3\\cos^2\\theta\\sin\\theta + \\sin^3\\theta$",
          "(i sin θ)³ = −i sin³θ, so the sign is minus.",
          "CPLX.ARITHMETIC",
        ],
        [
          "$\\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta$",
          "That is the real part, cos 3θ.",
          "CPLX.DE-MOIVRE",
        ],
      ],
      why: "The imaginary terms are $3\\cos^2\\theta(i\\sin\\theta)$ and $(i\\sin\\theta)^3 = -i\\sin^3\\theta$.",
    },
  ],
  [
    {
      statement: "Tia says $(\\cos\\theta + i\\sin\\theta)^n = \\cos^n\\theta + i\\sin^n\\theta$.",
      truth: false,
      right:
        "False. De Moivre's theorem gives cos nθ + i sin nθ: the angle is multiplied, not the functions raised to a power.",
      wrong: [
        ["True. Raise each part to the power.", "CPLX.DE-MOIVRE"],
        ["True. That is de Moivre's theorem.", "CPLX.DE-MOIVRE"],
      ],
    },
  ],
);

export default defineGenerator(own);
