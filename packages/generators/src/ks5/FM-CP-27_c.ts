/**
 * @statement FM-CP-27.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-27.c: Integrate hyperbolic functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-27.c",
  ["CALC.HYPERBOLIC"],
  [
    {
      question: "Find $\\int \\cosh 3x\\,dx$.",
      correct: "$\\frac{1}{3}\\sinh 3x + c$",
      wrong: [
        ["$3\\sinh 3x + c$", "Integrating divides by 3.", "CALC.STANDARD-INTEGRAL"],
        [
          "$-\\frac{1}{3}\\sinh 3x + c$",
          "∫cosh x dx = sinh x + c, with no minus sign.",
          "CALC.HYPERBOLIC",
        ],
      ],
      why: "$\\int \\cosh 3x\\,dx = \\frac{1}{3}\\sinh 3x + c$.",
    },
    {
      question: "Find $\\int \\frac{1}{\\sqrt{x^2 + 4}}\\,dx$.",
      correct: "$\\operatorname{arsinh}\\frac{x}{2} + c$",
      wrong: [
        [
          "$\\operatorname{arcosh}\\frac{x}{2} + c$",
          "x² + a² gives arsinh; x² − a² gives arcosh.",
          "CALC.HYPERBOLIC",
        ],
        [
          "$\\frac{1}{2}\\arctan\\frac{x}{2} + c$",
          "arctan comes from 1/(a² + x²), with no square root.",
          "CALC.INVERSE-TRIG",
        ],
      ],
      why: "$\\int \\frac{1}{\\sqrt{x^2 + a^2}}\\,dx = \\operatorname{arsinh}\\frac{x}{a} + c$ with $a = 2$.",
    },
  ],
  [
    {
      statement: "Lee says $\\int \\sinh x\\,dx = -\\cosh x + c$.",
      truth: false,
      right: "False. d/dx cosh x = sinh x, so ∫sinh x dx = cosh x + c.",
      wrong: [
        ["True. It matches ∫sin x dx = −cos x + c.", "CALC.HYPERBOLIC"],
        ["True. Integrating always brings a minus sign.", "CALC.HYPERBOLIC"],
      ],
    },
  ],
);

export default defineGenerator(own);
