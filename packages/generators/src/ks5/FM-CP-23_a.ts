/**
 * @statement FM-CP-23.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-23.a: Find intersections of lines and planes
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-23.ts";

const own = concept(
  "FM-CP-23.a",
  ["GEO.VECTOR.PLANE"],
  [
    {
      question:
        "The line $\\mathbf{r} = \\begin{pmatrix} 1 \\\\ 0 \\\\ 2 \\end{pmatrix} + t\\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$ meets the plane $x + y + z = 9$.",
      ask: "Find the value of $t$ where they meet.",
      correct: "$t = 2$",
      wrong: [
        ["$t = 3$", "Substitute: (1 + t) + t + (2 + t) = 9, so 3 + 3t = 9.", "GEO.VECTOR.PLANE"],
        [
          "$t = 9$",
          "Put the line's x, y and z into the plane's equation and solve for t.",
          "GEO.VECTOR.PLANE",
        ],
      ],
      why: "$3 + 3t = 9$, so $t = 2$ and the point is $(3, 2, 4)$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-23.a" };

export default defineGenerator(mixFamilies("FM-CP-23.a", { 1: own, 2: own, 4: base }));
