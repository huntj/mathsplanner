/**
 * @statement FM-CP-26.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-26.b: Use inverse hyperbolic functions and their logarithmic forms
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-26.ts";

const own = concept(
  "FM-CP-26.b",
  ["ALG.HYPERBOLIC"],
  [
    {
      question: "Which is the logarithmic form of $\\operatorname{arsinh} x$?",
      correct: "$\\ln\\left(x + \\sqrt{x^2 + 1}\\right)$",
      wrong: [
        [
          "$\\ln\\left(x + \\sqrt{x^2 - 1}\\right)$",
          "That is arcosh x, for x ≥ 1.",
          "ALG.HYPERBOLIC",
        ],
        ["$\\frac{1}{2}\\ln\\frac{1 + x}{1 - x}$", "That is artanh x.", "ALG.HYPERBOLIC"],
      ],
      why: "Solving $x = \\sinh y$ as a quadratic in $e^y$ gives $y = \\ln\\left(x + \\sqrt{x^2 + 1}\\right)$.",
    },
  ],
  [
    {
      statement: "Jade says $\\operatorname{arcosh} x$ is defined for every real x.",
      truth: false,
      right: "False. cosh x ≥ 1, so its inverse is only defined for x ≥ 1.",
      wrong: [
        ["True. Like arsinh, it is defined everywhere.", "ALG.HYPERBOLIC"],
        ["True. Hyperbolic functions have no restrictions.", "ALG.HYPERBOLIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-26.b" };

export default defineGenerator(mixFamilies("FM-CP-26.b", { 1: own, 2: base, 4: own }));
