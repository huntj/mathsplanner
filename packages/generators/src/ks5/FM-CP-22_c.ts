/**
 * @statement FM-CP-22.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-22.c: Use the scalar product
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-22.ts";

const own = concept(
  "FM-CP-22.c",
  ["GEO.VECTOR.ANGLE"],
  [
    {
      question:
        "Work out $\\begin{pmatrix} 1 \\\\ 2 \\\\ -3 \\end{pmatrix} \\cdot \\begin{pmatrix} 4 \\\\ -1 \\\\ 2 \\end{pmatrix}$.",
      correct: "$-4$",
      wrong: [
        [
          "$\\begin{pmatrix} 4 \\\\ -2 \\\\ -6 \\end{pmatrix}$",
          "The scalar product is a number: add the products of the components.",
          "GEO.VECTOR.ANGLE",
        ],
        ["$8$", "Check the signs: 4 − 2 − 6 = −4.", "GEO.VECTOR.ANGLE"],
      ],
      why: "$1 \\times 4 + 2 \\times (-1) + (-3) \\times 2 = 4 - 2 - 6 = -4$.",
    },
  ],
  [
    {
      statement: "Fin says two non-zero vectors with scalar product 0 are parallel.",
      truth: false,
      right: "False. a · b = |a||b| cos θ = 0 means cos θ = 0: the vectors are perpendicular.",
      wrong: [
        ["True. A zero scalar product means no angle between them.", "GEO.VECTOR.ANGLE"],
        ["True. Parallel vectors cancel out.", "GEO.VECTOR.ANGLE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-22.c" };

export default defineGenerator(mixFamilies("FM-CP-22.c", { 1: own, 2: base, 4: own }));
