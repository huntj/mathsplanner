/**
 * @statement FM-FP1-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-03.b: Solve inequalities with the modulus
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-03.ts";

const own = concept(
  "FM-FP1-03.b",
  ["ALG.MODULUS.NEGATIVE"],
  [
    {
      question: "Solve $|x - 3| < 5$.",
      correct: "$-2 < x < 8$",
      wrong: [
        [
          "$x < 8$",
          "The distance from 3 must also be less than 5 on the left: x > −2.",
          "ALG.MODULUS.NEGATIVE",
        ],
        ["$x < -2$ or $x > 8$", "That is |x − 3| > 5.", "ALG.MODULUS.NEGATIVE"],
      ],
      why: "$-5 < x - 3 < 5$, so $-2 < x < 8$.",
    },
  ],
  [
    {
      statement: "Fay solves $|2x + 1| = -3$ and gets $x = -2$.",
      truth: false,
      right: "False. A modulus is never negative, so |2x + 1| = −3 has no solutions.",
      wrong: [
        ["True. Drop the modulus and solve 2x + 1 = −3.", "ALG.MODULUS.NEGATIVE"],
        ["True. Every modulus equation has a solution.", "ALG.MODULUS.NEGATIVE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-03.b" };

export default defineGenerator(mixFamilies("FM-FP1-03.b", { 1: own, 2: base, 4: own }));
