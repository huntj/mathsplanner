/**
 * @statement FM-CP-09.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-09.c: Combine transformations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-09.ts";

const own = concept(
  "FM-CP-09.c",
  ["MAT.TRANSFORM", "MAT.PRODUCT"],
  [
    {
      question:
        "$\\mathbf{R}$ is a rotation of 90° anticlockwise and $\\mathbf{S}$ is a reflection in the x-axis.",
      ask: "Which matrix product represents $\\mathbf{R}$ followed by $\\mathbf{S}$?",
      correct: "$\\mathbf{SR}$",
      wrong: [
        [
          "$\\mathbf{RS}$",
          "The first transformation goes on the right, next to the vector: S(Rx).",
          "MAT.TRANSFORM",
        ],
        [
          "$\\mathbf{R} + \\mathbf{S}$",
          "Combining transformations multiplies the matrices.",
          "MAT.PRODUCT",
        ],
      ],
      why: "Applying R then S to a vector x gives S(Rx) = (SR)x.",
    },
  ],
  [
    {
      statement:
        "Xan says the matrix for transformation $\\mathbf{A}$ followed by $\\mathbf{B}$ is $\\mathbf{AB}$.",
      truth: false,
      right:
        "False. A acts on the vector first, so B follows it on the left: the combined matrix is BA.",
      wrong: [
        ["True. Write the matrices in the order they happen.", "MAT.TRANSFORM"],
        ["True. The order does not matter.", "MAT.PRODUCT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-09.c" };

export default defineGenerator(mixFamilies("FM-CP-09.c", { 1: own, 2: base, 4: own }));
