/**
 * @statement FM-CP-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-05.a: Use loci of the form |z − a| = r
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-05.ts";

const own = concept(
  "FM-CP-05.a",
  ["CPLX.LOCUS"],
  [
    {
      question: "Which describes the locus $|z - 3 + 2i| = 4$?",
      correct: "A circle with centre $(3, -2)$ and radius 4",
      wrong: [
        [
          "A circle with centre $(-3, 2)$ and radius 4",
          "|z − a| = r is centred at a. Here a = 3 − 2i.",
          "CPLX.LOCUS",
        ],
        [
          "A circle with centre $(3, -2)$ and radius 16",
          "The modulus is the distance itself, 4.",
          "ALG.CIRCLE.RADIUS-SQUARED",
        ],
      ],
      why: "$|z - (3 - 2i)| = 4$: points 4 away from $3 - 2i$.",
    },
  ],
  [
    {
      statement: "Hal says $|z| \\le 2$ is the circle of radius 2 only, not the points inside it.",
      truth: false,
      right:
        "False. |z| ≤ 2 is the disc: every point at most 2 from the origin, including the inside.",
      wrong: [
        ["True. A locus with a modulus is always a curve.", "CPLX.LOCUS"],
        ["True. ≤ and = mean the same thing for a modulus.", "CPLX.LOCUS"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-05.a" };

export default defineGenerator(mixFamilies("FM-CP-05.a", { 1: base, 2: own, 4: own }));
