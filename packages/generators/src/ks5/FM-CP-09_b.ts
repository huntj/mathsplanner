/**
 * @statement FM-CP-09.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-09.b: Use 3×3 matrices for transformations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-09.b",
  ["MAT.TRANSFORM"],
  [
    {
      question:
        "Which transformation does $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$ represent?",
      correct: "A reflection in the plane $z = 0$",
      wrong: [
        [
          "A reflection in the plane $x = 0$",
          "Only the z-coordinate changes sign.",
          "MAT.TRANSFORM",
        ],
        [
          "A rotation of 180° about the z-axis",
          "That would change the signs of x and y.",
          "MAT.TRANSFORM",
        ],
      ],
      why: "(x, y, z) maps to (x, y, −z): a reflection in the xy-plane, z = 0.",
    },
    {
      question:
        "Which matrix represents a rotation of 90° about the z-axis, anticlockwise when looking down from above?",
      correct: "$\\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & -1 \\\\ 0 & 1 & 0 \\end{pmatrix}$",
          "That rotates about the x-axis: x is unchanged.",
          "MAT.TRANSFORM",
        ],
        [
          "$\\begin{pmatrix} 0 & 1 & 0 \\\\ -1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$",
          "That turns (1, 0, 0) to (0, −1, 0), which is clockwise.",
          "MAT.TRANSFORM",
        ],
      ],
      why: "z is unchanged, and (1, 0, 0) goes to (0, 1, 0): the first column is the image of i.",
    },
  ],
  [
    {
      statement:
        "Wyn says the columns of a 3 × 3 transformation matrix are the images of $\\mathbf{i}$, $\\mathbf{j}$ and $\\mathbf{k}$.",
      truth: true,
      right:
        "True. Multiplying the matrix by i, j or k picks out the first, second or third column.",
      wrong: [
        ["False. The rows are the images.", "MAT.TRANSFORM"],
        ["False. Only a 2 × 2 matrix works like that.", "MAT.TRANSFORM"],
      ],
    },
  ],
);

export default defineGenerator(own);
