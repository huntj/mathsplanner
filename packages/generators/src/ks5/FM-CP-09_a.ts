/**
 * @statement FM-CP-09.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-09.a: Use 2×2 matrices for transformations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-09.ts";

const own = concept(
  "FM-CP-09.a",
  ["MAT.TRANSFORM"],
  [
    {
      question:
        "The matrix $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ maps $(1, 0)$ to $(0, 1)$ and $(0, 1)$ to $(-1, 0)$.",
      ask: "Which transformation is it?",
      correct: "A rotation of 90° anticlockwise about the origin",
      wrong: [
        [
          "A rotation of 90° clockwise about the origin",
          "(1, 0) moves to (0, 1), which is anticlockwise.",
          "MAT.TRANSFORM",
        ],
        ["A reflection in the line $y = x$", "That would map (0, 1) to (1, 0).", "MAT.TRANSFORM"],
      ],
      why: "The columns are the images of the unit vectors: (1, 0) turns a quarter turn anticlockwise to (0, 1).",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-09.a" };

export default defineGenerator(mixFamilies("FM-CP-09.a", { 1: base, 2: own, 4: base }));
