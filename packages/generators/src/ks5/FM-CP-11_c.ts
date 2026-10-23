/**
 * @statement FM-CP-11.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-11.c: Use (AB)⁻¹ = B⁻¹A⁻¹
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-11.ts";

const own = concept(
  "FM-CP-11.c",
  ["MAT.INVERSE"],
  [
    {
      question:
        "$\\mathbf{A}^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 2 & 1 \\end{pmatrix}$ and $\\mathbf{B}^{-1} = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$.",
      ask: "Find $(\\mathbf{AB})^{-1}$.",
      correct: "$\\begin{pmatrix} 7 & 3 \\\\ 2 & 1 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 1 & 3 \\\\ 2 & 7 \\end{pmatrix}$",
          "That is A⁻¹B⁻¹. The order reverses: (AB)⁻¹ = B⁻¹A⁻¹.",
          "MAT.INVERSE",
        ],
        [
          "$\\begin{pmatrix} 2 & 3 \\\\ 2 & 2 \\end{pmatrix}$",
          "Multiply the matrices; do not add them.",
          "MAT.PRODUCT",
        ],
      ],
      why: "$(\\mathbf{AB})^{-1} = \\mathbf{B}^{-1}\\mathbf{A}^{-1} = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & 0 \\\\ 2 & 1 \\end{pmatrix} = \\begin{pmatrix} 7 & 3 \\\\ 2 & 1 \\end{pmatrix}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-11.c" };

export default defineGenerator(mixFamilies("FM-CP-11.c", { 1: own, 2: own, 4: base }));
