/**
 * @statement FM-FP2-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-06.a: Derive and use reduction formulae
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-06.ts";

const own = concept(
  "FM-FP2-06.a",
  ["CALC.REDUCTION"],
  [
    {
      question:
        "$I_n = \\int_0^{\\pi/2} \\sin^n x\\,dx$ satisfies $I_n = \\frac{n - 1}{n}I_{n-2}$.",
      ask: "Given $I_0 = \\frac{\\pi}{2}$, find $I_2$.",
      correct: "$\\frac{\\pi}{4}$",
      wrong: [
        ["$\\frac{\\pi}{2}$", "Multiply I₀ by (2 − 1)/2 = ½.", "CALC.REDUCTION"],
        ["$\\pi$", "The factor is (n − 1)/n, which is less than 1.", "CALC.REDUCTION"],
      ],
      why: "$I_2 = \\frac{1}{2}I_0 = \\frac{\\pi}{4}$.",
    },
  ],
  [
    {
      statement: "Uma says a reduction formula gives $I_n$ directly without any starting value.",
      truth: false,
      right:
        "False. A reduction formula links I_n to an earlier integral, so you also need a starting value such as I₀ or I₁.",
      wrong: [
        ["True. The formula contains everything needed.", "CALC.REDUCTION"],
        ["True. I₀ is always 0.", "CALC.REDUCTION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP2-06.a" };

export default defineGenerator(mixFamilies("FM-FP2-06.a", { 1: base, 2: own, 4: own }));
