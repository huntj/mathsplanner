/**
 * @statement FM-FP2-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-05.c: Use the Cayley-Hamilton theorem
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP2-05.c",
  ["MAT.EIGEN"],
  [
    {
      question:
        "A 2 × 2 matrix $\\mathbf{M}$ has characteristic equation $\\lambda^2 - 3\\lambda + 2 = 0$.",
      ask: "By the Cayley-Hamilton theorem, which is true?",
      correct: "$\\mathbf{M}^2 - 3\\mathbf{M} + 2\\mathbf{I} = \\mathbf{0}$",
      wrong: [
        [
          "$\\mathbf{M}^2 - 3\\mathbf{M} + 2 = 0$",
          "The constant becomes 2I, and the right side is the zero matrix.",
          "MAT.EIGEN",
        ],
        [
          "$\\mathbf{M} = \\mathbf{I}$ or $\\mathbf{M} = 2\\mathbf{I}$",
          "Matrices do not factorise like numbers.",
          "MAT.EIGEN",
        ],
      ],
      why: "A matrix satisfies its own characteristic equation, with the constant term times $\\mathbf{I}$.",
    },
  ],
  [
    {
      statement:
        "Using $\\mathbf{M}^2 - 3\\mathbf{M} + 2\\mathbf{I} = \\mathbf{0}$, Tom says $\\mathbf{M}^{-1} = \\frac{1}{2}(3\\mathbf{I} - \\mathbf{M})$.",
      truth: true,
      right: "True. Multiply by M⁻¹: M − 3I + 2M⁻¹ = 0, so M⁻¹ = ½(3I − M).",
      wrong: [
        ["False. Cayley-Hamilton cannot give an inverse.", "MAT.EIGEN"],
        ["False. It should be ½(M − 3I).", "MAT.EIGEN"],
      ],
    },
  ],
);

export default defineGenerator(own);
