/**
 * @statement FM-CP-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-04.b: Use modulus-argument form
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-04.ts";

const own = concept(
  "FM-CP-04.b",
  ["CPLX.ARGUMENT"],
  [
    {
      question: "Write $z = 1 + i$ in modulus-argument form.",
      correct: "$\\sqrt{2}\\left(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4}\\right)$",
      wrong: [
        [
          "$2\\left(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4}\\right)$",
          "|z| = √(1² + 1²) = √2.",
          "CPLX.ARGUMENT",
        ],
        [
          "$\\sqrt{2}\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$",
          "tan θ = 1/1, so θ = π/4.",
          "CPLX.ARGUMENT",
        ],
      ],
      why: "$|z| = \\sqrt{2}$ and $\\arg z = \\frac{\\pi}{4}$, since z is in the first quadrant.",
    },
  ],
  [
    {
      statement:
        "Fay finds the argument of $-1 - i$ as $\\arctan\\frac{-1}{-1} = \\frac{\\pi}{4}$.",
      truth: false,
      right:
        "False. −1 − i is in the third quadrant, so the argument is −3π/4. Always check the quadrant.",
      wrong: [
        ["True. arctan gives the argument directly.", "CPLX.ARGUMENT"],
        ["True. The two minus signs cancel.", "CPLX.ARGUMENT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-04.b" };

export default defineGenerator(mixFamilies("FM-CP-04.b", { 1: own, 2: base, 4: own }));
