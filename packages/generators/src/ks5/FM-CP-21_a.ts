/**
 * @statement FM-CP-21.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-21.a: Differentiate inverse trig functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-21.ts";

const own = concept(
  "FM-CP-21.a",
  ["CALC.INVERSE-TRIG"],
  [
    {
      question: "Differentiate $y = \\arctan x$.",
      correct: "$\\frac{1}{1 + x^2}$",
      wrong: [
        [
          "$\\frac{1}{\\sqrt{1 - x^2}}$",
          "That is the derivative of arcsin x.",
          "CALC.INVERSE-TRIG",
        ],
        ["$\\sec^2 x$", "That is the derivative of tan x, not arctan x.", "CALC.INVERSE-TRIG"],
      ],
      why: "$\\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^2}$.",
    },
  ],
  [
    {
      statement: "Dee says the derivative of $\\arccos x$ is $\\frac{1}{\\sqrt{1 - x^2}}$.",
      truth: false,
      right: "False. arccos x decreases, so its derivative is −1/√(1 − x²).",
      wrong: [
        ["True. It is the same as for arcsin x.", "CALC.INVERSE-TRIG"],
        ["True. All inverse trig derivatives are positive.", "CALC.INVERSE-TRIG"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-21.a" };

export default defineGenerator(mixFamilies("FM-CP-21.a", { 1: own, 2: base, 4: own }));
