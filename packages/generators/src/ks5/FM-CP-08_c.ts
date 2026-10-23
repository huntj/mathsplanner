/**
 * @statement FM-CP-08.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-08.c: Use zero and identity matrices
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-08.c",
  ["MAT.PRODUCT"],
  [
    {
      question:
        "For any 2 × 2 matrix $\\mathbf{A}$, what is $\\mathbf{AI}$, where $\\mathbf{I}$ is the identity?",
      correct: "$\\mathbf{A}$",
      wrong: [
        ["$\\mathbf{I}$", "Multiplying by the identity leaves a matrix unchanged.", "MAT.PRODUCT"],
        ["$\\mathbf{0}$", "That is the result of multiplying by the zero matrix.", "MAT.PRODUCT"],
      ],
      why: "$\\mathbf{I}$ acts like 1: $\\mathbf{AI} = \\mathbf{IA} = \\mathbf{A}$.",
    },
    {
      question: "Which is the 3 × 3 identity matrix?",
      correct: "$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{pmatrix}$",
          "The identity has 1s on the leading diagonal and 0s elsewhere.",
          "MAT.PRODUCT",
        ],
        [
          "$\\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}$",
          "The 1s go from top left to bottom right.",
          "MAT.PRODUCT",
        ],
      ],
      why: "The identity has 1s on the leading diagonal and 0s everywhere else.",
    },
  ],
  [
    {
      statement:
        "Vic says that if $\\mathbf{AB} = \\mathbf{0}$, then $\\mathbf{A}$ or $\\mathbf{B}$ must be the zero matrix.",
      truth: false,
      right:
        "False. Two non-zero matrices can multiply to give the zero matrix, e.g. (0 1; 0 0) squared is the zero matrix.",
      wrong: [
        ["True. Matrices behave like numbers.", "MAT.PRODUCT"],
        ["True. Only zero times something gives zero.", "MAT.PRODUCT"],
      ],
    },
  ],
);

export default defineGenerator(own);
