/**
 * @statement FM-CP-16.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-16.a: Find Maclaurin series
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-16.ts";

const own = concept(
  "FM-CP-16.a",
  ["CALC.MACLAURIN"],
  [
    {
      question:
        "The Maclaurin series of $f(x)$ is $f(0) + f'(0)x + \\frac{f''(0)}{2!}x^2 + \\dots$",
      ask: "For $f(x) = e^{3x}$, what is the coefficient of $x^2$?",
      correct: "$\\frac{9}{2}$",
      wrong: [
        ["$9$", "Divide f''(0) = 9 by 2! = 2.", "CALC.MACLAURIN"],
        ["$\\frac{3}{2}$", "f''(x) = 9e^(3x): differentiate twice.", "CALC.MACLAURIN"],
      ],
      why: "$f''(0) = 9$, so the coefficient is $\\frac{9}{2!} = \\frac{9}{2}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-16.a" };

export default defineGenerator(mixFamilies("FM-CP-16.a", { 1: base, 2: own, 4: base }));
