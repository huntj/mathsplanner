/**
 * @statement FM-CP-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-04.c: Multiply and divide in modulus-argument form
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-04.ts";

const own = concept(
  "FM-CP-04.c",
  ["CPLX.ARGUMENT"],
  [
    {
      question:
        "$z = 3\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right)$ and $w = 2\\left(\\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6}\\right)$.",
      ask: "Find $zw$ in modulus-argument form.",
      correct: "$6\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$",
      wrong: [
        [
          "$5\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$",
          "Multiply the moduli: 3 × 2 = 6.",
          "CPLX.ARGUMENT",
        ],
        [
          "$6\\left(\\cos\\frac{\\pi^2}{18} + i\\sin\\frac{\\pi^2}{18}\\right)$",
          "Add the arguments, do not multiply them.",
          "CPLX.ARGUMENT",
        ],
      ],
      why: "Multiply the moduli and add the arguments: $3 \\times 2 = 6$ and $\\frac{\\pi}{3} + \\frac{\\pi}{6} = \\frac{\\pi}{2}$.",
    },
    {
      question:
        "$z = 8\\left(\\cos\\frac{3\\pi}{4} + i\\sin\\frac{3\\pi}{4}\\right)$ and $w = 2\\left(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4}\\right)$.",
      ask: "Find $\\frac{z}{w}$ in modulus-argument form.",
      correct: "$4\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$",
      wrong: [
        [
          "$4\\left(\\cos\\pi + i\\sin\\pi\\right)$",
          "Dividing subtracts the arguments: 3π/4 − π/4.",
          "CPLX.ARGUMENT",
        ],
        [
          "$6\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$",
          "Divide the moduli: 8 ÷ 2 = 4.",
          "CPLX.ARGUMENT",
        ],
      ],
      why: "Divide the moduli and subtract the arguments: $8 \\div 2 = 4$ and $\\frac{3\\pi}{4} - \\frac{\\pi}{4} = \\frac{\\pi}{2}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-04.c" };

export default defineGenerator(mixFamilies("FM-CP-04.c", { 1: own, 2: own, 4: base }));
