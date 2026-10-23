/**
 * @statement FM-CP-27.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-27.a: Prove and use hyperbolic identities
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-27.ts";

const own = concept(
  "FM-CP-27.a",
  ["CALC.HYPERBOLIC"],
  [
    {
      question: "Which identity is true for all x?",
      correct: "$\\cosh^2 x - \\sinh^2 x = 1$",
      wrong: [
        [
          "$\\cosh^2 x + \\sinh^2 x = 1$",
          "Osborn's rule changes the sign of the product of two sinh terms.",
          "CALC.HYPERBOLIC",
        ],
        [
          "$\\sinh^2 x - \\cosh^2 x = 1$",
          "cosh x is the bigger one, so cosh²x − sinh²x = 1.",
          "CALC.HYPERBOLIC",
        ],
      ],
      why: "$\\cosh^2 x - \\sinh^2 x = \\frac{(e^x + e^{-x})^2 - (e^x - e^{-x})^2}{4} = 1$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-27.a" };

export default defineGenerator(mixFamilies("FM-CP-27.a", { 1: base, 2: own, 4: base }));
