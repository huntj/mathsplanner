/**
 * @statement FM-CP-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-08.a: Add and subtract matrices
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-08.a",
  ["MAT.PRODUCT"],
  [
    {
      question:
        "Work out $\\begin{pmatrix} 3 & -1 \\\\ 2 & 4 \\end{pmatrix} + \\begin{pmatrix} 1 & 5 \\\\ -2 & 0 \\end{pmatrix}$.",
      correct: "$\\begin{pmatrix} 4 & 4 \\\\ 0 & 4 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 2 & -6 \\\\ 4 & 4 \\end{pmatrix}$",
          "That subtracts. Add matching entries.",
          "MAT.PRODUCT",
        ],
        [
          "$\\begin{pmatrix} 4 & 4 \\\\ 4 & 4 \\end{pmatrix}$",
          "Check the bottom-left entry: 2 + (−2) = 0.",
          "MAT.PRODUCT",
        ],
      ],
      why: "Add each entry to the entry in the same position.",
    },
    {
      question: "Work out $3\\begin{pmatrix} 2 & 0 \\\\ -1 & 5 \\end{pmatrix}$.",
      correct: "$\\begin{pmatrix} 6 & 0 \\\\ -3 & 15 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 6 & 0 \\\\ -1 & 5 \\end{pmatrix}$",
          "Multiply every entry by 3, not just the first row.",
          "GEO.VECTOR.SCALAR-ONE",
        ],
        [
          "$\\begin{pmatrix} 5 & 3 \\\\ 2 & 8 \\end{pmatrix}$",
          "A scalar multiplies each entry; it is not added.",
          "GEO.VECTOR.SCALAR-ONE",
        ],
      ],
      why: "Multiply each entry by 3.",
    },
  ],
  [
    {
      statement:
        "Uma says a 2 × 3 matrix can be added to a 3 × 2 matrix, because both have six entries.",
      truth: false,
      right: "False. Matrices can only be added when they have the same order, entry by entry.",
      wrong: [
        ["True. Only the number of entries matters.", "MAT.PRODUCT"],
        ["True. Turn one of them round first and add.", "MAT.PRODUCT"],
      ],
    },
  ],
);

export default defineGenerator(own);
