/**
 * @statement FM-CP-27.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-27.b: Differentiate hyperbolic functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-27.ts";

const own = concept(
  "FM-CP-27.b",
  ["CALC.HYPERBOLIC"],
  [
    {
      question: "Differentiate $y = \\sinh 4x$.",
      correct: "$4\\cosh 4x$",
      wrong: [
        ["$-4\\cosh 4x$", "Unlike sin, the derivative of sinh is +cosh.", "CALC.HYPERBOLIC"],
        ["$\\cosh 4x$", "Use the chain rule: multiply by 4.", "CALC.CHAIN"],
      ],
      why: "$\\frac{d}{dx}\\sinh 4x = 4\\cosh 4x$.",
    },
  ],
  [
    {
      statement:
        "Kai says $\\frac{d}{dx}\\cosh x = -\\sinh x$, just as $\\frac{d}{dx}\\cos x = -\\sin x$.",
      truth: false,
      right: "False. d/dx cosh x = +sinh x: the hyperbolic derivatives have no minus sign.",
      wrong: [
        ["True. Hyperbolic functions differentiate like trig functions.", "CALC.HYPERBOLIC"],
        ["True. Every cosine-type function differentiates to a negative.", "CALC.HYPERBOLIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-27.b" };

export default defineGenerator(mixFamilies("FM-CP-27.b", { 1: own, 2: base, 4: own }));
