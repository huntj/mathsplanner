/**
 * @statement FM-CP-11.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-11.b: Find inverses of matrices
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-11.b",
  ["MAT.INVERSE"],
  [
    {
      question: "Find the inverse of $\\begin{pmatrix} 4 & 3 \\\\ 1 & 1 \\end{pmatrix}$.",
      correct: "$\\begin{pmatrix} 1 & -3 \\\\ -1 & 4 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 1 & 3 \\\\ 1 & 4 \\end{pmatrix}$",
          "Swap the leading diagonal and change the signs of the other two entries.",
          "MAT.INVERSE",
        ],
        [
          "$\\begin{pmatrix} -1 & 3 \\\\ 1 & -4 \\end{pmatrix}$",
          "The determinant is 4 − 3 = 1, so there is no sign change overall.",
          "MAT.INVERSE",
        ],
      ],
      why: "det = 4 − 3 = 1, so the inverse is $\\frac{1}{1}\\begin{pmatrix} 1 & -3 \\\\ -1 & 4 \\end{pmatrix}$.",
    },
    {
      question:
        "For which value of $k$ does $\\begin{pmatrix} k & 2 \\\\ 3 & 6 \\end{pmatrix}$ have no inverse?",
      correct: "$k = 1$",
      wrong: [
        [
          "$k = 0$",
          "A matrix has no inverse when its determinant is 0: 6k − 6 = 0.",
          "MAT.DETERMINANT",
        ],
        ["$k = -1$", "det = 6k − 2 × 3 = 6k − 6, which is 0 when k = 1.", "MAT.DETERMINANT"],
      ],
      why: "Singular when $6k - 6 = 0$, so $k = 1$.",
    },
  ],
  [
    {
      statement: "Zed says every square matrix has an inverse.",
      truth: false,
      right: "False. A matrix with determinant 0 is singular and has no inverse.",
      wrong: [
        ["True. Swap and negate the entries to find it.", "MAT.INVERSE"],
        ["True. Only non-square matrices have no inverse.", "MAT.INVERSE"],
      ],
    },
  ],
);

export default defineGenerator(own);
