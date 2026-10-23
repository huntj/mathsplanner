/**
 * @statement FM-CP-22.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-22.a: Use vector and Cartesian equations of lines
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-22.a",
  ["GEO.VECTOR.POSITION"],
  [
    {
      question:
        "Which is a vector equation of the line through $(1, 2, 3)$ in the direction $\\begin{pmatrix} 4 \\\\ 0 \\\\ -1 \\end{pmatrix}$?",
      correct:
        "$\\mathbf{r} = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix} + t\\begin{pmatrix} 4 \\\\ 0 \\\\ -1 \\end{pmatrix}$",
      wrong: [
        [
          "$\\mathbf{r} = \\begin{pmatrix} 4 \\\\ 0 \\\\ -1 \\end{pmatrix} + t\\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}$",
          "The fixed point comes first and the parameter multiplies the direction.",
          "GEO.VECTOR.POSITION",
        ],
        [
          "$\\mathbf{r} = t\\begin{pmatrix} 5 \\\\ 2 \\\\ 2 \\end{pmatrix}$",
          "That line goes through the origin.",
          "GEO.VECTOR.POSITION",
        ],
      ],
      why: "$\\mathbf{r} = \\mathbf{a} + t\\mathbf{d}$: position vector of a point plus a multiple of the direction.",
    },
    {
      question:
        "Which Cartesian equation matches $\\mathbf{r} = \\begin{pmatrix} 2 \\\\ -1 \\\\ 0 \\end{pmatrix} + t\\begin{pmatrix} 3 \\\\ 1 \\\\ 5 \\end{pmatrix}$?",
      correct: "$\\frac{x - 2}{3} = \\frac{y + 1}{1} = \\frac{z}{5}$",
      wrong: [
        [
          "$\\frac{x - 3}{2} = \\frac{y - 1}{-1} = \\frac{z - 5}{0}$",
          "The point goes in the numerators and the direction in the denominators.",
          "GEO.VECTOR.POSITION",
        ],
        [
          "$\\frac{x + 2}{3} = \\frac{y - 1}{1} = \\frac{z}{5}$",
          "Use x − 2 and y − (−1) = y + 1.",
          "GEO.VECTOR.COMPONENTS",
        ],
      ],
      why: "Each coordinate gives $t$: $t = \\frac{x - 2}{3} = \\frac{y + 1}{1} = \\frac{z}{5}$.",
    },
  ],
  [
    {
      statement:
        "Eli says the lines with directions $\\begin{pmatrix} 2 \\\\ -4 \\\\ 6 \\end{pmatrix}$ and $\\begin{pmatrix} -1 \\\\ 2 \\\\ -3 \\end{pmatrix}$ are parallel.",
      truth: true,
      right: "True. One direction is −2 times the other, so the lines are parallel.",
      wrong: [
        ["False. Parallel lines need identical direction vectors.", "GEO.VECTOR.DIRECTION"],
        ["False. The signs are different, so they point different ways.", "GEO.VECTOR.DIRECTION"],
      ],
    },
  ],
);

export default defineGenerator(own);
