/**
 * @statement FM-CP-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-02.a: Calculate with complex numbers
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-02.ts";

const own = concept(
  "FM-CP-02.a",
  ["CPLX.ARITHMETIC"],
  [
    {
      question: "Work out $(2 + 3i)(1 - i)$.",
      correct: "$5 + i$",
      wrong: [
        ["$-1 + i$", "i² = −1, so −3i² = +3.", "CPLX.ARITHMETIC"],
        ["$2 - 3i$", "Multiply every term: 2 − 2i + 3i − 3i².", "CPLX.ARITHMETIC"],
      ],
      why: "$2 - 2i + 3i - 3i^2 = 2 + i + 3 = 5 + i$.",
    },
    {
      question: "Work out $(4 - i)^2$.",
      correct: "$15 - 8i$",
      wrong: [
        ["$17 - 8i$", "(−i)² = i² = −1, so 16 − 8i − 1.", "CPLX.ARITHMETIC"],
        ["$16 - i$", "Square the whole bracket: (4 − i)(4 − i).", "CPLX.ARITHMETIC"],
      ],
      why: "$16 - 8i + i^2 = 15 - 8i$.",
    },
  ],
  [
    {
      statement: "Ben says $i^2 = 1$, because a negative times a negative is positive.",
      truth: false,
      right: "False. i is defined by i² = −1. It is not a negative real number.",
      wrong: [
        ["True. Squaring always gives a positive answer.", "CPLX.ARITHMETIC"],
        ["True. i is the same as −1.", "CPLX.ARITHMETIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-02.a" };

export default defineGenerator(mixFamilies("FM-CP-02.a", { 1: base, 2: own, 4: own }));
