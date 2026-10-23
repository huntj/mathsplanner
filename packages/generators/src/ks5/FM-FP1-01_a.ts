/**
 * @statement FM-FP1-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-01.a: Use the vector product
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-01.ts";

const own = concept(
  "FM-FP1-01.a",
  ["GEO.VECTOR.CROSS"],
  [
    {
      question: "Work out $\\mathbf{i} \\times \\mathbf{j}$.",
      correct: "$\\mathbf{k}$",
      wrong: [
        ["$-\\mathbf{k}$", "That is j × i. i, j, k follow the cyclic order.", "GEO.VECTOR.CROSS"],
        [
          "$0$",
          "The vector product of perpendicular unit vectors is a unit vector, not 0.",
          "GEO.VECTOR.CROSS",
        ],
      ],
      why: "$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}$, following the cycle i → j → k.",
    },
    {
      question: "Which describes the direction of $\\mathbf{a} \\times \\mathbf{b}$?",
      correct: "Perpendicular to both $\\mathbf{a}$ and $\\mathbf{b}$",
      wrong: [
        [
          "Parallel to $\\mathbf{a} + \\mathbf{b}$",
          "The vector product is at right angles to both vectors.",
          "GEO.VECTOR.CROSS",
        ],
        [
          "In the plane of $\\mathbf{a}$ and $\\mathbf{b}$",
          "It is normal to that plane.",
          "GEO.VECTOR.CROSS",
        ],
      ],
      why: "$\\mathbf{a} \\times \\mathbf{b}$ is perpendicular to both, which is why it gives a normal to a plane.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-01.a" };

export default defineGenerator(mixFamilies("FM-FP1-01.a", { 1: base, 2: own, 4: base }));
