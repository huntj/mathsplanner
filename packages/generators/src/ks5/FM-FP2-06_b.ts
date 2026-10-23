/**
 * @statement FM-FP2-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-06.b: Find arc lengths
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-06.ts";

const own = concept(
  "FM-FP2-06.b",
  ["CALC.ARC-LENGTH"],
  [
    {
      question: "Which integral gives the length of $y = f(x)$ from $x = a$ to $x = b$?",
      correct: "$\\int_a^b \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx$",
      wrong: [
        ["$\\int_a^b \\sqrt{1 + y^2}\\,dx$", "Use the gradient dy/dx, not y.", "CALC.ARC-LENGTH"],
        [
          "$\\int_a^b \\left(1 + \\frac{dy}{dx}\\right)dx$",
          "Each small piece has length √(δx² + δy²): keep the square and the root.",
          "CALC.ARC-LENGTH",
        ],
      ],
      why: "A small piece has length $\\sqrt{1 + (dy/dx)^2}\\,\\delta x$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP2-06.b" };

export default defineGenerator(mixFamilies("FM-FP2-06.b", { 1: own, 2: base, 4: base }));
