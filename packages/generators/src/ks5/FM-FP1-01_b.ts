/**
 * @statement FM-FP1-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-01.b: Use the scalar triple product for areas and volumes
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-01.ts";

const own = concept(
  "FM-FP1-01.b",
  ["GEO.VECTOR.CROSS"],
  [
    {
      question:
        "Vectors $\\mathbf{a}$ and $\\mathbf{b}$ form two sides of a triangle, and $|\\mathbf{a} \\times \\mathbf{b}| = 14$.",
      ask: "What is the area of the triangle?",
      correct: "7",
      wrong: [
        [
          "14",
          "|a × b| is the area of the parallelogram; the triangle is half of it.",
          "GEO.VECTOR.CROSS",
        ],
        ["28", "Halve the parallelogram's area, do not double it.", "GEO.VECTOR.CROSS"],
      ],
      why: "Triangle area $= \\frac{1}{2}|\\mathbf{a} \\times \\mathbf{b}| = 7$.",
    },
  ],
  [
    {
      statement:
        "Bo finds $\\mathbf{a} \\cdot (\\mathbf{b} \\times \\mathbf{c}) = 0$ and says the three vectors must be parallel.",
      truth: false,
      right:
        "False. A zero scalar triple product means the vectors are coplanar: the parallelepiped has no volume. They need not be parallel.",
      wrong: [
        ["True. Only parallel vectors give zero.", "GEO.VECTOR.CROSS"],
        ["True. One of them must be the zero vector.", "GEO.VECTOR.CROSS"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-01.b" };

export default defineGenerator(mixFamilies("FM-FP1-01.b", { 1: own, 2: base, 4: own }));
