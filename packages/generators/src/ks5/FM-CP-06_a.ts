/**
 * @statement FM-CP-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-06.a: Use exponential form re^(iθ)
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-06.a",
  ["CPLX.ARGUMENT"],
  [
    {
      question:
        "Write $2\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right)$ in exponential form.",
      correct: "$2e^{\\frac{\\pi}{3}i}$",
      wrong: [
        ["$e^{\\frac{2\\pi}{3}i}$", "The modulus stays in front: re^(iθ).", "CPLX.ARGUMENT"],
        ["$2e^{\\frac{\\pi}{3}}$", "The exponent is iθ, not θ.", "CPLX.ARGUMENT"],
      ],
      why: "$r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$ with $r = 2$, $\\theta = \\frac{\\pi}{3}$.",
    },
    {
      question: "What is $e^{i\\pi}$?",
      correct: "$-1$",
      wrong: [
        ["$1$", "cos π = −1 and sin π = 0.", "CPLX.ARGUMENT"],
        ["$i$", "That is e^(iπ/2).", "CPLX.ARGUMENT"],
      ],
      why: "$e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1$.",
    },
  ],
  [
    {
      statement: "Sam says $|e^{i\\theta}| = 1$ for every real θ.",
      truth: true,
      right: "True. |cos θ + i sin θ| = √(cos²θ + sin²θ) = 1.",
      wrong: [
        ["False. The modulus is θ.", "CPLX.ARGUMENT"],
        ["False. It depends on the value of θ.", "CPLX.ARGUMENT"],
      ],
    },
  ],
);

export default defineGenerator(own);
