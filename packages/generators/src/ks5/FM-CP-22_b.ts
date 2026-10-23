/**
 * @statement FM-CP-22.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-22.b: Use vector and Cartesian equations of planes
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-22.ts";

const own = concept(
  "FM-CP-22.b",
  ["GEO.VECTOR.PLANE"],
  [
    {
      question: "Which vector is normal to the plane $2x - y + 3z = 7$?",
      correct: "$\\begin{pmatrix} 2 \\\\ -1 \\\\ 3 \\end{pmatrix}$",
      wrong: [
        [
          "$\\begin{pmatrix} 2 \\\\ 1 \\\\ 3 \\end{pmatrix}$",
          "Keep the sign of the y coefficient.",
          "GEO.VECTOR.PLANE",
        ],
        [
          "$\\begin{pmatrix} 2 \\\\ -1 \\\\ 7 \\end{pmatrix}$",
          "7 is the constant, not a coefficient.",
          "GEO.VECTOR.PLANE",
        ],
      ],
      why: "The coefficients of x, y and z give a normal vector.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-22.b" };

export default defineGenerator(mixFamilies("FM-CP-22.b", { 1: base, 2: own, 4: base }));
