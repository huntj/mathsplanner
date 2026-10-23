/**
 * @statement FM-CP-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-02.b: Use complex conjugates
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-02.ts";

const own = concept(
  "FM-CP-02.b",
  ["CPLX.CONJUGATE"],
  [
    {
      question: "Write $\\frac{5}{2 + i}$ in the form $a + bi$.",
      correct: "$2 - i$",
      wrong: [
        [
          "$2 + i$",
          "Multiply top and bottom by the conjugate 2 − i: the denominator becomes 5.",
          "CPLX.CONJUGATE",
        ],
        [
          "$\\frac{5}{2} + 5i$",
          "You cannot divide by each part separately. Use the conjugate.",
          "CPLX.ARITHMETIC",
        ],
      ],
      why: "$\\frac{5(2 - i)}{(2 + i)(2 - i)} = \\frac{5(2 - i)}{5} = 2 - i$.",
    },
    {
      question: "What is the complex conjugate of $-3 + 4i$?",
      correct: "$-3 - 4i$",
      wrong: [
        ["$3 - 4i$", "Only the imaginary part changes sign.", "CPLX.CONJUGATE"],
        [
          "$3 + 4i$",
          "The conjugate keeps the real part and changes the sign of the imaginary part.",
          "CPLX.CONJUGATE",
        ],
      ],
      why: "The conjugate of $a + bi$ is $a - bi$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-02.b" };

export default defineGenerator(mixFamilies("FM-CP-02.b", { 1: own, 2: own, 4: base }));
