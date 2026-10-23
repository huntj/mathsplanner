/**
 * @statement FM-CP-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-05.c: Represent regions in the Argand diagram
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-05.ts";

const own = concept(
  "FM-CP-05.c",
  ["CPLX.LOCUS"],
  [
    {
      question: "Which region is described by $|z - 1| < |z - 5|$?",
      correct: "The points to the left of the line $x = 3$",
      wrong: [
        [
          "The points to the right of the line $x = 3$",
          "Points closer to 1 than to 5 are on the left of the perpendicular bisector.",
          "CPLX.LOCUS",
        ],
        [
          "The inside of a circle with centre 1",
          "Comparing two distances gives a half-plane split by the perpendicular bisector.",
          "CPLX.LOCUS",
        ],
      ],
      why: "The boundary is the perpendicular bisector of 1 and 5, the line x = 3; points nearer 1 lie to its left.",
    },
  ],
  [
    {
      statement: "Ivy says the region $0 \\le \\arg z \\le \\frac{\\pi}{4}$ is a triangle.",
      truth: false,
      right:
        "False. It is an infinite sector between the half-lines at angles 0 and π/4 from the origin.",
      wrong: [
        ["True. Two lines from the origin make a triangle.", "CPLX.LOCUS"],
        ["True. Arguments are measured inside a triangle.", "CPLX.LOCUS"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-05.c" };

export default defineGenerator(mixFamilies("FM-CP-05.c", { 1: own, 2: base, 4: own }));
