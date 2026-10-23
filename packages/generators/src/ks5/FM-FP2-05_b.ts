/**
 * @statement FM-FP2-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-05.b: Diagonalise matrices
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP2-05.b",
  ["MAT.EIGEN"],
  [
    {
      question:
        "A matrix $\\mathbf{M}$ has eigenvalues 2 and 5 with eigenvectors $\\mathbf{v}_1$ and $\\mathbf{v}_2$. $\\mathbf{P} = (\\mathbf{v}_1\\ \\mathbf{v}_2)$.",
      ask: "What is $\\mathbf{P}^{-1}\\mathbf{MP}$?",
      correct: "$\\begin{pmatrix} 2 & 0 \\\\ 0 & 5 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 5 & 0 \\\\ 0 & 2 \\end{pmatrix}$",
          "The eigenvalues appear in the same order as their eigenvectors in P.",
          "MAT.EIGEN",
        ],
        [
          "$\\begin{pmatrix} 2 & 5 \\\\ 0 & 0 \\end{pmatrix}$",
          "The result is diagonal, with the eigenvalues on the diagonal.",
          "MAT.EIGEN",
        ],
      ],
      why: "$\\mathbf{P}^{-1}\\mathbf{MP} = \\mathbf{D}$, the diagonal matrix of eigenvalues in the order of the columns of P.",
    },
    {
      question: "If $\\mathbf{M} = \\mathbf{PDP}^{-1}$, which is $\\mathbf{M}^n$?",
      correct: "$\\mathbf{PD}^n\\mathbf{P}^{-1}$",
      wrong: [
        [
          "$\\mathbf{P}^n\\mathbf{D}^n\\mathbf{P}^{-n}$",
          "The inner P⁻¹P pairs cancel, leaving one P and one P⁻¹.",
          "MAT.EIGEN",
        ],
        ["$\\mathbf{D}^n$", "D is similar to M, not equal to it.", "MAT.EIGEN"],
      ],
      why: "$(\\mathbf{PDP}^{-1})^n = \\mathbf{PD}^n\\mathbf{P}^{-1}$ because each $\\mathbf{P}^{-1}\\mathbf{P}$ in the middle is $\\mathbf{I}$.",
    },
  ],
  [
    {
      statement: "Sue says every 2 × 2 matrix can be diagonalised.",
      truth: false,
      right:
        "False. A matrix needs a full set of independent eigenvectors; e.g. (1 1; 0 1) has only one eigenvector direction.",
      wrong: [
        ["True. Every matrix has eigenvalues.", "MAT.EIGEN"],
        ["True. Only 3 × 3 matrices can fail.", "MAT.EIGEN"],
      ],
    },
  ],
);

export default defineGenerator(own);
