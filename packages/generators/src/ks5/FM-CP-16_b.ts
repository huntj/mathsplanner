/**
 * @statement FM-CP-16.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-16.b: Use standard series
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-16.ts";

const own = concept(
  "FM-CP-16.b",
  ["CALC.MACLAURIN"],
  [
    {
      question:
        "Using the series for $\\ln(1 + x)$, which is the series for $\\ln(1 + 2x)$ up to $x^2$?",
      correct: "$2x - 2x^2$",
      wrong: [
        ["$2x - \\frac{x^2}{2}$", "Replace x by 2x everywhere: (2x)²/2 = 2x².", "CALC.MACLAURIN"],
        ["$2x - 4x^2$", "Divide (2x)² = 4x² by 2.", "CALC.MACLAURIN"],
      ],
      why: "$\\ln(1 + u) = u - \\frac{u^2}{2} + \\dots$ with $u = 2x$ gives $2x - 2x^2$.",
    },
  ],
  [
    {
      statement:
        "Bea says the series $\\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\dots$ is valid for every real x.",
      truth: false,
      right: "False. It is only valid for −1 < x ≤ 1.",
      wrong: [
        ["True. Maclaurin series work for every x.", "CALC.MACLAURIN"],
        ["True. The terms always get smaller.", "CALC.MACLAURIN"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-16.b" };

export default defineGenerator(mixFamilies("FM-CP-16.b", { 1: own, 2: base, 4: own }));
